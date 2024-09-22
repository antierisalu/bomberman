import { LAR } from "../framework";
import Players from "./players";
import { sendMessage, ws } from "../websocket";

let cells = [];

const Level = (prop) => {

  class Cell {
    constructor(x, y, blockType, onFire, hasBomb, dropType, element) {
      this.x = x;
      this.y = y;
      this.blockType = blockType;
      this.onFire = onFire;
      this.hasBomb = hasBomb;
      this.dropType = dropType;
      this.jsx = element;
      this.element;
    }
  }

  const GRID_LENGTH = 11;
  const GRID_WIDTH = 13;

  const initializeGrid = () => {

    let newCells = [];

    for (let row = 0; row < GRID_LENGTH; row++) {
      for (let column = 0; column < GRID_WIDTH; column++) {
        const blockType = prop.gameState.GameGrid[row][column].BlockType;
        const onFire = prop.gameState.GameGrid[row][column].OnFire;
        const hasBomb = prop.gameState.GameGrid[row][column].HasBomb;  
        const dropType = prop.gameState.GameGrid[row][column].DropType;
        const cell = new Cell(row, column, blockType, onFire, hasBomb, dropType, null);
        const xyID = row.toString() + '-' + column.toString()
        switch (blockType) {
          case 1:
            cell.jsx = <div id={xyID} className="box-1"></div>;
            break;
          case 2:
            cell.jsx = <div id={xyID} className="box-2"></div>;
            break;
          default:
            if (hasBomb) {
              cell.jsx = <div id={xyID} className="hasBomb"></div>; // Add a special class for bombs
            } else if (onFire) {
              cell.jsx = <div id={xyID} className="onFire"></div>;
            } else if (dropType > -1) {
              switch(dropType){
                case 0:
                  cell.jsx = <div id={xyID} className="extraSpeed"></div>;
                  break;
                case 1:
                  cell.jsx = <div id={xyID} className="extraBomb"></div>;
                  break;
                case 2:
                  cell.jsx = <div id={xyID} className="extraRange"></div>;
                  break;
              }
            } else {
              cell.jsx = <div id={xyID} className="box-0"></div>; // Regular default case without bomb
              break;
            }
            break;
        };
        newCells.push(cell);
      }
    }
    return newCells;
  };

  cells = initializeGrid();
  
    return (
      
      <div id="level">
            <button onClick={()=>sendMessage(JSON.stringify({ type:'ping'}))}>Ping Test ja remove box at 0 0</button>
        <div className="gameArea" id="gameArea">
          {cells.map((cell, index) => (
            <div key={index}>
              {cell.jsx}
            </div>
          ))}
          <Players 
          cells={cells}
          players={prop.players} 
          updatePlayers={prop.updatePlayers} 
          updateGameState={prop.updateGameState} 
          gameState={prop.gameState} 
          clientInfo={prop.clientInfo}
          />
        </div>
      </div>
    );
  };

  export default Level;