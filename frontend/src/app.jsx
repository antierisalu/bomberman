import { LAR } from './framework';
import Lobby from './components/lobby';
import Game from './components/game';
import Level from './components/level';

const App = () => {




    return (
        <body>
            {/* <div id="lobby">
                <Lobby />
            </div>
            <div id="game">
                <Game />
            </div> */}
            <div id="game">
                <Level />
            </div>
        </body>
    )
};

export default App;
