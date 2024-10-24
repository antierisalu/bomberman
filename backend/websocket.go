package backend

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Connections struct {
	sync.RWMutex
	m  map[*websocket.Conn]Player
	rm map[Player]*websocket.Conn
}

type Message struct {
	Type      string    `json:"type"`
	Data      string    `json:"data"`
	Player    Player    `json:"player"`
	Direction string    `json:"direction"`
	Position  Position  `json:"position"`
	GameState GameState `json:"gameState"`
}

type Position struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

type Player struct {
	Username     string       `json:"username"`
	Color        string       `json:"color"`
	Position     Position     `json:"position"`
	Lives        int          `json:"lives"`
	Speed        float32      `json:"speed"`
	PowerUpLevel PowerUpLevel `json:"powerUpLevel"`
}

type PowerUpLevel struct {
	Speed  int `json:"speed"`
	Bombs  int `json:"bombs"`
	Flames int `json:"flames"`
}

// WS
var conns = Connections{
	m:  make(map[*websocket.Conn]Player),
	rm: make(map[Player]*websocket.Conn),
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("wsHandler error:", err)
	}
	log.Println("Connecting websocket")
	defer conn.Close()
	reader(conn)
}

func reader(conn *websocket.Conn) {
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println(conns.m[conn].Username, "is disconnecting", err)
			conns.Lock()
			delete(conns.m, conn)
			delete(conns.rm, conns.m[conn])
			conns.Unlock()
			return
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println("unmarshal:", err)
			continue
		}

		switch msg.Type {
		case "join":
			conns.Lock()
			conns.m[conn] = msg.Player
			conns.rm[msg.Player] = conn
			broadcast(conn, messageType, msg) //saada teistele clientitele et joinisid
			gameStateUpdate(conn, gameState)  // saada initial gamestate (to client)
			conns.Unlock()
		}
	}
}

func broadcast(from *websocket.Conn, messageType int, message Message) {
	message.Player = conns.m[from]
	r, err := json.Marshal(message)
	if err != nil {
		log.Println("broadcast error:", err)
	}
	for conn := range conns.m {
		/* uncomment siis endale ei saada
		if conn == from{
			continue
		} */
		conn.WriteMessage(messageType, r)
	}
}

// Sends current gamestate to specified client (ws conn)
func gameStateUpdate(conn *websocket.Conn, gameState GameState) {
	var newMessage Message
	newMessage.Type = "gameStateUpdate"
	newMessage.GameState = gameState

	r, err := json.Marshal(newMessage)
	if err != nil {
		log.Println("gamestate update error:", err)
	}

	conn.WriteMessage(1, r)
}
