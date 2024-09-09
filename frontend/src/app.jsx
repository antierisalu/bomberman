import { LAR } from './framework';
import Lobby from './components/lobby';
import Game from './components/game';
import Level from './components/level';



const App = () => {
    const [players, updatePlayers] = LAR.useState([])
    const [gamestate, updateGamestate] = LAR.useState([])


    return (
        <body>
            <div id="lobby">
                <Lobby players={players} updatePlayers={updatePlayers} gamestate={gamestate} updateGamestate={updateGamestate}/>
            </div>
            {/* <div id="game">
                <Game />
            </div> */}
            {/* <div id="game">
                <Level />
            </div> */}
        </body>
    )
};

export default App;
