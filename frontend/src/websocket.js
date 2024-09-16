import { LAR } from './framework';

export let ws;

export function StartClientWebsocket(username, color, updatePlayers) {
    ws = new WebSocket("ws://localhost:8080/ws")
    ws.onopen = function (event) {
        ws.send(JSON.stringify({ type:'join', player: {username: username, color: color}}));
        console.log("Websocket connected!");
    }

    ws.onmessage = function (event) { //see method kirjutatakse lobby.jsxis yle kui inimene vajutab play 
        const data = JSON.parse(event.data);
        switch (data.type) {
            case "player_list"://backendilt saadud player list. clienti info on clientInfo stateis App tasemel
                console.log("Initial player list:", data.players);
                updatePlayers(data.players);
                break;
            case "gameStateUpdate":
                updateGameState(gameState => gameState = data.gameState)
                break;
            case "chat_message":
                console.log('nahui')
                setMessages((prevMessages) => [...prevMessages, { content: data.content, sender: data.sender}]);
        }
    }
}
//laseb teistel componentitel ws sonumeid saata
export const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    }
};