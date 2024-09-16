package backend

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true }, ////sellega kinnitab millised võtab vastu
}

type Connections struct {
	sync.RWMutex
	m  map[*websocket.Conn]Player
	rm map[Player]*websocket.Conn //sama sisu mis eelmises aga key ja value on vastupidi
}

type Message struct {
	Type      string    `json:"type"`
	Data      string    `json:"data"`
	Player    Player    `json:"player"`
	Direction string    `json:"direction"`
	Position  Position  `json:"position"`
	Players   []Player  `json:"players"`
	GameState GameState `json:"gameState"`
	Content   string    `json:"content"`
	//kasuta seda strukti ja salvesta frontendis tulev asi variabli ja saada kõikidele klientidele edasi fronti
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

// võtab tava requesti ja teeb selle websoketiks
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
			conn.WriteMessage(messageType, message) //saada endale tagasi et joinisid
			broadcastPlayerList()                   //saadab koigile playerlisti
			conns.Unlock()
		case "chat_message":
			fmt.Println("received chat message", msg.Content)
			broadcast(conn, messageType, msg)
		case "ping":
			var reply Message
			reply.Type = "pong"
			broadcast(conn, messageType, reply)
		}
	}
}

// LUKAS TEGI SELLE, KUI PUCCIS SIIS TEAB KES TEGI
// saadab kõikidele klientidele sõnumid välja
func broadcast(from *websocket.Conn, messageType int, message Message) {
	message.Player = conns.m[from]
	json, err := json.Marshal(message)
	if err != nil {
		log.Println("broadcast error:", err)
	}
	for conn := range conns.m {
		/* uncomment siis endale ei saada
		if conn == from{
			continue
		} */
		//saadab välja sõnumid kõikidele slice of baitidena
		conn.WriteMessage(messageType, json)
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
