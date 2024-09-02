package backend

import (
	"fmt"
	"net/http"
)

func StartServer() {
	http.HandleFunc("/newPlayer", handleNewPlayer)
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "./frontend/index.html")
		} else {
			http.FileServer(http.Dir("./frontend")).ServeHTTP(w, r)
		}
	})
	fmt.Println("Bomberman is running on localhost:8080")
	http.ListenAndServe(":8080", nil)
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
