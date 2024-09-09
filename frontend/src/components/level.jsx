import { LAR } from "../framework";

// cell class ( X Y blocktype onfire, hasbomb )

// initialize level (box class, loopib need labi, genereerib divid)


const Level = (prop) => {

  let players = [
    { name: "Neo", eliminations: 0 },
    { name: "Smith", eliminations: 0 },
    { name: "Mr. Reagan", eliminations: 2 },
    { name: "Trinity", eliminations: 0 },
  ];


  class Cell {
    constructor(x, y, blockType, onFire, hasBomb, dropType, element) {
      this.x = x;
      this.y = y;
      this.blockType = blockType;
      this.onFire = onFire;
      this.hasBomb = hasBomb;
      this.dropType = dropType;
      this.element = element;
    }
  }

  const gameState = prop.gameState;
  const gameGrid = gameState.GameGrid;

  const GRID_LENGTH = 11;
  const GRID_WIDTH = 13;

  const initializeGrid = () => {
    if (gameGrid === undefined) {
      return []
    }
    let cells = [];


    for (let row = 0; row < GRID_LENGTH; row++) {
      for (let column = 0; column < GRID_WIDTH; column++) {
        const blockType = gameGrid[row][column].BlockType;
        const onFire = gameGrid[row][column].OnFire;
        const hasBomb = gameGrid[row][column].HasBomb;
        const dropType = gameGrid[row][column].dropType;
        const cell = new Cell(row, column, blockType, onFire, hasBomb, dropType, null);
        const xyID = row.toString() + '-' + column.toString()

        switch (blockType) {
          case 0:
            cell.element = <div id={xyID} className="box-0"></div>;
            break;
          case 1:
            cell.element = <div id={xyID} className="box-1"></div>;
            break;
          case 2:
            cell.element = <div id={xyID} className="box-2"></div>;
            break;
          default:
            cell.element = null;
            break;
        };
        cells.push(cell);
      }
    }
    return cells;
  };

  let cells = [];

  if (gameGrid) {
    cells = initializeGrid();
  }

    return (
      <div id="level">
        <div className="hud">
          <div className="hudPlayers">
            {players.map((player, index) => (
              <div key={index} className="hudPlayer">
                <span>{player.name}</span>: <span>{player.eliminations}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="gameArea" id="gameArea">
          {cells.map((cell, index) => (
            <div key={index}>
              {cell.element}
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Level;
