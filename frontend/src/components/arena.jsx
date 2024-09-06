import { LAR } from "../framework"

const Arena = () => {

    const deltaTime = 0;

    // game loop
    // https://www.codeease.net/programming/javascript/delta-time-js - solution 2
    let lastFrameTime = 0;
    function gameLoop(currentTime) {
        // Calculate delta time
        const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
        lastFrameTime = currentTime;

        // Update game logic based on delta time
        updateGameLogic(deltaTime);
        renderGame();

        // Request the next frame
        requestAnimationFrame(gameLoop);
    }
    function updateGameLogic(deltaTime) {
        // Update game objects based on delta time
        // e.g., move objects, change their properties, etc.
        //   player.x += player.speed * deltaTime;
    }
    function renderGame() {
        console.log("running")
        LAR.render(<Arena />, document.body)

    }
    // Start the game loop
    requestAnimationFrame(gameLoop);

    return (
        <div>
            <h1>DeltaTime: {deltaTime}</h1>
        </div>
    )
}

export default Arena;