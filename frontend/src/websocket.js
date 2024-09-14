import { LAR } from './framework';

export let ws;

export function StartClientWebsocket(username, color, updatePlayers) {
    ws = new WebSocket("ws://localhost:8080/ws")
    ws.onopen = function (event) {
        ws.send(JSON.stringify({ type:'join', player: {username: username, color: color}}));
        console.log("Websocket connected!");
    }

    ws.onmessage = function (event) { //see kirjutatakse arena.jsxis yle
        console.log('ws.js')
        const data = JSON.parse(event.data);
            console.log(data)
        switch (data.type) {
            case "join":
                console.log("YOU JOINED")
                updatePlayers((arr =>{arr.push(data.player.username); return arr}))
                break;
            case "player_list":
                console.log("Updating players with:", data.players);
                break;
        }
    }
}

export const sendMessage = (message) => {
    // message format { type: "type", data: "data", username:username }
    if (ws && ws.readyState === WebSocket.OPEN) {
        // console.log("Sending message:", message);
        ws.send(message);
    }
};