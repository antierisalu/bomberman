import { StartClientWebsocket } from "./websocket";
document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById('join-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        fetch('http://localhost:8080/newPlayer', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log("success:", data)
        })
        .catch(error => {
            console.log("Error:", error);
        })
        StartClientWebsocket(this.text);
    })



    const gameworldDiv = document.getElementById('gameWorld');
    console.log(gameworldDiv);

    let players = [];
    const Chris = new Player(gameworldDiv, "Chris")


    // Eventlistener
    document.addEventListener('keypress', (e) => {
        switch (e.key) {
            case "w" || "W":
                Chris.move("up");
                break;
            case "s" || "S":
                Chris.move("down");
                break;
            case "a" || "A":
                Chris.move("left");
                break;
            case "d" || "D":
                Chris.move("right");
                break;

        }
    });


});

/* function gameLoop(){
    
    requestAnimationFrame(gameLoop())
}
window.requestAnimationFrame(gameLoop())
 */
class Player {
    constructor(gameWorldDiv, name) {
        this.playerSize = 25;
        this.clientGameRect = gameWorldDiv;
        this.clientGameRectBounds = (gameWorldDiv.getBoundingClientRect());
        console.log(this.clientGameRectBounds);
        this.name = name;
        this.x = this.clientGameRectBounds.x + (this.clientGameRectBounds.height/2);
        this.y = this.clientGameRectBounds.y + (this.clientGameRectBounds.width/2);
        this.player = this.initialize(this.clientGameRect, name, "#fff");
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


        // const reflow = nameTag.offsetWidth;
        const nameTagWidth = nameTag.offsetWidth;
        console.log(nameTagWidth);
        nameTag.style.transform = `translateX(${(this.playerSize/2) - (nameTagWidth/2)}px) translateY(25px)`;




        return playerDiv
    }

}
