package services

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"sync"
	"time"

	"github.com/robinson/gos7"
)

type PLCConfig struct {
	IP       string `json:"ip"`
	Rack     int    `json:"rack"`
	Slot     int    `json:"slot"`
	DBNumber int    `json:"db_number"`
}

type PLCTag struct {
	Type        string  `json:"type"`
	Offset      float64 `json:"offset"`
	Description string  `json:"description"`
}

type PLCConfigFile struct {
	PLCConfig PLCConfig           `json:"plc_config"`
	Tags      map[string]PLCTag   `json:"tags"`
}

type S7PLCConnector struct {
	config       PLCConfigFile
	client       gos7.Client
	handler      *gos7.TCPClientHandler
	isConnected  bool
	mutex        sync.RWMutex
	hub          *WebSocketHub
	stopChan     chan bool
	
	// Cache para valores atuais
	currentValues     map[string]interface{}
	currentMutex      sync.RWMutex
	plcReadAtLeastOnce bool
	lastValues        map[string]interface{}
}

var (
	globalS7Connector *S7PLCConnector
	s7Once            sync.Once
)

// GetS7PLCConnector retorna instância singleton do conector S7
func GetS7PLCConnector() *S7PLCConnector {
	s7Once.Do(func() {
		globalS7Connector = &S7PLCConnector{
			hub:           GetWebSocketHub(),
			stopChan:      make(chan bool, 1),
			currentValues: make(map[string]interface{}),
			lastValues:    make(map[string]interface{}),
		}

		// Carregar configuração
		if err := globalS7Connector.loadConfig("tags.json"); err != nil {
			log.Printf("❌ Erro ao carregar tags.json: %v", err)
			// Tentar carregar do websocket antigo
			if err2 := globalS7Connector.loadConfig("../websocket/tags.json"); err2 != nil {
				log.Printf("❌ Erro ao carregar ../websocket/tags.json: %v", err2)
				// Configuração padrão
				globalS7Connector.setupDefaultConfig()
			}
		}

		log.Printf("✅ S7 PLC Connector inicializado: %s DB%d, %d tags", 
			globalS7Connector.config.PLCConfig.IP, 
			globalS7Connector.config.PLCConfig.DBNumber, 
			len(globalS7Connector.config.Tags))

		// Iniciar conexão e leitura
		go globalS7Connector.connectLoop()
		go globalS7Connector.readLoop()
	})

	return globalS7Connector
}

func (s7 *S7PLCConnector) loadConfig(filename string) error {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, &s7.config)
}

func (s7 *S7PLCConnector) setupDefaultConfig() {
	s7.config = PLCConfigFile{
		PLCConfig: PLCConfig{
			IP:       "192.168.1.33",
			Rack:     0,
			Slot:     1,
			DBNumber: 19,
		},
		Tags: map[string]PLCTag{
			"Eclusa_Nivel_Caldeira": {
				Type:        "real",
				Offset:      0.0,
				Description: "Eclusa Nível Caldeira (Real)",
			},
			"Eclusa_Nivel_Montante": {
				Type:        "real", 
				Offset:      4.0,
				Description: "Eclusa Nível Montante (Real)",
			},
			"Eclusa_Nivel_Jusante": {
				Type:        "real",
				Offset:      8.0,
				Description: "Eclusa Nível Jusante (Real)",
			},
		},
	}
}

func (s7 *S7PLCConnector) connectLoop() {
	for {
		select {
		case <-s7.stopChan:
			return
		default:
			if !s7.isConnected {
				s7.connect()
			}
			time.Sleep(5 * time.Second)
		}
	}
}

func (s7 *S7PLCConnector) connect() {
	s7.mutex.Lock()
	defer s7.mutex.Unlock()

	if s7.isConnected {
		return
	}

	// Configurar handler S7
	s7.handler = gos7.NewTCPClientHandler(
		s7.config.PLCConfig.IP,
		s7.config.PLCConfig.Rack,
		s7.config.PLCConfig.Slot,
	)
	s7.handler.Timeout = 5 * time.Second
	s7.handler.IdleTimeout = 5 * time.Second

	s7.client = gos7.NewClient(s7.handler)

	// Tentar conectar
	err := s7.handler.Connect()
	if err != nil {
		log.Printf("⚠️ Erro ao conectar S7 PLC %s: %v", s7.config.PLCConfig.IP, err)
		return
	}

	s7.isConnected = true
	log.Printf("✅ Conectado ao S7 PLC %s DB%d", s7.config.PLCConfig.IP, s7.config.PLCConfig.DBNumber)
}

func (s7 *S7PLCConnector) disconnect() {
	s7.mutex.Lock()
	defer s7.mutex.Unlock()

	if s7.handler != nil {
		s7.handler.Close()
		s7.handler = nil
	}

	s7.isConnected = false
	log.Printf("🔌 Desconectado do S7 PLC")
}

