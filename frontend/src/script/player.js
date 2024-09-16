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
}
