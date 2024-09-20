import { Player } from "../script/player";
import { LAR } from "../framework";
import { sendMessage, ws } from "../websocket";
import { updateGame } from "../script/update";
// import { renderGame } from "../script/render";
import { InputHandler } from "../script/controls";

let players = [];//not state but game class entities

const Players = (prop) => {

    let playersNames = prop.players
    let input;
    let client = prop.clientInfo;

    const initPlayers = () => {
        const gameWorldDiv = document.getElementById("gameArea");
        playersNames.forEach((playerName, index) => {
          let ele = document.getElementById(`player${index}`)
          const player = new Player(ele, gameWorldDiv, playerName.username, prop.gameState.GameGrid);
          players.push(player); 
      });
      return players;
  };

  //et saada cellidele dom elemente getClientRect jaoks
    const initCellElements = () => {
        for (let y = 0; y < 11; y++) {
          for (let x = 0; x < 13; x++) {
            let cellDom = document.getElementById(y+'-'+x)
            prop.gameState.GameGrid[y][x].element = cellDom
          }
        }
      }
    
    if (ws){ // see kirjutab yle lobby.jsx'i ws.onmessage methodi
      ws.onmessage = function (event) {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "player_list":
              prop.updatePlayers(data.players)
              break;
            case "gameState":
              prop.updateGameState(data.gameState);
              break;
            case "start":
              initCellElements();
              initPlayers();
              input = new InputHandler();
              GameLoop(0);
              break;
            case "updateXY":
              //update player positions
              players.forEach(player => {
                data.players.forEach(serverPlayer =>{
                  if (player.name !== client.name && player.name == serverPlayer.username){
                    player.x = serverPlayer.position.x
                    player.y = serverPlayer.position.y
                  }
                })
              })
            }
        }
    }

    LAR.useEffect(()=>{
      initCellElements();
      players.forEach((player)=>{//update the cell info for player class when gamestate gets updated
        player.cells = prop.gameState.GameGrid
      })
    },[prop.gameState])

    let lastFrameTime = 0;
    let frame = 0;
    let startTime = performance.now();
    
    // https://www.codeease.net/programming/javascript/delta-time-js - solution 2
    // https://codepen.io/lnfnunes/pen/Qjeeyg - fps counter
    function GameLoop(currentFrameTime) {
        const deltaTime = (currentFrameTime - lastFrameTime) / 1000; // Convert to seconds
        frame++;
        if (currentFrameTime - startTime > 1000) {
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
              <span className="player" id={`player${index}`}>{player.username}</span>
              
          </div>
        ))}
    </div>
  );
};

export default Players;