func (s7 *S7PLCConnector) readLoop() {
	ticker := time.NewTicker(25 * time.Millisecond) // 40 Hz como no código antigo
	defer ticker.Stop()

	for {
		select {
		case <-s7.stopChan:
			return
		case <-ticker.C:
			if s7.isConnected {
				s7.readAllTags()
			}
		}
	}
}

func (s7 *S7PLCConnector) readAllTags() {
	values := make(map[string]interface{})
	hasChanges := false

	// Ler cada tag configurado
	for tagName, tag := range s7.config.Tags {
		value, err := s7.readTag(tag)
		if err != nil {
			// Log erro apenas a cada 60 segundos
			if time.Now().Unix()%60 == 0 {
				log.Printf("⚠️ Erro ao ler tag %s: %v", tagName, err)
			}
			continue
		}

		// Atualizar cache de valores atuais
		s7.currentMutex.Lock()
		s7.currentValues[tagName] = value
		if !s7.plcReadAtLeastOnce {
			s7.plcReadAtLeastOnce = true
			log.Printf("✅ Primeira leitura do S7 PLC concluída")
		}
		s7.currentMutex.Unlock()

		// Verificar mudanças
		if lastVal, exists := s7.lastValues[tagName]; !exists || lastVal != value {
			hasChanges = true
			s7.lastValues[tagName] = value

			// Log para semáforos
			if tag.Type == "bool" {
				log.Printf("🚦 S7 Tag %s mudou: %v -> %v", tagName, lastVal, value)
			}
		}
		values[tagName] = value

	}

	// Broadcast mudanças via WebSocket
	if hasChanges {
		s7.broadcastValues(values)
	}
}

func (s7 *S7PLCConnector) readTag(tag PLCTag) (interface{}, error) {
	switch tag.Type {
	case "real":
		return s7.readReal(int(tag.Offset))
	case "int":
		return s7.readInt(int(tag.Offset))
	case "bool":
		return s7.readBool(tag.Offset)
	default:
		return nil, fmt.Errorf("tipo de tag não suportado: %s", tag.Type)
	}
}

func (s7 *S7PLCConnector) readReal(offset int) (float32, error) {
	if !s7.isConnected {
		return 0, fmt.Errorf("S7 PLC não conectado")
	}

	buffer := make([]byte, 4)
	err := s7.client.AGReadDB(s7.config.PLCConfig.DBNumber, offset, 4, buffer)
	if err != nil {
		s7.disconnect() // Desconectar em caso de erro
		return 0, err
	}

	bits := binary.BigEndian.Uint32(buffer)
	return math.Float32frombits(bits), nil
}

func (s7 *S7PLCConnector) readInt(offset int) (int16, error) {
	if !s7.isConnected {
		return 0, fmt.Errorf("S7 PLC não conectado")
	}

	buffer := make([]byte, 2)
	err := s7.client.AGReadDB(s7.config.PLCConfig.DBNumber, offset, 2, buffer)
	if err != nil {
		s7.disconnect() // Desconectar em caso de erro
		return 0, err
	}

	return int16(binary.BigEndian.Uint16(buffer)), nil
}

func (s7 *S7PLCConnector) readBool(offset float64) (bool, error) {
	if !s7.isConnected {
		return false, fmt.Errorf("S7 PLC não conectado")
	}

	byteOffset := int(offset)
	bitOffset := int(math.Round((offset - float64(byteOffset)) * 10))

	if bitOffset < 0 || bitOffset > 7 {
		return false, fmt.Errorf("bit offset inválido: %d (deve ser 0-7)", bitOffset)
	}

	buffer := make([]byte, 1)
	err := s7.client.AGReadDB(s7.config.PLCConfig.DBNumber, byteOffset, 1, buffer)
	if err != nil {
		s7.disconnect() // Desconectar em caso de erro
		return false, err
	}

	result := (buffer[0] & (1 << bitOffset)) != 0
	return result, nil
}


func (s7 *S7PLCConnector) broadcastValues(values map[string]interface{}) {
	// Usar a função buildMessage do websocket antigo
	message := s7.buildWebSocketMessage(values)
	
	log.Printf("🚀 BROADCAST: Enviando mensagem WebSocket com %d campos", len(message))
	log.Printf("🚀 BROADCAST: Dados: %+v", message)
	
	if data, err := json.Marshal(message); err == nil {
		log.Printf("🚀 BROADCAST: JSON serializado com %d bytes", len(data))
		// Usar o hub para broadcast
		select {
		case s7.hub.broadcast <- data:
			log.Printf("✅ BROADCAST: Mensagem enviada para canal")
		default:
			// Se canal estiver cheio, enviar em goroutine
			log.Printf("⚠️ BROADCAST: Canal cheio, enviando em goroutine")
			go func() {
				s7.hub.broadcast <- data
			}()
		}
	} else {
		log.Printf("❌ BROADCAST: Erro ao serializar JSON: %v", err)
	}
}

