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
	Type      string   `json:"type"`
	Data      string   `json:"data"`
	Player    Player   `json:"player"`
	Direction string   `json:"direction"`
	Position  Position `json:"position"`
	Players   []Player `json:"players"`
}

type Position struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

type Player struct {
	Username string   `json:"username"`
	Color    string   `json:"color"`
	Position Position `json:"position"`
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
		log.Println(msg)
		switch msg.Type {
		case "join":
			conns.Lock()
			conns.m[conn] = msg.Player
			conns.rm[msg.Player] = conn
			broadcast(conn, messageType, msg) //saada teistele clientitele et joinisid
			broadcastPlayerList()
			conns.Unlock()
		case "ping":
			var reply Message
			reply.Type = "pong"
			broadcast(conn, messageType, reply)
		}
	}
}

func broadcast(from *websocket.Conn, messageType int, message Message) {
	message.Player = conns.m[from]
	r, err := json.Marshal(message)
	if err != nil {
		log.Println("broadcast error:", err)
	}
	for conn, _ := range conns.m {
		/* uncomment siis endale ei saada
		if conn == from{
			continue
		} */
		conn.WriteMessage(messageType, r)
	}
}

func broadcastPlayerList() {
	var players []Player
	for _, player := range conns.m {
		players = append(players, player)
	}
	msg := Message{
		Type:    "player_list",
		Players: players,
	}
	r, err := json.Marshal(msg)
	if err != nil {
		log.Println("broadcastPlayerList error:", err)
		return
	}
	for conn := range conns.m {
		conn.WriteMessage(websocket.TextMessage, r)
	}
}
