package main

import (
	"main/backend"
)

func main() {
	go backend.StartWebSockets()
	backend.StartServer()
}
