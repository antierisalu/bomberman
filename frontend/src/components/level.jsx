import { LAR } from "../framework";

    // cell class ( X Y blocktype onfire, hasbomb )

    // initialize level (box class, loopib need labi, genereerib divid)


const Level = () => {
  let players = [
    { name: "Neo", eliminations: 0 },
    { name: "Smith", eliminations: 0 },
    { name: "Mr. Reagan", eliminations: 2 },
    { name: "Trinity", eliminations: 0 },
  ];
  class Cell {
    constructor(x, y, blockType, onFire, hasBomb, element) {
      this.x = x;
      this.y = y;
      this.blockType = blockType;
      this.onFire = onFire;
      this.hasBomb = hasBomb;
      this.element = element;
    }
  }

  const GRID_LENGTH = 11;
  const GRID_WIDTH = 13;

  const initializeGrid = () => {
    let cells = [];
    for (let row = 0; row < GRID_WIDTH; row++) {
      for (let column = 0; column < GRID_LENGTH; column++) {
        cells.push(
          // TODO: initialize cell with data from websokk
          // new Cell(i, j, 0, false, false)
        );
      }
    }
    return cells;
  };

  const OuterWalls = () => {
    let numBoxes = 11;

    const hardBox = (numBoxes) => {
      const boxes = [];
      for (let i = 0; i < numBoxes; i++) {
        boxes.push(<div key={i} className="box-1"></div>);
      }
      return boxes;
    };

    return (
      <div>
        <div class="topBoxes">{hardBox(numBoxes + 2)}</div>
        <div class="bottomBoxes" style={"bottom: 0"}>{hardBox(numBoxes + 2)}</div>
        <div class="leftBoxes">{hardBox(numBoxes)}</div>
        <div class="rightBoxes" style={"right:0"}>{hardBox(numBoxes)}</div>
      </div>
    );
  };


  const GameArea = () => {

    return (
      <div className="inGame">
        <div className="box-0"></div>
        <div className="box-2"></div>
        <div className="box-2"></div>
        <div className="box-1"></div>
        <div className="box-2"></div>
      </div>
    )
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
        <OuterWalls />
        <GameArea />
      </div>
    </div>
  );
};

export default Level;
