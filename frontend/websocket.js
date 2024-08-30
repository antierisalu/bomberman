export function StartClientWebsocket(username) {
    const webSocketURL = 'ws://localhost:8008/ws';
    const socket = new WebSocket(webSocketURL);
    socket.onopen = function (event) {
        socket.send(JSON.stringify({ type:'username', username: username}));
    }
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'confirmation':
                console.log("new WS player CONFIRMED")
                break;
        }
    }
}