import { LAR } from "../framework"
import Level from "./level";
import { renderGame } from "../script/render";
import { updateGame } from "../script/update";
import { initControls } from "../script/controls";

const Game = (prop) => {

    const [FPS, updateFPS] = LAR.useState(0);
    // https://www.codeease.net/programming/javascript/delta-time-js - solution 2
    // https://codepen.io/lnfnunes/pen/Qjeeyg - fps counter

    let lastFrameTime = 0;
    let frame = 0;
    let startTime = performance.now();

    function GameLoop(currentFrameTime) {
        const deltaTime = (currentFrameTime - lastFrameTime) / 1000; // Convert to seconds

        frame++;
        if (currentFrameTime - startTime > 1000) {
            updateFPS(FPS => FPS = Math.round((frame / ((currentFrameTime - startTime) / 1000))));
            startTime = currentFrameTime;
            frame = 0;
        }2
        lastFrameTime = currentFrameTime;

        updateGame(deltaTime);
        renderGame();

        requestAnimationFrame(GameLoop);
    }
    GameLoop();
    initControls();

    return (
        <div>
            <Level players={prop.players} updatePlayers={prop.updatePlayers} gameState={prop.gameState} updateGameState={prop.updateGameState}/>
            <h1 id="fps">FPS: {FPS}</h1>
        </div>
    )
}

export default Game;