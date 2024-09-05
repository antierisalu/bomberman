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
	fmt.Println("Joiner:", name, "[", color, "]")

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "--- %v [%v]", name, color)
}
