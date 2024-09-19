import { sendMessage } from "../websocket";

export class Player {
    constructor(element, gameWorldDiv, name, cells) {
        this.element = element
        this.clientGameRect = gameWorldDiv.getBoundingClientRect();
        this.playerRect = (this.element.getBoundingClientRect());
        this.name = name;
        this.x = this.playerRect.x - this.clientGameRect.x
        this.y = this.playerRect.y - this.clientGameRect.y

        // this.x = this.element.offsetLeft;
        // this.y = this.element.offsetTop;

        this.speed = 200;
        this.oldX = 0;
        this.oldY = 0;
        this.cellSize = 58; // Size of each cell
        this.cells = cells; // Array of cell objects
    }

    getCurrentCell() {
        const gridX = Math.floor(this.x / this.cellSize);
        const gridY = Math.floor(this.y / this.cellSize);

        // Ensure gridX and gridY are within bounds
        // console.log("x", gridX, "y", gridY)
        if (gridY < 0 || gridY >= this.cells[0].length || gridX < 0 || gridX >= this.cells.length) {
            return null; // Return null if out of bounds
        }

        return this.cells[gridX][gridY]; // Access the cell as a 2D array
    }

 
    canMovexd(direction) {
        const surroundingCells = this.getSurroundingCells()
        let can = true
        /* surroundingCells.forEach(cell => {
           // let cellElem = document.getElementById(cell.Y+'-'+cell..)
           //console.log(this.element.getBoundingClientRect())
            if (this.isColliding(cell.element.getBoundingClientRect(), this.element.getBoundingClientRect())) {
                console.log("Collided cant move", cell.X, cell.Y)
                //if (cell.BlockType === 1) can = false
            }
        }); */
        return can
    }

    isColliding(rect1, rect2) {
        return !(
            rect1.right < rect2.left || // rect1 is completely to the left of rect2
            rect1.left > rect2.right || // rect1 is completely to the right of rect2
            rect1.bottom < rect2.top || // rect1 is completely above rect2
            rect1.top > rect2.bottom    // rect1 is completely below rect2
        );
    }

    getSurroundingCells() {
        const surroundingCells = [];
        const directions = ["up", "down", "left", "right"];

        directions.forEach(dir => {
            surroundingCells.push(this.getCellxd(dir));
        })
        // console.log("surroundingcells", surroundingCells);
        return surroundingCells;
    }

    getCellxd(direction) {
        let gridX = Math.floor(this.x / this.cellSize);
        let gridY = Math.floor(this.y / this.cellSize);
        switch (direction) {
            case "up":
                gridY -= 1
                break;
            case "down":
                gridY += 1
                break;
            case "left":
                gridX -= 1
                break;
            case "right":
                gridX += 1
                break;
            default:
                break;
        }
        // const element = document.getElementById(`${gridX}-${gridY}`)
        return this.getCellAt(gridX, gridY);
    }


    getCellAt(gridX, gridY) {
        if (gridX < 0 || gridX >= this.cells[0].length || gridY < 0 || gridY >= this.cells.length) {
            return this.cells[0][0]; // Out of bounds
        }
        console.log("getCELLAT CELL:",this.cells[gridY][gridX].element, gridY, gridX)
        return this.cells[gridY][gridX]; // Access the cell at the specified coordinates
    }

    move(direction, dt) {
        if (this.canMovexd() === true) {
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
    }
    moveOther(){
        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
    }

    update(value, dt) {

        //only send position info if client has moved
        if (this.oldX !== this.x || this.oldY !== this.y){
            sendMessage(JSON.stringify({type: 'position', position:{x:this.x, y:this.y}}))
            this.oldX = this.x
            this.oldY = this.y
        }
        
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
