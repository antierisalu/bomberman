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
	GameState GameState `json:"gameState"`
	Messages  string    `json:"messages"`
	//kasuta seda strukti ja salvesta frontendis tulev asi variabli ja saada kõikidele klientidele edasi fronti
}

type Position struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

type Player struct {
	Username string   `json:"username"`
	Color    string   `json:"color"`
	Position Position `json:"position"`
	Lives    int      `json:"lives"`
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

		switch msg.Type {
		case "join":
			conns.Lock()
			conns.m[conn] = msg.Player
			conns.rm[msg.Player] = conn
			broadcast(conn, messageType, msg) //saada teistele clientitele et joinisid
			gameStateUpdate(conn, gameState)  // saada initial gamestate (to client)
			conns.Unlock()
			/* case "chat_message":
			for usrConn := range conns.m {
				err := usrConn.WriteMessage(1, Messages)
				if err != nil {
					log.Println("writemessage:", err)
				}
			}
			conns.Lock()
			conns.m[conn] = msg.Messages
			conns.rm[msg.Messages] = conn
			broadcast(conn, messageType, msg)
			gameStateUpdate(conn, gameState)
			conns.Unlock() */
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
