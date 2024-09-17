import { Player } from "../script/player";
import { LAR } from "../framework";
import { sendMessage, ws } from "../websocket";
import { updateGame } from "../script/update";
// import { renderGame } from "../script/render";
import { InputHandler } from "../script/controls";

const Players = (prop) => {

    let playersNames = prop.players
  
    let players = [];//not state but game class entities
    let input;

    let client = prop.clientInfo;

    const initPlayers = (doms) => {
        const gameWorldDiv = document.getElementById("gameArea");
        console.log(gameWorldDiv)
        playersNames.forEach((playerName, index) => {
          let ele = document.getElementById(`player${index}`)
          const player = new Player(ele, gameWorldDiv, playerName.username);
          //console.log(player.x,player.y, player.name)
          //console.log(player.element.style, player.element.style )
          console.log(player.playerRect, player.clientGameRect)
          players.push(player); 
      });

      console.log('players after inplayers')
  
      return players;
  };
  

    if (ws){ // see kirjutab yle lobby.jsx'i ws.onmessage methodi
      ws.onmessage = function (event) {
          const data = JSON.parse(event.data);
          //console.log('ws on message data: ', data);
          switch (data.type) {
            case "player_list":
              prop.updatePlayers(data.players)
              break;
            case "gameState":
              prop.updateGameState(data.gameState);
              break;
            case "start":
              initPlayers();
              input = new InputHandler();
              GameLoop();
            case "updateXY":
              players.forEach(player => {
                if (player.name !== client.name){
                  
                }
              })
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
            // console.log('FPS:', FPS)
            startTime = currentFrameTime;
            frame = 0;
        };
        lastFrameTime = currentFrameTime;

        updateGame(deltaTime, input, players, client);
        requestAnimationFrame(GameLoop);
    }

  return (
    <div>
      <div className="hud">
        <div className="hudPlayers">
          {prop.players.map((player, index) => (
            <div key={index} className="hudPlayer">
              <span>{player.username}</span> - <span>{player.color}</span>
            </div>
          ))}
        </div>
      </div>
        {prop.players.map((player, index) => (
          <div>
              <span className="player" id={`player${index}`}></span>
          </div>
        ))}
    </div>
  );
};

export default Players;
