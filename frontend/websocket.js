export function StartClientWebsocket(username, color) {
    console.log(username)
    let players = [];
    const gameWorldDiv = document.getElementById('gameWorld');

    const webSocketURL = 'ws://localhost:8080/ws';
    const socket = new WebSocket(webSocketURL);
    socket.onopen = function (event) {
        socket.send(JSON.stringify({ type:'join', player: {username: username, color: color}}));
        console.log("Websocket connected!");
        hideLobby()
        // let players = [];
        const clientPlayer = new Player(gameWorldDiv, username, socket);
        players.push(clientPlayer);

        // Eventlistener
        document.addEventListener('keypress', (e) => {
            switch (e.key) {
                case "w" || "W":
                    clientPlayer.move("up");
                    break;
                case "s" || "S":
                    clientPlayer.move("down");
                    break;
                case "a" || "A":
                    clientPlayer.move("left");
                    break;
                case "d" || "D":
                    clientPlayer.move("right");
                    break;
            }
        });
    }
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        // console.log("DATAAAAA:", data.player);
        console.log(data)
        switch (data.type) {
            case "join":

                const newPlayer = new Player(gameWorldDiv, data.player.username, socket) // might not need socket here
                players.push(newPlayer);
                break;
            case "leave":
                
                // initialize remove on class
                console.log("LEAVING:", data.player);
                const playerIDX = players.findIndex(p => p.name === data.player.username);
                if (playerIDX !== -1) {
                    const leaver = players[playerIDX];
                    leaver.leave(gameWorldDiv, data.player.username);
                    // remove from array
                    players.splice(playerIDX, 1);

                }

                break;
            case "move":
                console.log("MOVING:", data.player.username, data.player.position);
                const playerID = players.findIndex(p => p.name === data.player.username);
                if (playerID !== -1) {
                    const mover = players[playerID];
                    mover.updatePosition(data.player.position)
                }
                break;

        }
    }
}

function hideLobby() {
    const lobby = document.getElementById('lobby');
    lobby.style.display = 'none';
}


class Player {
    constructor(gameWorldDiv, name, socket) {
        this.playerSize = 25;
        this.clientGameRect = gameWorldDiv;
        this.clientGameRectBounds = (gameWorldDiv.getBoundingClientRect());
        console.log(this.clientGameRectBounds);
        this.name = name;
        this.x = this.clientGameRectBounds.x + (this.clientGameRectBounds.height/2);
        this.y = this.clientGameRectBounds.y + (this.clientGameRectBounds.width/2);
        this.player = this.initialize(this.clientGameRect, name, "#fff");
        this.socket = socket;
    }

    move(direction) {
        // left / right / up / down
        switch (direction){
            case "up":
            this.y -= 10;
            this.player.style.top = this.y + "px";
            break;
            case "down":
            this.y += 10;
            this.player.style.top = this.y + "px";
            break;
            case "left":
            this.x -= 10;
            this.player.style.left = this.x + "px";
            break;
            case "right":
            this.x += 10;
            this.player.style.left = this.x + "px";
            break;
        }

        // send WS 
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'move',
                direction: direction,
                position: { x: this.x, y: this.y }
            }));
        }
    }
    initialize(clientGameRect, name, color) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.style.position = 'absolute';
        playerDiv.style.left = this.x + 'px';
        playerDiv.style.top = this.y + 'px';
        playerDiv.style.width = this.playerSize + 'px';
        playerDiv.style.height = this.playerSize + 'px';
        playerDiv.style.backgroundColor = color;

        const nameTag = document.createElement('p');
        nameTag.className = 'name';
        nameTag.textContent = name;
        
        playerDiv.appendChild(nameTag);
        clientGameRect.appendChild(playerDiv)
        const nameTagWidth = nameTag.offsetWidth;
        console.log(nameTagWidth);
        nameTag.style.transform = `translateX(${(this.playerSize/2) - (nameTagWidth/2)}px) translateY(25px)`;

        return playerDiv
    }

    leave(clientGameRect, name) {
        const players = clientGameRect.querySelectorAll('.player');

        for (let player of players) {
            const nameTag = player.querySelector('.name');
            if (nameTag && nameTag.textContent === name) {
                player.remove();
                console.log(`Player ${name} has left the game.`);
                return;
            }
        }
    }

    updatePosition(position) {
        this.x = position.x
        this.y = position.y
        this.player.style.top = this.y + "px";
        this.player.style.left = this.x + "px";

        
    }

}