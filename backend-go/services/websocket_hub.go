package services

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"backend-go/models"
)

// WebSocketHub gerencia conexões WebSocket de forma eficiente
type WebSocketHub struct {
	// Conexões ativas
	clients    map[*WebSocketClient]bool
	
	// Canais para comunicação
	broadcast  chan []byte
	register   chan *WebSocketClient
	unregister chan *WebSocketClient
	
	// Cache de tags para broadcast eficiente
	lastMessage []byte
	lastUpdate  time.Time
	
	// Mutex para thread safety
	mutex sync.RWMutex
	
	// Configurações otimizadas
	broadcastInterval time.Duration
	pingInterval      time.Duration
	messageBuffer     int
	maxClients        int
}

// WebSocketClient representa uma conexão de cliente
type WebSocketClient struct {
	hub        *WebSocketHub
	conn       *websocket.Conn
	send       chan []byte
	lastPong   time.Time
	userAgent  string
	remoteAddr string
}

var (
	globalHub *WebSocketHub
	hubOnce   sync.Once
)

// Upgrader WebSocket com configurações otimizadas
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Em produção, implementar verificação de origem adequada
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	
	// Configurações para performance
	EnableCompression: true,
}

// GetWebSocketHub retorna instância singleton do hub
func GetWebSocketHub() *WebSocketHub {
	hubOnce.Do(func() {
		globalHub = &WebSocketHub{
			clients:           make(map[*WebSocketClient]bool),
			broadcast:         make(chan []byte, 512), // Buffer maior
			register:          make(chan *WebSocketClient, 100),
			unregister:        make(chan *WebSocketClient, 100),
			broadcastInterval: 50 * time.Millisecond,  // 20 FPS otimizado
			pingInterval:      120 * time.Second, // 2 minutos - menos agressivo
			messageBuffer:     256,
			maxClients:        100,
		}
		
		// Iniciar hub em goroutine
		go globalHub.run()
		
		// Nota: broadcast é feito pelo S7PLCConnector
		
		// Iniciar ping automático
		go globalHub.autoPing()
		
		log.Printf("🌐 WebSocket Hub iniciado")
	})
	
	return globalHub
}

// HandleWebSocket gerencia upgrade de conexão HTTP para WebSocket
func (h *WebSocketHub) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("❌ Erro no upgrade WebSocket: %v", err)
		return
	}
	
	client := &WebSocketClient{
		hub:        h,
		conn:       conn,
		send:       make(chan []byte, 256),
		lastPong:   time.Now(),
		userAgent:  r.UserAgent(),
		remoteAddr: r.RemoteAddr,
	}
	
	// Configurar pong handler
	client.conn.SetPongHandler(func(string) error {
		client.lastPong = time.Now()
		return nil
	})
	
	// Registrar cliente
	h.register <- client
	
	// Iniciar goroutines para leitura e escrita
	go client.writePump()
	go client.readPump()
	
	log.Printf("🔗 Novo cliente WebSocket: %s", client.remoteAddr)
}

// run processa mensagens do hub
func (h *WebSocketHub) run() {
	for {
		select {
		case client := <-h.register:
			h.mutex.Lock()
			h.clients[client] = true
			clientCount := len(h.clients)
			h.mutex.Unlock()
			
			// Enviar dados atuais do S7 PLC para o novo cliente
			go func() {
				s7Connector := GetS7PLCConnector()
				s7Connector.SendCurrentValues(client.send)
			}()
			
			log.Printf("✅ Cliente registrado. Total: %d", clientCount)
			
		case client := <-h.unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mutex.Unlock()
			
			log.Printf("❌ Cliente desconectado. Total: %d", len(h.clients))
			
		case message := <-h.broadcast:
			log.Printf("📨 HUB: Recebido broadcast com %d bytes", len(message))
			h.broadcastMessage(message)
		}
	}
}

// broadcastMessage envia mensagem para todos os clientes
func (h *WebSocketHub) broadcastMessage(message []byte) {
	h.mutex.RLock()
	clients := make([]*WebSocketClient, 0, len(h.clients))
	for client := range h.clients {
		clients = append(clients, client)
	}
	h.mutex.RUnlock()
	
	log.Printf("📤 HUB: Enviando para %d clientes conectados", len(clients))
	
	// Broadcast paralelo para melhor performance
	var wg sync.WaitGroup
	for _, client := range clients {
		wg.Add(1)
		go func(c *WebSocketClient) {
			defer wg.Done()
			
			select {
			case c.send <- message:
				log.Printf("✅ HUB: Mensagem enviada para cliente %s", c.remoteAddr)
			default:
				// Canal cheio, remover cliente
				log.Printf("❌ HUB: Canal cheio para cliente %s, removendo", c.remoteAddr)
				h.mutex.Lock()
				if _, ok := h.clients[c]; ok {
					delete(h.clients, c)
					close(c.send)
				}
				h.mutex.Unlock()
			}
		}(client)
	}
	
	wg.Wait()
	log.Printf("📤 HUB: Broadcast concluído")
}


// autoPing envia ping para manter conexões vivas
func (h *WebSocketHub) autoPing() {
	ticker := time.NewTicker(h.pingInterval)
	defer ticker.Stop()
	
	for range ticker.C {
		h.mutex.RLock()
		clients := make([]*WebSocketClient, 0, len(h.clients))
		for client := range h.clients {
			clients = append(clients, client)
		}
		h.mutex.RUnlock()
		
		for _, client := range clients {
			// Verificar se cliente respondeu ao último ping (timeout mais generoso)
			if time.Since(client.lastPong) > h.pingInterval*3 { // 6 minutos de timeout
				log.Printf("⚠️ Cliente sem resposta, removendo: %s", client.remoteAddr)
				h.unregister <- client
				continue
			}
			
			// Enviar ping
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				h.unregister <- client
			}
		}
	}
}

// BroadcastTagUpdate envia atualização específica de tag
func (h *WebSocketHub) BroadcastTagUpdate(tagName string, value float64) {
	if len(h.clients) == 0 {
		return
	}
	
	message := models.WebSocketMessage{
		Type:      "tag_single_update",
		Timestamp: time.Now(),
		Data: map[string]interface{}{
			tagName: map[string]interface{}{
				"value":      value,
				"updated_at": time.Now(),
			},
		},
	}
	
	data, err := json.Marshal(message)
	if err != nil {
		log.Printf("❌ Erro ao serializar update de tag: %v", err)
		return
	}
	
	select {
	case h.broadcast <- data:
		// Sucesso
	default:
		log.Printf("⚠️ Canal de broadcast cheio para update de tag")
	}
}

// GetStats retorna estatísticas do hub
func (h *WebSocketHub) GetStats() map[string]interface{} {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	
	return map[string]interface{}{
		"connected_clients":   len(h.clients),
		"last_update":        h.lastUpdate,
		"broadcast_interval": h.broadcastInterval.String(),
		"ping_interval":      h.pingInterval.String(),
	}
}

// readPump processa mensagens recebidas do cliente
func (c *WebSocketClient) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	
	// Configurações de timeout mais permissivas
	c.conn.SetReadDeadline(time.Now().Add(300 * time.Second)) // 5 minutos
	
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("⚠️ Erro inesperado no WebSocket: %v", err)
			}
			break
		}
		
		// Processar mensagem recebida (se necessário)
		log.Printf("📨 Mensagem recebida: %s", string(message))
		
		// Resetar timeout
		c.conn.SetReadDeadline(time.Now().Add(300 * time.Second))
	}
}

// writePump envia mensagens para o cliente
func (c *WebSocketClient) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			
			if err := c.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
			
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}