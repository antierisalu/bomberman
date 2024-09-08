class Player {
    constructor(gameWorldDiv, name, socket) {
        this.playerSize = 25;
        this.clientGameRect = gameWorldDiv;
        this.clientGameRectBounds = (gameWorldDiv.getBoundingClientRect());
        console.log(this.clientGameRectBounds);
        this.name = name;
        this.x = this.clientGameRectBounds.x + (this.clientGameRectBounds.height / 2);
        this.y = this.clientGameRectBounds.y + (this.clientGameRectBounds.width / 2);
        this.player = this.initialize(this.clientGameRect, name, "#fff");
        this.socket = socket;
    }



    move(direction) {
        switch (direction) {
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
    }
}