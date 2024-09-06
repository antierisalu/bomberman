import { LAR } from "../framework"
import Level from "./level";

const Arena = () => {

    class Player {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.speed = 5;
            this.color = color;
            this.element = {};
        }

        createPlayerElement() {
            this.element = (<div id="player"></div>)
        }
    }





    const [deltaTime, updateDelta] = LAR.useState(0);
    // game loop
    // https://www.codeease.net/programming/javascript/delta-time-js - solution 2
    let lastFrameTime = 0;
    function gameLoop(currentTime, deltaTime) {
        // console.log(currentTime)
        // Calculate delta time
        deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
        updateDelta(deltaTime => deltaTime = (currentTime - lastFrameTime) / 1000)
        lastFrameTime = currentTime;

        // Update game logic based on delta time
        updateGameLogic(deltaTime);
        renderGame();

        // console.log(deltaTime)
        // Request the next frame
        requestAnimationFrame(gameLoop);
    }
    function updateGameLogic(deltaTime) {
        // Update game objects based on delta time
        // e.g., move objects, change their properties, etc.
        //   player.x += player.speed * deltaTime;
    }
    function renderGame() {

    }

    // Start the game loop
    requestAnimationFrame(gameLoop);

    return (
        <div>
            <Level />
            <h1>DeltaTime: {deltaTime}</h1>
        </div>
    )
}

export default Arena;