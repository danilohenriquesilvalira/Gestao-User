package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/robinson/gos7"
)

type PLCConfig struct {
	IP       string `json:"ip"`
	Rack     int    `json:"rack"`
	Slot     int    `json:"slot"`
	DBNumber int    `json:"db_number"`
}

type Tag struct {
	Type        string  `json:"type"`
	Offset      float64 `json:"offset"`
	Description string  `json:"description"`
}

type Config struct {
	PLCConfig PLCConfig      `json:"plc_config"`
	Tags      map[string]Tag `json:"tags"`
}

type Client struct {
	conn     *websocket.Conn
	send     chan []byte
	hub      *Hub
	lastPing time.Time
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mutex      sync.RWMutex
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	HandshakeTimeout: 10 * time.Second,
}

var config Config
var hub *Hub

// ✅ VARIÁVEIS GLOBAIS PARA CACHE DOS VALORES ATUAIS DO PLC
var currentPLCValues = make(map[string]interface{})
var currentPLCMutex sync.RWMutex
var plcReadAtLeastOnce = false

func main() {
	// Carrega a configuração dos tags
	err := loadConfig("tags.json")
	if err != nil {
		log.Fatalf("Erro ao carregar configuração: %v", err)
	}

	log.Printf("Configuração carregada: PLC %s, DB%d, %d tags",
		config.PLCConfig.IP, config.PLCConfig.DBNumber, len(config.Tags))

	// Inicializa o hub
	hub = &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}

	// Inicia o hub em goroutine separada
	go hub.run()

	// Configura conexão PLC
	handler := gos7.NewTCPClientHandler(config.PLCConfig.IP, config.PLCConfig.Rack, config.PLCConfig.Slot)
	handler.Timeout = 5 * time.Second
	handler.IdleTimeout = 5 * time.Second

	client := gos7.NewClient(handler)

	// Tenta conectar ao PLC
	err = handler.Connect()
	if err != nil {
		log.Printf("⚠️ Não foi possível conectar ao PLC: %v. Continuando sem PLC...", err)
	} else {
		log.Println("✅ Conexão com o PLC estabelecida!")
		defer handler.Close()
	}

	// Inicia leitura PLC (com ou sem conexão)
	go readPLCData(client)

	// Configura rotas HTTP
	http.HandleFunc("/ws", handleWebSocket)

	log.Println("🚀 Servidor WebSocket iniciado em http://localhost:8080/ws")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("❌ Erro no servidor:", err)
	}
}

func (h *Hub) run() {
	ticker := time.NewTicker(120 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			clientCount := len(h.clients)
			h.mutex.Unlock()

			if clientCount == 1 {
				log.Printf("🟢 Cliente conectado. Total: %d", clientCount)
			}

			// ✅ CORREÇÃO PRINCIPAL: Envia valores ATUAIS do PLC
			go h.sendCurrentPLCValues(client)

		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				clientCount := len(h.clients)
				h.mutex.Unlock()

				if clientCount == 0 {
					log.Printf("🔴 Cliente desconectado. Total: %d", clientCount)
				}
			} else {
				h.mutex.Unlock()
			}

		case message := <-h.broadcast:
			h.mutex.RLock()
			clientCount := len(h.clients)
			if clientCount > 0 {
				for client := range h.clients {
					go func(c *Client) {
						select {
						case c.send <- message:
						default:
							h.closeClient(c)
						}
					}(client)
				}
			}
			h.mutex.RUnlock()

		case <-ticker.C:
			h.mutex.RLock()
			if len(h.clients) > 0 {
				for client := range h.clients {
					select {
					case client.send <- []byte(`{"ping":true}`):
					default:
						go h.closeClient(client)
					}
				}
			}
			h.mutex.RUnlock()
		}
	}
}

