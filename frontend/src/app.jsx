import { LAR } from './framework';
import Lobby from './components/lobby';

const App = () => {

    const [isRegistered, registerPlayer] = LAR.useState(false)
    const [players, updatePlayers] = LAR.useState([])
    //startWS
    //registerPlayer


    return (
        <body>
            {isRegistered ? 
            <div id="game"></div> : 
            <div id="lobby">
                <Lobby registerPlayer={registerPlayer} players={players} updatePlayers={updatePlayers} />
            </div>}
            
            
        </body>
    )
};

export default App;
