import { Player } from "../script/player";
import { LAR } from "../framework";
import { sendMessage, ws } from "../websocket";


const Players = (prop) => {

    let players = prop.players
    
      if (ws){ // see kirjutab yle lobby.jsx'i ws.onmessage methodi
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
                console.log(data.players)
                players = data.player
        }
    }
    

  //   LAR.useEffect(()=>{
  //     console.log("new players")
  //     players = prop.players
  // },[prop.players])



  return (
    <div id="level">
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
          <span className="player" id={`player${index}`} key={player.id}></span>
        ))}
      </div>
    </div>
  );
};

export default Players;