// ✅ NOVA FUNÇÃO: Envia valores atuais para novo cliente
func (h *Hub) sendCurrentPLCValues(client *Client) {
	currentPLCMutex.RLock()

	// Copia valores atuais
	currentValues := make(map[string]interface{})
	for k, v := range currentPLCValues {
		currentValues[k] = v
	}
	hasValues := len(currentValues) > 0 && plcReadAtLeastOnce
	currentPLCMutex.RUnlock()

	var message map[string]interface{}

	if hasValues {
		// ✅ USA VALORES REAIS DO PLC
		log.Printf("📡 Enviando valores ATUAIS do PLC para novo cliente")
		message = buildMessage(currentValues)
	} else {
		// ✅ VALORES PADRÃO só se PLC nunca foi lido
		log.Printf("📡 PLC ainda não foi lido - enviando valores padrão")
		// ✅ SEM VALORES PADRÃO - SÓ CONECTA AO PLC
		log.Printf("📡 Aguardando dados do PLC...")
		message = buildMessage(map[string]interface{}{})
	}

	if data, err := json.Marshal(message); err == nil {
		select {
		case client.send <- data:
			log.Printf("✅ Dados iniciais enviados para novo cliente")
		default:
			log.Printf("❌ Falha ao enviar dados iniciais")
			h.closeClient(client)
		}
	}
}

func (h *Hub) closeClient(client *Client) {
	h.mutex.Lock()
	defer h.mutex.Unlock()
	if _, ok := h.clients[client]; ok {
		delete(h.clients, client)
		close(client.send)
		client.conn.Close()
	}
}

func loadConfig(filename string) error {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, &config)
}

// ✅ FUNÇÃO CORRIGIDA: Atualiza cache de valores atuais
func readPLCData(client gos7.Client) {
	lastValues := make(map[string]interface{})

	for {
		values := make(map[string]interface{})
		hasChanges := false

		// Lê cada tag configurado
		for tagName, tag := range config.Tags {
			value, err := readTag(client, tag)
			if err != nil {
				if time.Now().Unix()%60 == 0 {
					log.Printf("⚠️ Erro ao ler tag %s: %v", tagName, err)
				}
				continue
			}

			// ✅ ATUALIZA CACHE DE VALORES ATUAIS
			currentPLCMutex.Lock()
			currentPLCValues[tagName] = value
			if !plcReadAtLeastOnce {
				plcReadAtLeastOnce = true
				log.Printf("✅ Primeira leitura do PLC concluída")
			}
			currentPLCMutex.Unlock()

			// Verifica mudanças
			if lastVal, exists := lastValues[tagName]; !exists || lastVal != value {
				hasChanges = true
				lastValues[tagName] = value

				if tag.Type == "bool" {
					log.Printf("🚦 Semáforo %s mudou: %v -> %v", tagName, lastVal, value)
				}
			}
			values[tagName] = value
		}

		// Envia mudanças
		if hasChanges {
			message := buildMessage(values)

			hub.mutex.RLock()
			clientCount := len(hub.clients)
			hub.mutex.RUnlock()

			if clientCount > 0 {
				if data, err := json.Marshal(message); err == nil {
					select {
					case hub.broadcast <- data:
					default:
						go func() {
							hub.broadcast <- data
						}()
					}
				}
			}
		}

		time.Sleep(25 * time.Millisecond)
	}
}

func readTag(client gos7.Client, tag Tag) (interface{}, error) {
	switch tag.Type {
	case "real":
		return readReal(client, int(tag.Offset))
	case "int":
		return readInt(client, int(tag.Offset))
	case "bool":
		return readBool(client, tag.Offset)
	default:
		return nil, fmt.Errorf("tipo de tag não suportado: %s", tag.Type)
	}
}

func readReal(client gos7.Client, offset int) (float32, error) {
	buffer := make([]byte, 4)
	err := client.AGReadDB(config.PLCConfig.DBNumber, offset, 4, buffer)
	if err != nil {
		return 0, err
	}

	bits := binary.BigEndian.Uint32(buffer)
	return math.Float32frombits(bits), nil
}

