import { LAR } from './framework';
import { Lobby } from './components/lobby.jsx';

const App = () => {




    return (
        <body>
            <div id="lobby">{Lobby()}</div>
            <div id="game"></div>
        </body>
    )
};

export default App;
