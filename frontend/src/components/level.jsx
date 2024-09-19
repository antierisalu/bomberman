import { LAR } from "../framework";
import Players from "./players";
import { sendMessage, ws } from "../websocket";
import Chat from "./chat";


const Level = (prop) => {

  const [nuss, nussime] = LAR.useState(0)

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
      // this.rect = this.element.getBoundingClientRect();
    }
  }

  const GRID_LENGTH = 11;
  const GRID_WIDTH = 13;

  let cells = []; // why duplicates

  const initializeGrid = () => {

    let cells = [];

    for (let row = 0; row < GRID_LENGTH; row++) {
      for (let column = 0; column < GRID_WIDTH; column++) {
        const blockType = prop.gameState.GameGrid[row][column].BlockType;
        const onFire = prop.gameState.GameGrid[row][column].OnFire;
        const hasBomb = prop.gameState.GameGrid[row][column].HasBomb;  
        const dropType = prop.gameState.GameGrid[row][column].dropType;
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
            cell.jsx = <div id={xyID} className="box-0"></div>;
            break;
        };
        cells.push(cell);
      }
    }
    return cells;
  };

  cells = initializeGrid();
  
    return (
      
      <div id="level">
            <button onClick={()=>sendMessage(JSON.stringify({ type:'ping'}))}>Ping Test ja remove box at 0 0</button>
            <button onClick={()=>nussime(nuss+1)}>Nussi</button> {nuss}
        <div className="gameArea" id="gameArea">
          {cells.map((cell, index) => (
            <div key={index}>
              {cell.jsx}
            </div>
          ))}
          <Players 
          players={prop.players} 
          updatePlayers={prop.updatePlayers} 
          updateGameState={prop.updateGameState} 
          gameState={prop.gameState} 
          clientInfo={prop.clientInfo}
          messages={prop.messages}
          setMessages={prop.setMessages}
          />
        </div>
      </div>
    );
  };

  export default Level;