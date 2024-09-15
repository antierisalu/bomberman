import { Player } from "../script/player";
import { LAR } from "../framework";

const Players = (prop) => {

    const playerNames = prop.players;

    const initializePlayers = () => {

        console.log("initPlayers", playerNames);
    
        const gameWorldDiv = document.getElementById("gameArea");
        // let players = [];
    
        playerNames.forEach((playerName, index) => {
            const element = <div className="player" id={"player" + index}></div> // id from 0-3 places the players to separate corners in css
            const socket = "??"; 
            const player = new Player(element, gameWorldDiv, playerName, socket);
            players.push(player);
        });
    
        return players;
    };
    
    let players = []
    players = initializePlayers();

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
        {players.map((player, index) => (
          <div key={index}>{player.element}</div>
        ))}
      </div>
    </div>
  );
};

export default Players;
