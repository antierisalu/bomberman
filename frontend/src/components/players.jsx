import { Player } from "../script/player";
import { LAR } from "../framework";
import { sendMessage, ws } from "../websocket";


const Players = (prop) => {

    let players = prop.players
    
    /* TODO
    InitPlayers()
    */
console.log("*******RENDERING PLAYERS**********")
    
    if (ws){ // see kirjutab yle lobby.jsx'i ws.onmessage methodi
      ws.onmessage = function (event) {
          const data = JSON.parse(event.data);
          console.log('ws on message data: ', data);
          switch (data.type) {
            case "player_list":
              prop.updatePlayers(data.players)
              break;
            case "gameState":
              prop.updateGameState(data.gameState);
              break;
            }
        }
    }
  
  // millegiprst kutsub kaks korda. dunno miks. norm bandage see prg
  LAR.useEffect(()=>{
    console.log(prop.gameState)
    if (prop.gameState.GameGrid){
      console.log("ALUSTA GAMELOOP")
    }
    sendMessage(JSON.stringify({ type:'gameState'}));
  },[])


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
        {players.map((player, index) => (
          <span className="player" id={`player${index}`}></span>
        ))}
    </div>
  );
};

export default Players;