// Copiar a função buildMessage do código antigo
func (s7 *S7PLCConnector) buildWebSocketMessage(values map[string]interface{}) map[string]interface{} {
	data := make(map[string]interface{})

	// NOVOS NÍVEIS DA ECLUSA
	if nivelCaldeira, ok := values["Eclusa_Nivel_Caldeira"]; ok {
		if nivelFloat, isFloat := nivelCaldeira.(float32); isFloat {
			limitedNivel := math.Max(0, math.Min(100, float64(nivelFloat)))
			data["nivelCaldeiraValue"] = float32(limitedNivel)
		} else {
			data["nivelCaldeiraValue"] = float32(0)
		}
	}

	if nivelMontante, ok := values["Eclusa_Nivel_Montante"]; ok {
		if nivelFloat, isFloat := nivelMontante.(float32); isFloat {
			limitedNivel := math.Max(0, math.Min(100, float64(nivelFloat)))
			data["nivelMontanteValue"] = float32(limitedNivel)
		} else {
			data["nivelMontanteValue"] = float32(0)
		}
	}

	if nivelJusante, ok := values["Eclusa_Nivel_Jusante"]; ok {
		if nivelFloat, isFloat := nivelJusante.(float32); isFloat {
			limitedNivel := math.Max(0, math.Min(100, float64(nivelFloat)))
			data["nivelJusanteValue"] = float32(limitedNivel)
		} else {
			data["nivelJusanteValue"] = float32(0)
		}
	}

	// RADARES DA ECLUSA
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

	// PORTAS DA ECLUSA
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

	// STATUS DA ECLUSA
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

	// ✅ RADARES MONTANTE E JUSANTE (FALTAVAM)
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

	// ✅ LASERS DA ECLUSA (FALTAVAM)
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

	// ✅ STATUS DA ECLUSA EXTRAS (FALTAVAM)
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

	// ✅ PORTAS LEGADAS (PARA COMPATIBILIDADE COM COMPONENTES ANTIGOS)
	if portaJusante, ok := values["Porta Jusante"]; ok {
		if portaFloat, isFloat := portaJusante.(float32); isFloat {
			limitedPorta := math.Max(0, math.Min(100, float64(portaFloat)))
			data["nivelValue"] = float32(limitedPorta) // compat. antiga
			data["motorValue"] = float32(limitedPorta) // compat. antiga
		}
	}

	if portaMontante, ok := values["Porta Montante"]; ok {
		if portaFloat, isFloat := portaMontante.(float32); isFloat {
			limitedPorta := math.Max(0, math.Min(100, float64(portaFloat)))
			data["portaMontanteValue"] = float32(limitedPorta)
		}
	}

	// ✅ CONTRAPES OS PORTAS (FALTAVAM)
	if contrapesoJusanteDireito, ok := values["PortaJusante_ContraPeso Direito"]; ok {
		if contrapesoFloat, isFloat := contrapesoJusanteDireito.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["contrapesoDirectoValue"] = float32(limitedContrapeso)
		}
	}

	if contrapesoJusanteEsquerdo, ok := values["PortaJusante_ContraPeso Esquerdo"]; ok {
		if contrapesoFloat, isFloat := contrapesoJusanteEsquerdo.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["contrapesoEsquerdoValue"] = float32(limitedContrapeso)
		}
	}

	if contrapesoMontanteDireito, ok := values["PortaMontante_ContraPesoDireito"]; ok {
		if contrapesoFloat, isFloat := contrapesoMontanteDireito.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["portaMontanteContrapesoDirectoValue"] = float32(limitedContrapeso)
		}
	}

	if contrapesoMontanteEsquerdo, ok := values["PortaMontante_ContraPesoEsquerdo"]; ok {
		if contrapesoFloat, isFloat := contrapesoMontanteEsquerdo.(float32); isFloat {
			limitedContrapeso := math.Max(0, math.Min(100, float64(contrapesoFloat)))
			data["portaMontanteContrapesoEsquerdoValue"] = float32(limitedContrapeso)
		}
	}

	// ✅ MOTORES DAS PORTAS (FALTAVAM)
	if motorJusanteDireito, ok := values["PortaJusante_MotorDireita"]; ok {
		if motorInt, isInt := motorJusanteDireito.(int16); isInt {
			limitedMotor := math.Max(0, math.Min(2, float64(motorInt)))
			data["motorDireitoValue"] = int(limitedMotor)
		}
	}

	if motorJusanteEsquerdo, ok := values["PortaJusante_MotorEsquerda"]; ok {
		if motorInt, isInt := motorJusanteEsquerdo.(int16); isInt {
			limitedMotor := math.Max(0, math.Min(2, float64(motorInt)))
			data["motorEsquerdoValue"] = int(limitedMotor)
		}
	}

	if motorMontanteDireito, ok := values["PortaMontante_MotorDireita"]; ok {
		if motorInt, isInt := motorMontanteDireito.(int16); isInt {
			limitedMotor := math.Max(0, math.Min(2, float64(motorInt)))
			data["portaMontanteMotorDireitoValue"] = int(limitedMotor)
		}
	}

	if motorMontanteEsquerdo, ok := values["PortaMontante_MotorEsquerda"]; ok {
		if motorInt, isInt := motorMontanteEsquerdo.(int16); isInt {
			limitedMotor := math.Max(0, math.Min(2, float64(motorInt)))
			data["portaMontanteMotorEsquerdoValue"] = int(limitedMotor)
		}
	}

	// ✅ COTAS CALCULADAS (baseadas nos níveis)
	if nivelCaldeira, ok := values["Eclusa_Nivel_Caldeira"]; ok {
		if nivelFloat, isFloat := nivelCaldeira.(float32); isFloat {
			// Converte percentual (0-100) para cota em metros (assumindo faixa de 0-25m)
			cotaCalculada := float64(nivelFloat) * 25.0 / 100.0
			data["cotaCaldeiraValue"] = float32(cotaCalculada)
		}
	}

	if nivelMontante, ok := values["Eclusa_Nivel_Montante"]; ok {
		if nivelFloat, isFloat := nivelMontante.(float32); isFloat {
			// Converte percentual para cota em metros
			cotaCalculada := float64(nivelFloat) * 25.0 / 100.0
			data["cotaMontanteValue"] = float32(cotaCalculada)
		}
	}

	if nivelJusante, ok := values["Eclusa_Nivel_Jusante"]; ok {
		if nivelFloat, isFloat := nivelJusante.(float32); isFloat {
			// Converte percentual para cota em metros
			cotaCalculada := float64(nivelFloat) * 25.0 / 100.0
			data["cotaJusanteValue"] = float32(cotaCalculada)
		}
	}

	// ✅ RADAR DISTÂNCIA LEGADO (compatibilidade)
	if radarCaldeiraDistancia, ok := values["Eclusa_Radar_Caldeira_Distancia"]; ok {
		if radarFloat, isFloat := radarCaldeiraDistancia.(float32); isFloat {
			data["radarDistanciaValue"] = radarFloat // Para compatibilidade antiga
		}
	}

	// SEMÁFOROS DA ECLUSA
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

	// PROCESSA PipeSystem array [0..23]
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

	// PROCESSA ValvulasOnOFF array [0..5]
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

