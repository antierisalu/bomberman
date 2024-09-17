import { LAR } from './framework';

export let ws;

export function StartClientWebsocket(username, color, updatePlayers, updateGameState) {
    ws = new WebSocket("ws://localhost:8080/ws")
    ws.onopen = function (event) {
        ws.send(JSON.stringify({ type:'join', player: {username: username, color: color}}));
        sendMessage(JSON.stringify({ type:'gameState'}));

        console.log("Websocket connected!");
    }

    ws.onmessage = function (event) { //see method kirjutatakse lobby.jsxis yle kui inimene vajutab play 
        const data = JSON.parse(event.data);
        switch (data.type) {
            case "player_list"://backendilt saadud player list. clienti info on clientInfo stateis App tasemel
                console.log("Initial player list:", data.players);
                updatePlayers(data.players);
                break;
            case "gameState":
                updateGameState(data.gameState);
                console.log("IM UPDATING GAMESTATE")
                break;
            case "pong":
        }
    }
}

//laseb teistel componentitel ws sonumeid saata
export const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    }
};