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
        let right = 0;
        let left = 0;
        let up = 0;
        let down = 0;
        const movement = this.speed * dt;
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

    move(direction, dt) {
        const movement = this.speed * dt;
            switch (direction) {
                case "up":
                    this.y -= movement;
                    this.element.style.top = this.y + 'px'
                    break;
                case "down":
                    this.y += movement;
                    this.element.style.top = this.y + 'px'
                    break;
                case "left":
                    this.x -= movement;
                    this.element.style.left = this.x + 'px'
                    break;
                case "right":
                    this.x += movement;
                    this.element.style.left = this.x + 'px'
                    break;
            }
    }



    movePlayer(dx, dy, cells) {
        let obstacles = [].concat(...cells);
        let futureX = this.x + dx;
        let futureY = this.y + dy;
        
        // Create a hypothetical bounding box for the this in the new position
        let futurePlayer = {x: futureX, y: futureY, width: this.width, height: this.height};
        
        // Check for collisions with each obstacle

        for (let obstacle of obstacles) {
            let oRect = obstacle.element.getBoundingClientRect()
            let obsX = oRect.x - this.clientGameRect.x
            let obsY = oRect.y - this.clientGameRect.y

            if (obstacle.BlockType === 1){
                if (this.isColliding(futurePlayer, {x:obsX, y:obsY, height:oRect.height, width:oRect.width})) {
                    
                    if (this.isColliding({x: futureX, y: this.y, width: this.width, height: this.height}, 
                        {x:obsX, y:obsY, height:oRect.height, width:oRect.width})) {

                    dx = 0; // Stop horizontal movement
                    }
                    if (this.isColliding({x: this.x, y: futureY, width: this.width, height: this.height}, 
                        {x:obsX, y:obsY, height:oRect.height, width:oRect.width})) {
                    dy = 0; // Stop vertical movement
                    }
                }
            }
        }
        
        // Update the player's position based on the resolved movement
        this.x += dx;
        this.y += dy;
        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
      }
    


/*     isColliding(rect1, rect2) {
        return !(rect1.left > rect2.right ||
                 rect1.right < rect2.left ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    } */

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y + rect1.height > rect2.y &&
                rect1.y < rect2.y + rect2.height;
      }

    getCellAt(gridX, gridY) {
        if (gridX < 0 || gridX >= this.cells[0].length || gridY < 0 || gridY >= this.cells.length) {
            return this.cells[0][0]; // Out of bounds
        }
        
        return this.cells[gridX][gridY]; // Access the cell at the specified coordinates
    }

    moveOther(){
        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
    }

    
}


class AABB {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
}



    // getCellxd(direction) {
    //     let gridX = Math.floor(this.x / this.cellSize);
    //     let gridY = Math.floor(this.y / this.cellSize);
    //     switch (direction) {
    //         case "up":
    //             gridY -= 1
    //             break;
    //         case "down":
    //             gridY += 1
    //             break;
    //         case "left":
    //             gridX -= 1
    //             break;
    //         case "right":
    //             gridX += 1
    //             break;
    //         default:
    //             break;
    //     }
    //     // const element = document.getElementById(`${gridX}-${gridY}`)
    //     return this.getCellAt(gridY, gridX);
    // }
    



/* canMovexd(direction) {
        let can = true

         this.cells.forEach(row => row.forEach(cell => {
        //    let cellElem = document.getElementById(cell.Y+'-'+cell..)
            if (this.isColliding(this.element.getBoundingClientRect(), cell.element.getBoundingClientRect())) {
                
                cell.element.style.background = 'red'
                setTimeout(()=>{
                    cell.element.style.background = 'blue'
                },100)
                if (cell.BlockType === 1){
                    //can = false
                    console.log('Colliding with cell:', cell.X, cell.Y);
                    
                    const pRect = this.element.getBoundingClientRect();
                    const cRect = cell.element.getBoundingClientRect();

                    if (pRect.right > cRect.left && pRect.left < cRect.left) {
                        // Collision on the right side
                        this.x -= 1;
                    } else if (pRect.left < cRect.right && pRect.right > cRect.right) {
                        // Collision on the left side
                        this.x += 1;
                    } else if (pRect.bottom > cRect.top && pRect.top < cRect.top) {
                        // Collision on the bottom side
                        this.y -= 1;
                    } else if (pRect.top < cRect.bottom && pRect.bottom > cRect.bottom) {
                        // Collision on the top side
                        this.y += 1;
                    }

                    this.element.style.left = `${this.x}px`;
                    this.element.style.top = `${this.y}px`;
                }
            }
            
        })); 
        return can
    } */