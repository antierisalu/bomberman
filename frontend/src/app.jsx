import { LAR } from './framework';
import Lobby from './components/lobby';
import Arena from './components/arena';
import { StartClientWebsocket } from './websocket';

const App = () => {

    const [isRegistered, registerPlayer] = LAR.useState(false) //kas client on registreeritud
    const [isInGame, sendToGame] = LAR.useState(false) //kas m2ng on alanud
    const [players, updatePlayers] = LAR.useState([]) //k6ik m2ngijad ja nende info
    const [clientInfo, changeClientInfo] = LAR.useState({}) //client m2ngija v2rv ja nimi mis s2ttitakse lobbys yhe korra
    LAR.useEffect(()=>{
        if (isRegistered){//alusta ws kui lobbys vajutatakse play
            console.log("registered")
            StartClientWebsocket(clientInfo.name, clientInfo.color, updatePlayers)
        }
    },[isRegistered])


    return (
        <body>
            {isInGame ? 
            <div id="game"><Arena players={players}/></div> : 
            <div id="lobby">
                <Lobby sendToGame={sendToGame} isRegistered={isRegistered} registerPlayer={registerPlayer} players={players} updatePlayers={updatePlayers} changeClientInfo={changeClientInfo} />
            </div>}
            
            
        </body>
    )
};

export default App;
