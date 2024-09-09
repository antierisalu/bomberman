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

  // console.log("gamestate in level", prop.gameState)
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
        // TODO: initialize cell with data from websokk
        // celli divid style
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
        console.log("cell", cell);
        cells.push(cell);
      }
    }
    console.log('cells peale loope', cells.length);
    // updateGameState(gameState => gameState = data.gameState)

    return cells;
  };

  let cells = [];

  if (gameGrid !== undefined) {
    cells = initializeGrid();
  }


    // for(var i = 0; i < cubes.length; i++) {
    //   for(var j = 0; j < cubes[i].length; j++) {
    //       console.log(cubes[i][j]);
    //   }
    // }


    // const OuterWalls = () => {
    //   let numBoxes = 11;

    //   const hardBox = (numBoxes) => {
    //     const boxes = [];
    //     for (let i = 0; i < numBoxes; i++) {
    //       boxes.push(<div key={i} className="box-1"></div>);
    //     }
    //     return boxes;
    //   };

    //   return (
    //     <div>
    //       <div class="topBoxes">{hardBox(numBoxes + 2)}</div>
    //       <div class="bottomBoxes" style={"bottom: 0"}>{hardBox(numBoxes + 2)}</div>
    //       <div class="leftBoxes">{hardBox(numBoxes)}</div>
    //       <div class="rightBoxes" style={"right:0"}>{hardBox(numBoxes)}</div>
    //     </div>
    //   );
    // };


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
          {/* <OuterWalls /> */}
        {/* <div className="inGame"> */}

          {cells.map((cell, index) => (
            <div key={index}>
              {cell.element}
            </div>
          ))}
        </div>
        {/* </div> */}
      </div>
    );
  };

  export default Level;
