import { movingDirection as direction} from "./controls";

export class Player {
    constructor(element, gameWorldDiv, name, socket) {
        this.element = element
        this.clientGameRect = gameWorldDiv;
        this.clientGameRectBounds = (gameWorldDiv.getBoundingClientRect());
        this.name = name;
        this.x = this.clientGameRectBounds.x + (this.clientGameRectBounds.width / 2);
        this.y = this.clientGameRectBounds.y + (this.clientGameRectBounds.height / 2);
        this.socket = socket;
    }
    move(direction) {
        switch (direction) {
            case "up":
                this.y -= 10;
                this.element.style.top = this.y + "px";
                break;
            case "down":
                this.y += 10;
                this.element.style.top = this.y + "px";
                break;
            case "left":
                this.x -= 10;
                this.element.style.left = this.x + "px";
                break;
            case "right":
                this.x += 10;
                this.element.style.left = this.x + "px";
                break;
        }
    }
    update(value, delta) {
        if ((value.keys.indexOf("ArrowUp") > -1) || (value.keys.indexOf("w") > -1)) {
            this.move("up");
        }
        if ((value.keys.indexOf("ArrowDown") > -1) || (value.keys.indexOf("s") > -1)) {
            this.move("down");
        }
        if ((value.keys.indexOf("ArrowLeft") > -1) || (value.keys.indexOf("a") > -1)) {
            this.move("left");
        }
        if ((value.keys.indexOf("ArrowRight") > -1) || (value.keys.indexOf("d") > -1)) {
            this.move("right");
        }
    }
}
