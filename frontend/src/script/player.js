import { movingDirection as direction} from "./controls";
import { sendMessage } from "../websocket";

export class Player {
    constructor(element, gameWorldDiv, name) {
        this.element = element
        this.clientGameRect = gameWorldDiv.getBoundingClientRect();
        this.playerRect = (this.element.getBoundingClientRect());
        this.name = name;
        this.x = this.playerRect.x - this.clientGameRect.x
        this.y = this.playerRect.y - this.clientGameRect.y
        this.speed = 200;
    }
    move(direction, dt) {
        console.log(this.x, this.y)
        switch (direction) {
            case "up":
                this.y -= this.speed * dt;
                this.element.style.top = this.y + "px";
                break;
            case "down":
                this.y += this.speed  * dt;
                this.element.style.top = this.y + "px";
                break;
            case "left":
                this.x -= this.speed  * dt;
                this.element.style.left = this.x + "px";
                break;
            case "right":
                this.x += this.speed  * dt;
                this.element.style.left = this.x + "px";
                break;
        }
    }
    update(value, dt) {
        sendMessage(JSON.stringify({type:'position', position:{x:this.x,y:this.y}}));
        if ((value.keys.indexOf("ArrowUp") > -1) || (value.keys.indexOf("w") > -1)) {
            this.move("up", dt);
        }
        if ((value.keys.indexOf("ArrowDown") > -1) || (value.keys.indexOf("s") > -1)) {
            this.move("down", dt);
        }
        if ((value.keys.indexOf("ArrowLeft") > -1) || (value.keys.indexOf("a") > -1)) {
            this.move("left", dt);
        }
        if ((value.keys.indexOf("ArrowRight") > -1) || (value.keys.indexOf("d") > -1)) {
            this.move("right", dt);
        }
    }
}
