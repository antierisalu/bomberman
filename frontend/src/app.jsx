import { LAR } from './framework';
import Lobby from './components/lobby';
import Game from './components/game';
import Level from './components/level';




const App = () => {
    const [players, updatePlayers] = LAR.useState([])
    const [gameState, updateGameState] = LAR.useState([])


    return (
        <body>
            <div id="lobby">
                <Lobby players={players} updatePlayers={updatePlayers} gameState={gameState} updateGameState={updateGameState}/>
            </div>
            <div id="game">
                <Game players={players} updatePlayers={updatePlayers} gameState={gameState} updateGameState={updateGameState}/>
            </div>

            {/* <div id="waitingScreen">
                <WaitingScreen />
            </div> */}
        </body>
    )
};

export default App;
