import { Player } from "../script/player";
import { LAR } from "../framework";
import { ws } from "../websocket";
import { updateGame } from "../script/update";
import { InputHandler } from "../script/controls";
import Chat from "./chat";
import { HUD } from "../script/hud";


let players = []; //not state but game class entities
let cells = []; //
let hud;

const Players = (prop) => {
    window.addEventListener("resize", resizeAction);

    const [winner, setWinner] = LAR.useState("");

    function resizeAction() {
        players.forEach((player) => {
            if (player.name === client.name) {
                player.updateOnResize();
            }
        });
    }

    let playersNames = prop.players;
    let input;
    let client = prop.clientInfo;

    const initPlayers = () => {
        const gameWorldDiv = document.getElementById("gameArea");
        playersNames.forEach((playerName, index) => {
            let ele = document.getElementById(`player${index}`);
            const player = new Player(
                ele,
                gameWorldDiv,
                playerName.username,
                prop.gameState.GameGrid
            );
            players.push(player);
        });
        return players;
    };

    //et saada cellidele dom elemente getClientRect jaoks
    const initCellElements = () => {
        for (let y = 0; y < 11; y++) {
            for (let x = 0; x < 13; x++) {
                let cellDom = document.getElementById(y + "-" + x);
                prop.gameState.GameGrid[y][x].element = cellDom;
                if (cells.length > 0) {
                    prop.gameState.GameGrid[y][x].collidableBomb =
                        cells[y][x].collidableBomb;
                    // remember to keep bomb collideable after gamestate update
                }
            }
        }
        cells = prop.gameState.GameGrid;
    };

    if (ws) {
        // see kirjutab yle lobby.jsx'i ws.onmessage methodi
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case "player_list":
                    prop.updatePlayers(data.players);
                    break;
                case "gameState":
                    prop.updateGameState(data.gameState);
                    break;
                case "start":
                    initCellElements();
                    initPlayers();
                    const dom = document.getElementById('HUD');
                    hud = new HUD(dom, prop);                    
                    input = new InputHandler();
                    GameLoop(0);
                    break;
                case "updateXY":
                    //update player positions
                    players.forEach((player) => {
                        data.players.forEach((serverPlayer) => {
                            if (
                                player.name !== client.name &&
                                player.name == serverPlayer.username
                            ) {
                                player.x = serverPlayer.position.x;
                                player.y = serverPlayer.position.y;
                            }
                        });
                    });
                    break;
                case "death":
                    hud.kill(data.player.username)
                    if (data.player.username == client.name) {
                        players = [];
                        prop.killPlayer(false);
                    } else {
                        players.forEach((player) => {
                            if (player.name === data.player.username) {
                                player.index = -999;
                            }
                        });
                    }
                    break;
                case "chat_message":
                    prop.setMessages((prevMessages) => [...prevMessages, data]); // Update chat messages
                    hud.chatEmoji(data.player.username, data.content);
                    break;
                case "damage":
                    prop.updatePlayers((pleierid) => {
                        pleierid.forEach((player) => {
                            if (player.username === data.player.username) {
                                hud.emoji(player.username, "cry")
                                player.lives = data.player.lives;
                                if (player.username === prop.clientInfo.name){
                                  hud.updateHealth(data.player.lives)
                                }
                            }
                        });
                        return pleierid;
                    });
                    
                    break;
                case "winner":
                    console.log(data.player.username, "is the winner");
                    setWinner(data.player.username);
                default:
                    console.log("unknown data:", data.type);
            }
        };
    }

    LAR.useEffect(() => {
        initCellElements();
        players.forEach((player) => {
            //update the cell info for player class when gamestate gets updated
            player.cells = prop.gameState.GameGrid; 
            if (player.name === prop.clientInfo.name && hud !== undefined){
            hud.updatePowerupSpeed(prop.gameState.Players[prop.clientInfo.index].powerUpLevel.speed)
            hud.updatePowerupBomb(prop.gameState.Players[prop.clientInfo.index].powerUpLevel.bombs)
            hud.updatePowerupFire(prop.gameState.Players[prop.clientInfo.index].powerUpLevel.flames)
            }
        });
    }, [prop.gameState]);

    let lastFrameTime = 0;
    let frame = 0;
    let startTime = performance.now();

    function GameLoop(currentFrameTime) {
        if (prop.alive) {
            const deltaTime = (currentFrameTime - lastFrameTime) / 1000; // Convert to seconds
            frame++;
            if (currentFrameTime - startTime > 1000) {
                startTime = currentFrameTime;
                frame = 0;
            }
            lastFrameTime = currentFrameTime;

            updateGame(deltaTime, input, players, client);
            requestAnimationFrame(GameLoop);
        }
    }
    return (
        <div>
            {winner != "" ? (
                <div class="winner">
                    {winner} is the winner!
                    <button onClick={()=> window.location.reload()}>Main Menu</button>
                </div>
            ) : (
                <div></div>
            )}
            <Chat messages={prop.messages} setMessages={prop.setMessages} />
            {prop.players.map((player, index) => (
                <div>
                    {player.index !== -999 ? (
                        <span className="player" id={`player${index}`}>
                            {player.username}
                        </span>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default Players;
