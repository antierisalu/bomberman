import { Player } from "../script/player";
import { LAR } from "../framework";
import { sendMessage, ws } from "../websocket";
import { updateGame } from "../script/update";
import { renderGame } from "../script/render";


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

    let lastFrameTime = 0;
    let frame = 0;
    let startTime = performance.now();

    function GameLoop(currentFrameTime) {
        const deltaTime = (currentFrameTime - lastFrameTime) / 1000; // Convert to seconds

        frame++;
        if (currentFrameTime - startTime > 1000) {
            // updateFPS(FPS => FPS = Math.round((frame / ((currentFrameTime - startTime) / 1000))));
            const FPS = Math.round((frame / ((currentFrameTime - startTime) / 1000)));
            console.log('FPS:', FPS)
            startTime = currentFrameTime;
            frame = 0;
        };
        lastFrameTime = currentFrameTime;
        // console.log('gameloop');

        updateGame(deltaTime);
        renderGame();

        requestAnimationFrame(GameLoop);
    }

  // millegiprst kutsub kaks korda. dunno miks. norm bandage see prg
  LAR.useEffect(()=>{
    console.log(prop.gameState)
    if (prop.gameState.GameGrid){
      console.log("ALUSTA GAMELOOP")
      GameLoop();
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
