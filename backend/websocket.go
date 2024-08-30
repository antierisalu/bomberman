package backend

import (
	"fmt"
	"net/http"

	"golang.org/x/net/websocket"
)

type Server struct {
	conns   map[Player]*websocket.Conn
	players map[*websocket.Conn]Player
}

type Player struct {
	X        int
	Y        int
	Username string
}

func StartWebSockets() {
	fmt.Println("Starting websocket server")
	server := NewServer()
	http.Handle("/ws", websocket.Handler(server.handleWS))
	http.ListenAndServe(":8008", nil)
}

func (s *Server) handleWS(ws *websocket.Conn) {
	player := s.players[ws]
	fmt.Println("Player connected to ws:", player)
	defer func() {
		delete(s.players, ws)
		delete(s.conns, s.players[ws])

	}()
	for {
		var msg map[string]interface{}
		if err := websocket.JSON.Receive(ws, &msg); err != nil {
			fmt.Println("Error reading message:", err)
			break
		}

		switch msg["type"] {
		case "newPlayer":
			//send out new player pos to piipol
			break
		case "playerMovement":
			//send updated players positions to piipol
			break
		}
	}
}

func NewServer() *Server {
	return &Server{
		conns:   make(map[Player]*websocket.Conn),
		players: make(map[*websocket.Conn]Player),
	}
}
