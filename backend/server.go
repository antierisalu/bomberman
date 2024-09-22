package backend

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func enableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:9000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

var gameState GameState

func InitGame() {
	gameState.Timer.Active = false
	if gameState.SpawnPoints == nil {
		gameState.SpawnPoints = []Position{}
	}

	gameState.GenerateGameGrid()
}

func StartServer() {
	mux := http.NewServeMux()
	mux.HandleFunc("/newPlayer", handleNewPlayer)
	mux.HandleFunc("/ws", wsHandler)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "./frontend/index.html")
		} else {
			http.FileServer(http.Dir("./frontend")).ServeHTTP(w, r)
		}
	})
	handlerWithCors := enableCors(mux)
	fmt.Println("Bomberman is running on localhost:8080")
	InitGame()
	http.ListenAndServe(":8080", handlerWithCors)
}

func handleNewPlayer(w http.ResponseWriter, r *http.Request) {
	if gameState.Started {
		w.WriteHeader(http.StatusUnavailableForLegalReasons)
		fmt.Fprintf(w, "Game has already started")
		return
	}

	err := r.ParseMultipartForm(3200)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	name := r.FormValue("text")

	if gameState.hasPlayerName(name) {
		w.WriteHeader(http.StatusUnavailableForLegalReasons)
		fmt.Println(name, " nimi on taken")
		fmt.Fprintf(w, "vali orginaalsem nimi")
		return
	}

	if len(gameState.Players) > 4 {
		w.WriteHeader(http.StatusUnavailableForLegalReasons)
		fmt.Println("max players reached for this game, sorry.")
		fmt.Fprintf(w, "max players reached for this game, sorry.")
		return
	}

	playerIndex := gameState.AddPlayer(Player{
		Username:     name,
		Position:     Position{X: 0, Y: 0},
		Lives:        3,
		Speed:        1,
		BombCount:    1,
		BombRange:    1,
		PowerUpLevel: PowerUpLevel{Speed: 0, Bombs: 0, Flames: 0},
	})
	if !gameState.Timer.Active {
		fmt.Println("STARTING TIMER")
		gameState.StartTimer(3)
	}

	jsonResponse, err := json.Marshal(playerIndex)
	if err != nil {
		fmt.Println("err marshaling ", err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}
