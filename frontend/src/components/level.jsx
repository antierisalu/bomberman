import { LAR } from "../framework";

const Level = () => {
  let players = [
    { name: "Neo", eliminations: 0 },
    { name: "Smith", eliminations: 0 },
    { name: "Mr. Reagan", eliminations: 2 },
    { name: "Trinity", eliminations: 0 },
  ];

  const OuterWalls = () => {
    let numBoxes = 20;

    const hardBox = (numBoxes) => {
      const boxes = [];
      for (let i = 0; i < numBoxes; i++) {
        boxes.push(<div key={i} className="indestructible-box"></div>);
      }
      return boxes;
    };

    return (
      <div>
        <div class="topBoxes">{hardBox(numBoxes)}</div>
        <div class="bottomBoxes" style={"bottom: 0"}>{hardBox(numBoxes)}</div>
        <div class="leftBoxes">{hardBox(numBoxes)}</div>
        <div class="rightBoxes" style={"right:0"}>{hardBox(numBoxes)}</div>
      </div>
    );
  };


  const GameArea = () => {

    return (
    <div className="inGame">
        <div className="empty-box"></div>
        <div className="destructible-box"></div>
        <div className="destructible-box"></div>
        <div className="destructible-box"></div>
    </div>
  )}

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
        <GameArea/>
      </div>
    </div>
  );
};

export default Level;
