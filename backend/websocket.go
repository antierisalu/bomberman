package backend

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true }, ////sellega kinnitab millised võtab vastu
}

type Connections struct {
	sync.RWMutex
	m  map[*websocket.Conn]*Player
	rm map[int]*websocket.Conn //sama sisu mis eelmises aga key ja value on vastupidi
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
	Index        int          `json:"index"`
	Username     string       `json:"username"`
	Position     Position     `json:"position"`
	Lives        int          `json:"lives"`
	Speed        float32      `json:"speed"`
	BombCount    int          `json:"bombCount"`
	BombRange    int          `json:"bombRange"`
	PowerUpLevel PowerUpLevel `json:"powerUpLevel"`
	Immune       bool
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
			delete(conns.rm, conns.m[conn].Index)
			gameState.removePlayer(conns.m[conn])
			delete(conns.m, conn)
			conns.Unlock()

			broadcastPlayerList()

			shouldRestart := true
			for _, p := range gameState.Players {
				if p.Index > -999 {
					shouldRestart = false
					log.Println("shouldn't res")
				}
			}
			if shouldRestart {
				log.Println("restarting")
				gameState.RestartGame()
			}
			return
		}
		if conns.m[conn] != nil {
			conns.Lock()
			conns.m[conn] = &gameState.Players[conns.m[conn].Index]
			conns.Unlock()
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
		case "chat_message":
			fmt.Println("received chat message", msg.Content)
			broadcast(conn, messageType, msg)
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
				x, y := conns.m[conn].CalcPlayerGridPosition()

				if x > 12 || y > 10 || x < 0 || y < 0 {
					conn.Close()
					continue
				}
				conns.Lock()
				conns.m[conn].BombCount--
				conns.Unlock()
				log.Println(conns.m[conn].BombRange, conns.m[conn].BombCount)
				gameState.SetBomb(&gameState.GameGrid[y][x], conns.m[conn].BombRange)

				timer := time.NewTimer(4 * time.Second)

				go func() {
					<-timer.C

					if conns.m[conn] != nil {
						conns.Lock()
						conns.m[conn].BombCount++
						conns.Unlock()
					}
				}()
			}
		case "powerup":
			x, y := GetCellPos(msg.Position.X, msg.Position.Y)
			log.Print(conns.m[conn], "consumed a powerup of type")
			player := &gameState.Players[conns.m[conn].Index]
			conns.Lock()
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
			conns.Unlock()
			gameState.GameGrid[y][x].DropType = -1
			var reply Message
			reply.Type = "gameState"
			reply.GameState = gameState
			broadcast(conn, messageType, reply)
		case "playerInFire":
			player := &gameState.Players[conns.m[conn].Index]
			if !player.Immune {
				player.Lives--
				var reply Message
				reply.Type = "damage"
				reply.Player = *player
				broadcast(conn, messageType, reply)
				log.Println("player", player.Username, "lost a life. lives left:", player.Lives)

				if player.Lives == 0 {
					var reply Message
					reply.Type = "death"
					reply.Player = *player
					broadcast(conn, messageType, reply)
					conn.Close()
					continue
				}

				player.Immune = true
				timer := time.NewTimer(4 * time.Second)
				go func() {
					<-timer.C
					player.Immune = false
				}()
			}
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

// LUKAS TEGI SELLE, KUI PUCCIS SIIS TEAB KES TEGI
// saadab kõikidele klientidele sõnumid välja
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
		conn.WriteMessage(messageType, r)
	}
	conns.Unlock()
}

func broadcastPlayerList() {
	players := gameState.Players
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
