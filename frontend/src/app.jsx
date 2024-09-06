import { LAR } from './framework';
import Lobby from './components/lobby';
import Game from './components/game';

const App = () => {




    return (
        <body>
            <div id="lobby">
                <Lobby />
            </div>
            <div id="game">
                <Game />
            </div>
        </body>
    )
};

export default App;
