import { LAR } from './framework';

export function StartClientWebsocket(username, color, updatePlayers) {
    console.log("test")
    const ws = new WebSocket("ws://localhost:8080/ws")
    ws.onopen = function (event) {
        ws.send(JSON.stringify({ type:'join', player: {username: username, color: color}}));
        console.log("Websocket connected!");
    }

    ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log(data)

        switch (data.type) {
            case "join":
                console.log(data.player.username, "just joined, here is their data:",data)
                updatePlayers((arr =>{arr.push(data.player.username); return arr}))
                break;
            case "gameStateUpdate":
                console.log("GAMESTATE:", data.gameState)
                break;
        }
    }
}