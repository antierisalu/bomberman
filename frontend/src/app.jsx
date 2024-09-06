import { LAR } from './framework';
import Lobby from './components/lobby';
import Arena from './components/arena';

const App = () => {




    return (
        <body>
            <div id="lobby">
                <Lobby />
            </div>
            <div id="game">
                <Arena />
            </div>
        </body>
    )
};

export default App;
