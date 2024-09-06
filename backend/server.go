package backend

import (
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

	err := r.ParseMultipartForm(3200)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	color := r.FormValue("color")
	name := r.FormValue("text")
	if color == "" {
		w.WriteHeader(http.StatusUnavailableForLegalReasons)
		fmt.Println(name, "ei valinud v2rvi")
		fmt.Fprintf(w, "vali v2rv")
		return
	}
	if gameState.hasPlayerName(name) {
		w.WriteHeader(http.StatusUnavailableForLegalReasons)
		fmt.Println(name, " nimi on taken")
		fmt.Fprintf(w, "vali orginaalsem nimi")
		return
	}

	fmt.Println("Joiner:", name, "[", color, "]")
	// -- STAGING --

	fmt.Println("ADDING PLAYER:", Player{Username: name, Color: color, Position: Position{X: 0, Y: 0}})
	gameState.AddPlayer(Player{Username: name, Color: color, Position: Position{X: 0, Y: 0}})
	fmt.Println("STARTING TIMER")
	if !gameState.Timer.Active {
		gameState.StartTimer(15)
	}

	// -- STAGING --

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "--- %v [%v]", name, color)
}
