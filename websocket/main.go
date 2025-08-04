package main

import (
	"encoding/binary"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/robinson/gos7"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var broadcast = make(chan string)
var clients = make(map[*websocket.Conn]bool)

func main() {
	handler := gos7.NewTCPClientHandler("192.168.0.33", 0, 1)
	handler.Timeout = 10 * time.Second
	handler.IdleTimeout = 10 * time.Second

	defer handler.Close()

	client := gos7.NewClient(handler)

	err := handler.Connect()
	if err != nil {
		log.Fatalf("Erro fatal ao conectar com o PLC: %v", err)
	}
	log.Println("Conexão com o PLC estabelecida com sucesso!")

	go readPLCData(client)
	go handleMessages()

	http.HandleFunc("/ws", handleConnections)

	log.Println("Servidor WebSocket iniciado em http://localhost:8080/ws")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}

// Mapeia o valor do PLC para um nível visual mais interessante
func mapPLCValueToLevel(rawValue int16) int {
	if rawValue == 0 {
		return 0
	} else if rawValue == 1 {
		return 75
	}

	if rawValue < 0 {
		return 0
	} else if rawValue > 100 {
		return 100
	}

	return int(rawValue)
}

// Mapeia o valor do motor (Teste_1)
func mapPLCValueToMotor(rawValue int16) int {
	// 0 = inativo, 1 = operando, 2 = falha
	if rawValue == 0 {
		return 0
	} else if rawValue == 1 {
		return 1
	} else if rawValue == 2 {
		return 2
	}

	// Para outros valores, considera operando
	if rawValue > 0 {
		return 1
	}
	return 0
}

func readPLCData(client gos7.Client) {
	for {
		dbNumber := 19

		// Lê a primeira variável (nível) - DB19.DBW0
		byteOffset := 0
		size := 2
		buffer1 := make([]byte, size)

		err := client.AGReadDB(dbNumber, byteOffset, size, buffer1)
		if err != nil {
			log.Printf("Erro ao ler do PLC (DB%d.DBW%d): %v", dbNumber, byteOffset, err)
			time.Sleep(2 * time.Second)
			continue
		}

		// Lê a segunda variável (motor Teste_1) - DB19.DBW2
		byteOffset2 := 2
		buffer2 := make([]byte, size)

		err = client.AGReadDB(dbNumber, byteOffset2, size, buffer2)
		if err != nil {
			log.Printf("Erro ao ler motor do PLC (DB%d.DBW%d): %v", dbNumber, byteOffset2, err)
			time.Sleep(2 * time.Second)
			continue
		}

		// Processa os valores
		rawValue1 := int16(binary.BigEndian.Uint16(buffer1))
		rawValue2 := int16(binary.BigEndian.Uint16(buffer2))

		levelValue := mapPLCValueToLevel(rawValue1)
		motorValue := mapPLCValueToMotor(rawValue2)

		log.Printf("PLC - Nível: %d->%d%% | Motor: %d->%d | Clientes: %d",
			rawValue1, levelValue, rawValue2, motorValue, len(clients))

		// Envia mensagem com os dois valores
		message := fmt.Sprintf("Nivel:%d,Motor:%d", levelValue, motorValue)

		// Só envia se houver clientes conectados
		if len(clients) > 0 {
			broadcast <- message
		}

		time.Sleep(1 * time.Second)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Erro no upgrade para WebSocket: %v", err)
		return
	}
	defer func() {
		ws.Close()
		delete(clients, ws)
		log.Printf("Cliente desconectado. Clientes restantes: %d", len(clients))
	}()

	clients[ws] = true
	log.Printf("Novo cliente WebSocket conectado. Total: %d", len(clients))

	// Envia valor inicial com as duas variáveis
	initialMessage := "Nivel:75,Motor:1"
	err = ws.WriteMessage(websocket.TextMessage, []byte(initialMessage))
	if err != nil {
		log.Printf("Erro ao enviar mensagem inicial: %v", err)
		return
	}

	// Mantém a conexão aberta e trata pings/pongs
	for {
		messageType, _, err := ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Erro no WebSocket: %v", err)
			}
			break
		}

		// Responde a pings
		if messageType == websocket.PingMessage {
			ws.WriteMessage(websocket.PongMessage, nil)
		}
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		log.Printf("Enviando para %d clientes: %s", len(clients), msg)

		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, []byte(msg))
			if err != nil {
				log.Printf("Erro ao enviar mensagem: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