func readInt(client gos7.Client, offset int) (int16, error) {
	buffer := make([]byte, 2)
	err := client.AGReadDB(config.PLCConfig.DBNumber, offset, 2, buffer)
	if err != nil {
		return 0, err
	}

	return int16(binary.BigEndian.Uint16(buffer)), nil
}

func readBool(client gos7.Client, offset float64) (bool, error) {
	byteOffset := int(offset)
	bitOffset := int(math.Round((offset - float64(byteOffset)) * 10))

	if bitOffset < 0 || bitOffset > 7 {
		return false, fmt.Errorf("bit offset inválido: %d (deve ser 0-7)", bitOffset)
	}

	buffer := make([]byte, 1)
	err := client.AGReadDB(config.PLCConfig.DBNumber, byteOffset, 1, buffer)
	if err != nil {
		return false, err
	}

	result := (buffer[0] & (1 << bitOffset)) != 0
	return result, nil
}

func buildMessage(values map[string]interface{}) map[string]interface{} {
	data := make(map[string]interface{})

	// ✅ NOVOS NÍVEIS DA ECLUSA
	if nivelCaldeira, ok := values["Eclusa_Nivel_Caldeira"]; ok {
		// Limita nível entre 0 e 100
		if nivelFloat, isFloat := nivelCaldeira.(float32); isFloat {
			limitedNivel := math.Max(0, math.Min(100, float64(nivelFloat)))
			data["nivelCaldeiraValue"] = float32(limitedNivel)
		} else {
			data["nivelCaldeiraValue"] = float32(0)
		}
	}

	if nivelMontante, ok := values["Eclusa_Nivel_Montante"]; ok {
		// Limita nível entre 0 e 100
		if nivelFloat, isFloat := nivelMontante.(float32); isFloat {
			limitedNivel := math.Max(0, math.Min(100, float64(nivelFloat)))
			data["nivelMontanteValue"] = float32(limitedNivel)
		} else {
			data["nivelMontanteValue"] = float32(0)
		}
	}

	if nivelJusante, ok := values["Eclusa_Nivel_Jusante"]; ok {
		// Limita nível entre 0 e 100
		if nivelFloat, isFloat := nivelJusante.(float32); isFloat {
			limitedNivel := math.Max(0, math.Min(100, float64(nivelFloat)))
			data["nivelJusanteValue"] = float32(limitedNivel)
		} else {
			data["nivelJusanteValue"] = float32(0)
		}
	}

	// ✅ RADARES DA ECLUSA
	if radarCaldeiraDistancia, ok := values["Eclusa_Radar_Caldeira_Distancia"]; ok {
		if radarFloat, isFloat := radarCaldeiraDistancia.(float32); isFloat {
			data["radarCaldeiraDistanciaValue"] = radarFloat
		} else {
			data["radarCaldeiraDistanciaValue"] = float32(0)
		}
	}

	if radarCaldeiraVelocidade, ok := values["Eclusa_Radar_Caldeira_Velocidade"]; ok {
		if radarFloat, isFloat := radarCaldeiraVelocidade.(float32); isFloat {
			data["radarCaldeiraVelocidadeValue"] = radarFloat
		} else {
			data["radarCaldeiraVelocidadeValue"] = float32(0)
		}
	}

	if radarMontanteDistancia, ok := values["Eclusa_Radar_Montante_Distancia"]; ok {
		if radarFloat, isFloat := radarMontanteDistancia.(float32); isFloat {
			data["radarMontanteDistanciaValue"] = radarFloat
		} else {
			data["radarMontanteDistanciaValue"] = float32(0)
		}
	}

	if radarMontanteVelocidade, ok := values["Eclusa_Radar_Montante_Velocidade"]; ok {
		if radarFloat, isFloat := radarMontanteVelocidade.(float32); isFloat {
			data["radarMontanteVelocidadeValue"] = radarFloat
		} else {
			data["radarMontanteVelocidadeValue"] = float32(0)
		}
	}

	if radarJusanteDistancia, ok := values["Eclusa_Radar_Jusante_Distancia"]; ok {
		if radarFloat, isFloat := radarJusanteDistancia.(float32); isFloat {
			data["radarJusanteDistanciaValue"] = radarFloat
		} else {
			data["radarJusanteDistanciaValue"] = float32(0)
		}
	}

	if radarJusanteVelocidade, ok := values["Eclusa_Radar_Jusante_Velocidade"]; ok {
		if radarFloat, isFloat := radarJusanteVelocidade.(float32); isFloat {
			data["radarJusanteVelocidadeValue"] = radarFloat
		} else {
			data["radarJusanteVelocidadeValue"] = float32(0)
		}
	}

	// ✅ PORTAS DA ECLUSA (atualizados com novos offsets)
	if eclusaPortaJusante, ok := values["Eclusa_Porta_Jusante"]; ok {
		if portaFloat, isFloat := eclusaPortaJusante.(float32); isFloat {
			limitedPorta := math.Max(0, math.Min(100, float64(portaFloat)))
			data["eclusaPortaJusanteValue"] = float32(limitedPorta)
		} else {
			data["eclusaPortaJusanteValue"] = float32(0)
		}
	}

	if eclusaPortaMontante, ok := values["Eclusa_Porta_Montante"]; ok {
		if portaFloat, isFloat := eclusaPortaMontante.(float32); isFloat {
			limitedPorta := math.Max(0, math.Min(100, float64(portaFloat)))
			data["eclusaPortaMontanteValue"] = float32(limitedPorta)
		} else {
			data["eclusaPortaMontanteValue"] = float32(0)
		}
	}

	// ✅ LASERS DA ECLUSA
	if laserMontante, ok := values["Eclusa_Laser_Montante"]; ok {
		if laserFloat, isFloat := laserMontante.(float32); isFloat {
			data["laserMontanteValue"] = laserFloat
		} else {
			data["laserMontanteValue"] = float32(0)
		}
	}

	if laserJusante, ok := values["Eclusa_Laser_Jusante"]; ok {
		if laserFloat, isFloat := laserJusante.(float32); isFloat {
			data["laserJusanteValue"] = laserFloat
		} else {
			data["laserJusanteValue"] = float32(0)
		}
	}

	if porta, ok := values["Porta Jusante"]; ok {
		// Limita porta entre 0 e 100
		if portaFloat, isFloat := porta.(float32); isFloat {
			limitedPorta := math.Max(0, math.Min(100, float64(portaFloat)))
			data["motorValue"] = float32(limitedPorta)
		} else {
			data["motorValue"] = float32(0)
		}
	}

	if contrapesoDireito, ok := values["PortaJusante_ContraPeso Direito"]; ok {
		// Limita contrapeso direito entre 0 e 100
		if contrapesoFloat, isFloat := contrapesoDireito.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["contrapesoDirectoValue"] = float32(limitedContrapeso)
		} else {
			data["contrapesoDirectoValue"] = float32(0)
		}
	}

	if contrapesoEsquerdo, ok := values["PortaJusante_ContraPeso Esquerdo"]; ok {
		// Limita contrapeso esquerdo entre 0 e 100
		if contrapesoFloat, isFloat := contrapesoEsquerdo.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["contrapesoEsquerdoValue"] = float32(limitedContrapeso)
		} else {
			data["contrapesoEsquerdoValue"] = float32(0)
		}
	}

	if motorDireito, ok := values["PortaJusante_MotorDireita"]; ok {
		// Motores são int16, mas limitamos entre 0 e 2 (status)
		if motorInt, isInt := motorDireito.(int16); isInt {
			limitedMotor := int16(math.Max(0, math.Min(2, float64(motorInt))))
			data["motorDireitoValue"] = limitedMotor
		} else {
			data["motorDireitoValue"] = int16(0)
		}
	}

	if motorEsquerdo, ok := values["PortaJusante_MotorEsquerda"]; ok {
		// Motores são int16, mas limitamos entre 0 e 2 (status)
		if motorInt, isInt := motorEsquerdo.(int16); isInt {
			limitedMotor := int16(math.Max(0, math.Min(2, float64(motorInt))))
			data["motorEsquerdoValue"] = limitedMotor
		} else {
			data["motorEsquerdoValue"] = int16(0)
		}
	}

	// Porta Montante tags
	if portaMontante, ok := values["Porta Montante"]; ok {
		// Limita porta montante entre 0 e 100
		if portaFloat, isFloat := portaMontante.(float32); isFloat {
			limitedPorta := math.Max(0, math.Min(100, float64(portaFloat)))
			data["portaMontanteValue"] = float32(limitedPorta)
		} else {
			data["portaMontanteValue"] = float32(0)
		}
	}

	if contrapesoDirectoMontante, ok := values["PortaMontante_ContraPesoDireito"]; ok {
		// Limita contrapeso direito montante entre 0 e 100
		if contrapesoFloat, isFloat := contrapesoDirectoMontante.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["portaMontanteContrapesoDirectoValue"] = float32(limitedContrapeso)
		} else {
			data["portaMontanteContrapesoDirectoValue"] = float32(0)
		}
	}

	if contrapesoEsquerdoMontante, ok := values["PortaMontante_ContraPesoEsquerdo"]; ok {
		// Limita contrapeso esquerdo montante entre 0 e 100
		if contrapesoFloat, isFloat := contrapesoEsquerdoMontante.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["portaMontanteContrapesoEsquerdoValue"] = float32(limitedContrapeso)
		} else {
			data["portaMontanteContrapesoEsquerdoValue"] = float32(0)
		}
	}

	if motorDireitoMontante, ok := values["PortaMontante_MotorDireita"]; ok {
		// Motores são int16, mas limitamos entre 0 e 2 (status)
		if motorInt, isInt := motorDireitoMontante.(int16); isInt {
			limitedMotor := int16(math.Max(0, math.Min(2, float64(motorInt))))
			data["portaMontanteMotorDireitoValue"] = limitedMotor
		} else {
			data["portaMontanteMotorDireitoValue"] = int16(0)
		}
	}

	if motorEsquerdoMontante, ok := values["PortaMontante_MotorEsquerda"]; ok {
		// Motores são int16, mas limitamos entre 0 e 2 (status)
		if motorInt, isInt := motorEsquerdoMontante.(int16); isInt {
			limitedMotor := int16(math.Max(0, math.Min(2, float64(motorInt))))
			data["portaMontanteMotorEsquerdoValue"] = limitedMotor
		} else {
			data["portaMontanteMotorEsquerdoValue"] = int16(0)
		}
	}

	// ✅ SEMÁFOROS DA ECLUSA (novos tags)
	semaforos := make(map[string]bool)

	for i := 0; i <= 3; i++ {
		tagNameVerde := fmt.Sprintf("Eclusa_Semaforo_verde_%d", i)
		if value, ok := values[tagNameVerde]; ok {
			if boolVal, isBool := value.(bool); isBool {
				semaforos[tagNameVerde] = boolVal
			} else {
				semaforos[tagNameVerde] = false
			}
		} else {
			semaforos[tagNameVerde] = false
		}

		tagNameVermelho := fmt.Sprintf("Eclusa_Semaforo_vermelho_%d", i)
		if value, ok := values[tagNameVermelho]; ok {
			if boolVal, isBool := value.(bool); isBool {
				semaforos[tagNameVermelho] = boolVal
			} else {
				semaforos[tagNameVermelho] = false
			}
		} else {
			semaforos[tagNameVermelho] = false
		}
	}

	data["semaforos"] = semaforos

	// ✅ STATUS DA ECLUSA
	if comunicacaoPLC, ok := values["Eclusa_Comunicação_PLC"]; ok {
		if boolVal, isBool := comunicacaoPLC.(bool); isBool {
			data["comunicacaoPLCValue"] = boolVal
		} else {
			data["comunicacaoPLCValue"] = false
		}
	}

	if operacao, ok := values["Eclusa_Operação"]; ok {
		if boolVal, isBool := operacao.(bool); isBool {
			data["operacaoValue"] = boolVal
		} else {
			data["operacaoValue"] = false
		}
	}

	if alarmesAtivo, ok := values["Eclusa_Alarmes_Ativo"]; ok {
		if boolVal, isBool := alarmesAtivo.(bool); isBool {
			data["alarmesAtivoValue"] = boolVal
		} else {
			data["alarmesAtivoValue"] = false
		}
	}

	if emergenciaAtiva, ok := values["Eclusa_Emergencia_Ativa"]; ok {
		if boolVal, isBool := emergenciaAtiva.(bool); isBool {
			data["emergenciaAtivaValue"] = boolVal
		} else {
			data["emergenciaAtivaValue"] = false
		}
	}

	if inundacao, ok := values["Eclusa_Inundacao"]; ok {
		if boolVal, isBool := inundacao.(bool); isBool {
			data["inundacaoValue"] = boolVal
		} else {
			data["inundacaoValue"] = false
		}
	}

	// ✅ PROCESSA PipeSystem array [0..23]
	for i := 0; i < 24; i++ {
		tagName := fmt.Sprintf("PipeSystem[%d]", i)
		if value, ok := values[tagName]; ok {
			if boolVal, isBool := value.(bool); isBool {
				data[fmt.Sprintf("pipe_system_%d", i)] = boolVal
			} else {
				data[fmt.Sprintf("pipe_system_%d", i)] = false
			}
		} else {
			data[fmt.Sprintf("pipe_system_%d", i)] = false
		}
	}

	// ✅ PROCESSA ValvulasOnOFF array [0..5]
	for i := 0; i < 6; i++ {
		tagName := fmt.Sprintf("ValvulasOnOFF[%d]", i)
		if value, ok := values[tagName]; ok {
			if intVal, isInt := value.(int16); isInt {
				data[fmt.Sprintf("valvulas_onoff_%d", i)] = intVal
			} else {
				data[fmt.Sprintf("valvulas_onoff_%d", i)] = int16(0)
			}
		} else {
			data[fmt.Sprintf("valvulas_onoff_%d", i)] = int16(0)
		}
	}

	data["timestamp"] = time.Now().Unix()
	data["connected"] = true

	return data
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	clientIP := r.RemoteAddr
	hub.mutex.RLock()
	sameIPCount := 0
	for client := range hub.clients {
		if client.conn.RemoteAddr().String() == clientIP {
			sameIPCount++
		}
	}
	hub.mutex.RUnlock()

	if sameIPCount >= 2 {
		log.Printf("⚠️ Muitas conexões do IP %s (%d), rejeitando", clientIP, sameIPCount)
		http.Error(w, "Muitas conexões", http.StatusTooManyRequests)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("❌ Erro no upgrade WebSocket: %v", err)
		return
	}

	client := &Client{
		conn:     conn,
		send:     make(chan []byte, 256),
		hub:      hub,
		lastPing: time.Now(),
	}

	client.hub.register <- client

	go client.writePump()
	go client.readPump()
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadDeadline(time.Now().Add(120 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(120 * time.Second))
		c.lastPing = time.Now()
		return nil
	})

	for {
		_, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err,
				websocket.CloseGoingAway,
				websocket.CloseAbnormalClosure,
				websocket.CloseNoStatusReceived) {
				log.Printf("⚠️ Erro inesperado no WebSocket: %v", err)
			}
			break
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(90 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(15 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(15 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
