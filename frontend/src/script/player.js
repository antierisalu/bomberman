import { sendMessage } from "../websocket";

export class Player {
    constructor(element, gameWorldDiv, name, cells) {
        this.element = element
        this.gameWorldDiv = gameWorldDiv
        this.clientGameRect = gameWorldDiv.getBoundingClientRect();
        this.playerRect = this.element.getBoundingClientRect();
        this.name = name;
        this.x = this.playerRect.x - this.clientGameRect.x
        this.y = this.playerRect.y - this.clientGameRect.y
        this.width = this.playerRect.width
        this.height = this.playerRect.height
        this.speed = 200;
        this.oldX = 0;
        this.oldY = 0;
        this.cellSize = 58; // Size of each cell
        this.cells = cells; // Array of cell objects
    }

    update(input, dt) {

        const movement = this.speed * dt;
        let right = 0;
        let left = 0;
        let up = 0;
        let down = 0;

        if ((input.keys.indexOf("ArrowUp") > -1) || (input.keys.indexOf("w") > -1)) {
            up = 1
        }
        if ((input.keys.indexOf("ArrowDown") > -1) || (input.keys.indexOf("s") > -1)) {
            down = 1
        }
        if ((input.keys.indexOf("ArrowLeft") > -1) || (input.keys.indexOf("a") > -1)) {
            left = 1;
        }
        if ((input.keys.indexOf("ArrowRight") > -1) || (input.keys.indexOf("d") > -1)) {
            right = 1;
        }
        
        // Create a hypothetical future position for the player
        let dx = (right - left) * movement
        let dy = (down - up) * movement


        //normalize movement vectors for diagonal movement
        let length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
            dx /= length;
            dy /= length;
        }
        dx *= movement;
        dy *= movement;
        
        //only send position info if client has moved
        if (this.oldX !== this.x || this.oldY !== this.y){
            sendMessage(JSON.stringify({type: 'position', position:{x:this.x, y:this.y}}))
            this.oldX = this.x
            this.oldY = this.y
        }

        this.movePlayer(dx, dy, this.cells)
        
    }

    movePlayer(dx, dy, cells) {
        let obstacles = [].concat(...cells);
        let futureX = this.x + dx;
        let futureY = this.y + dy;
        
        // Create a hypothetical bounding box for the player in the new position
        let futurePlayer = {x: futureX, y: futureY, width: this.width, height: this.height};
        
        // Check for collisions with each obstacle

        for (let obstacle of obstacles) {
            let oRect = obstacle.element.getBoundingClientRect()
            let obsX = oRect.x - this.clientGameRect.x
            let obsY = oRect.y - this.clientGameRect.y
            let calibratedObstacle = {x:obsX, y:obsY, height:oRect.height, width:oRect.width}
            if (obstacle.BlockType === 1 || obstacle.BlockType === 2 || obstacle.HasBomb || obstacle.DropType > -1 || obstacle.OnFire){ // 
                if (this.isColliding(futurePlayer, calibratedObstacle)) {
                    
                    //check for player damage
                    if (obstacle.OnFire){
                        sendMessage(JSON.stringify({type:'playerInFire'}))
                        continue
                    }
                    //if player is on top of bomb, don't collide with it
                    if (obstacle.HasBomb && !obstacle.collidableBomb){
                        continue
                    } 
                    //powerup pickup logic
                    if (obstacle.DropType > -1 && obstacle.BlockType === 0){
                        if (obstacle.DropType === 0){
                            this.speed += 100
                            setTimeout(()=>{
                                if (this.speed > 100){
                                    this.speed -= 100
                                }
                            }, 5000)
                        } else if (obstacle.DropType > 0) {
                            console.log("i found a drop type", obstacle.DropType)
                        }
                        sendMessage(JSON.stringify({type: 'powerup', position: {x:obsX,y:obsY}}))
                        obstacle.DropType = -1
                        continue
                    }

                    //collision logic
                    if (this.isColliding({x: futureX, y: this.y, width: this.width, height: this.height}, calibratedObstacle)) {
                        //need ifid viivad playeri vastu blocki, kui oleks lihtsalt dx=0 ja player kiirus on suur siis ta j22b enne seina seisma vahel
                        if (dx>0){
                            dx = calibratedObstacle.x - (this.x+this.width)
                        } else if (dx<0) {
                            dx = (calibratedObstacle.x + calibratedObstacle.width) - this.x
                        } else dx = 0
                        }
                        if (this.isColliding({x: this.x, y: futureY, width: this.width, height: this.height}, calibratedObstacle)) {
                        if (dy>0){
                            dy = calibratedObstacle.y - (this.y+this.height)
                        } else if (dy<0) {
                            dy = (calibratedObstacle.y + calibratedObstacle.height) - this.y
                        } else dy = 0
                    }


                } else if (obstacle.HasBomb){// if player isnt on top of bomb, make it collideable
                        obstacle.collidableBomb = true;
                }
            }
            if (obstacle.collidableBomb && !obstacle.HasBomb){
                obstacle.collidableBomb = false
            }
        }
        
        this.x += dx;
        this.y += dy;
        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
      }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y + rect1.height > rect2.y &&
                rect1.y < rect2.y + rect2.height;
      }

    moveOther(){
        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
    }

    updateOnResize() {

        const newGameRect = this.gameWorldDiv.getBoundingClientRect();

        // Calculate the proportion of the player's position relative to the old game world size
        const xRatio = this.x / this.clientGameRect.width;
        const yRatio = this.y / this.clientGameRect.height;
    
        this.clientGameRect = newGameRect;
    
        // Recalculate the player's x and y based on the new game world size and the saved ratios
        this.x = xRatio * this.clientGameRect.width;
        this.y = yRatio * this.clientGameRect.height;
    
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
}
