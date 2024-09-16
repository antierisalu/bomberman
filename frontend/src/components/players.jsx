import { Player } from "../script/player";
import { LAR } from "../framework";
import { sendMessage, ws } from "../websocket";


const Players = (prop) => {

    let players = prop.players

   
    
    if (ws){ // see kirjutab yle lobby.jsx'i ws.onmessage methodi
      ws.onmessage = function (event) {
          const data = JSON.parse(event.data);
          console.log('ws on message data: ', data);
          switch (data.type) {
            case "player_list":
                prop.updatePlayers(data.players)
                break;
            case 'pong':
              break;
            case "gameState":
              console.log("updated gamestate?");
              prop.updateGameState(data.gameState);
            break;
            }
        }
    }

    LAR.useEffect(()=>{
      console.log("22222")
  },[prop.gameState])

  return (
    <div>
      <div className="hud">
        <div className="hudPlayers">
          {players.map((player, index) => (
            <div key={index} className="hudPlayer">
              <span>{player.username}</span> - <span>{player.color}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="gameArea" id="gameArea">
        {players.map((player, index) => (
          <span className="player" id={`player${index}`}></span>
        ))}
      </div>
    </div>
  );
};

export default Players;
