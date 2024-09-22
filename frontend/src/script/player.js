import { sendMessage } from "../websocket";

export class Player {
    constructor(element, gameWorldDiv, name, cells) {
        this.element = element
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
            if (obstacle.BlockType === 1 || obstacle.BlockType === 2 || obstacle.HasBomb || obstacle.DropType > -1 ){ // 
                if (this.isColliding(futurePlayer, calibratedObstacle)) {
                    
                    if (obstacle.HasBomb && !obstacle.collidableBomb){//if player is on top of bomb, don't collide with it
                        console.log(obstacle, cells[obstacle.Y][obstacle.X])
                        continue
                    } 
                    if (obstacle.DropType > -1 && obstacle.BlockType === 0){
                        if (obstacle.DropType === 0){
                            this.speed += 100
                            setTimeout(()=>{
                                this.speed -= 100
                            }, 5000)
                        } else if (obstacle.DropType > 0) {
                            console.log("i found a drop type", obstacle.DropType)
                        }
                        sendMessage(JSON.stringify({type: 'powerup', position: {x:obsX,y:obsY}}))
                        obstacle.DropType = -1
                        continue
                    }

                    if (this.isColliding({x: futureX, y: this.y, width: this.width, height: this.height}, calibratedObstacle)) {
                    dx = 0; // Stop horizontal movement
                    }
                    if (this.isColliding({x: this.x, y: futureY, width: this.width, height: this.height}, calibratedObstacle)) {
                    dy = 0; // Stop vertical movement
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

    getCellAt(gridX, gridY) {
        if (gridX < 0 || gridX >= this.cells[0].length || gridY < 0 || gridY >= this.cells.length) {
            return this.cells[0][0]; // Out of bounds
        }
        return this.cells[gridY][gridX]; // Access the cell at the specified coordinates
    }

    getCurrentCell() {
        const gridX = Math.floor(this.x / this.cellSize);
        const gridY = Math.floor(this.y / this.cellSize);

        if (gridY < 0 || gridY >= this.cells[0].length || gridX < 0 || gridX >= this.cells.length) {
            return null; // Return null if out of bounds
        }
        return this.cells[gridY][gridX]; // Access the cell as a 2D array
    }
}