// SendCurrentValues envia valores atuais para um novo cliente
func (s7 *S7PLCConnector) SendCurrentValues(clientSend chan []byte) {
	s7.currentMutex.RLock()
	currentValues := make(map[string]interface{})
	for k, v := range s7.currentValues {
		currentValues[k] = v
	}
	hasValues := len(currentValues) > 0 && s7.plcReadAtLeastOnce
	s7.currentMutex.RUnlock()

	var message map[string]interface{}

	if hasValues {
		log.Printf("📡 Enviando valores ATUAIS do S7 PLC para novo cliente")
		message = s7.buildWebSocketMessage(currentValues)
	} else {
		log.Printf("📡 S7 PLC ainda não foi lido - aguardando dados...")
		message = s7.buildWebSocketMessage(map[string]interface{}{})
	}

	if data, err := json.Marshal(message); err == nil {
		select {
		case clientSend <- data:
			log.Printf("✅ Dados S7 iniciais enviados para novo cliente")
		default:
			log.Printf("❌ Falha ao enviar dados S7 iniciais")
		}
	}
}

// GetStatus retorna status da conexão S7
func (s7 *S7PLCConnector) GetStatus() map[string]interface{} {
	s7.mutex.RLock()
	defer s7.mutex.RUnlock()

	return map[string]interface{}{
		"connected":     s7.isConnected,
		"ip":            s7.config.PLCConfig.IP,
		"db":            s7.config.PLCConfig.DBNumber,
		"tags_count":    len(s7.config.Tags),
		"read_at_least_once": s7.plcReadAtLeastOnce,
	}
}

// Stop para o conector S7
func (s7 *S7PLCConnector) Stop() {
	close(s7.stopChan)
	s7.disconnect()
	log.Printf("🛑 S7 PLC Connector parado")
}