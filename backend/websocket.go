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
	Players   []Player  `json:"players"`
	GameState GameState `json:"gameState"`
}

type Position struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

type Player struct {
	Index        int          `json:"index"`
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
			/*  */
			log.Println(gameState.Players)
			gameState.Players = removePlayer(gameState.Players, conns.m[conn])
			log.Println(gameState.Players)
			/*  */
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
			log.Println("sent from frontend ws.js", msg)
			conns.m[conn] = gameState.Players[msg.Player.Index]
			conns.rm[msg.Player] = conn
			conn.WriteMessage(messageType, message) // saada endale tagasi et joinisid
			broadcastPlayerList()                   // saadab koigile playerlisti
			conns.Unlock()
		case "ping":
			msg.Type = "pong"
			msg.Player = conns.m[conn]
			log.Println(gameState.Players)
			log.Println(conns.m)
			broadcast(conn, messageType, msg)
		case "gameState":
			var reply Message
			reply.Type = "gameState"
			reply.GameState = gameState
			respond(conn, messageType, reply)
		case "position":
			gameState.MovePlayer(conns.m[conn], msg.Position)
			var reply Message
			reply.Type = "updateXY"
			reply.Players = gameState.Players
			conns.Lock()
			broadcast(conn, messageType, reply)
			conns.Unlock()

		}
	}
}

func respond(from *websocket.Conn, messageType int, message Message) {
	r, err := json.Marshal(message)
	if err != nil {
		log.Println("respond error:", err)
	}
	from.WriteMessage(messageType, r)
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

func removePlayer(l []Player, item Player) []Player {
	for i, other := range l {
		if other.Username == item.Username {
			return append(l[:i], l[i+1:]...)
		}
	}
	return l
}
