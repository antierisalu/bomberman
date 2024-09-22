package backend

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Connections struct {
	sync.RWMutex
	m  map[*websocket.Conn]*Player
	rm map[int]*websocket.Conn
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
	BombCount    int          `json:"bombCount"`
	BombRange    int          `json:"bombRange"`
	PowerUpLevel PowerUpLevel `json:"powerUpLevel"`
}

type PowerUpLevel struct {
	Speed  int `json:"speed"`
	Bombs  int `json:"bombs"`
	Flames int `json:"flames"`
}

// WS
var conns = Connections{
	m:  make(map[*websocket.Conn]*Player),
	rm: make(map[int]*websocket.Conn),
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
			delete(conns.rm, conns.m[conn].Index)
			gameState.removePlayer(conns.m[conn])
			delete(conns.m, conn)
			conns.Unlock()

			broadcastPlayerList()

			if len(gameState.Players) == 0 {
				gameState.RestartGame()
			}
			return
		}
		if conns.m[conn] != nil {
			conns.m[conn] = &gameState.Players[conns.m[conn].Index]
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println("unmarshal:", err)
			continue
		}
		switch msg.Type {
		case "join":
			conns.Lock()

			// link gameState player to connection
			conns.m[conn] = &gameState.Players[msg.Player.Index]
			conns.rm[msg.Player.Index] = conn
			conn.WriteMessage(messageType, message) // saada endale tagasi et joinisid
			broadcastPlayerList()                   // saadab koigile playerlisti
			conns.Unlock()
		case "ping":
			var reply Message
			reply.Type = "gameState"
			reply.GameState = gameState
			reply.GameState.GameGrid[2][2].BlockType = 0
			msg.Player = *conns.m[conn]
			broadcast(conn, messageType, reply)
		case "gameState":
			var reply Message
			reply.Type = "gameState"
			reply.GameState = gameState
			respond(conn, messageType, reply)
		case "position":
			conns.Lock()
			gameState.MovePlayer(*conns.m[conn], msg.Position)
			conns.Unlock()
			var reply Message
			reply.Type = "updateXY"
			reply.Players = gameState.Players

			broadcast(conn, messageType, reply)

		case "bomb":
			if conns.m[conn].BombCount > 0 {
				conns.m[conn].BombCount--
				x, y := conns.m[conn].CalcPlayerGridPosition()
				log.Println(conns.m[conn].BombRange, conns.m[conn].BombCount)
				gameState.SetBomb(&gameState.GameGrid[y][x], conns.m[conn].BombRange)

				timer := time.NewTimer(4 * time.Second)
				go func() {
					<-timer.C
					conns.m[conn].BombCount++
				}()
			}
		case "powerup":
			x, y := GetCellPos(msg.Position.X, msg.Position.Y)
			log.Print(conns.m[conn], "consumed a powerup of type")
			player := &gameState.Players[conns.m[conn].Index]
			switch gameState.GameGrid[y][x].DropType {
			case 0:
				player.PowerUpLevel.Speed++
				log.Println(" speed")
			case 1:
				player.PowerUpLevel.Bombs++
				player.BombCount++
				log.Println(" Extra Bomb")

			case 2:
				player.PowerUpLevel.Flames++
				player.BombRange++
				log.Println(" Bomb Range")

			}
			gameState.GameGrid[y][x].DropType = -1
			var reply Message
			reply.Type = "gameState"
			reply.GameState = gameState
			broadcast(conn, messageType, reply)
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
	conns.Lock()
	if from != nil {
		message.Player = *conns.m[from]
	}
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
	conns.Unlock()
}

func broadcastPlayerList() {
	var players []Player
	for _, player := range conns.m {
		players = append(players, *player)
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
