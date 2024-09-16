import { LAR } from './framework';
import Lobby from './components/lobby';
import Arena from './components/arena';
import { StartClientWebsocket } from './websocket';

const App = () => {
    const [players, updatePlayers] = LAR.useState([])
    const [gameState, updateGameState] = LAR.useState([])
    const [messages, setMessages] = LAR.useState([]);

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
            <div id="lobby">
                <Lobby />
=========    <div id="chat">
                <Chat messages={messages} setMessages={setMessages} /> 
            </div>

    
    const [players, updatePlayers] = LAR.useState([])
    

    function sendJoinRequest(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch('http://localhost:8080/newPlayer', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.status === 451) {
                return response.text().then(errMsg => {
                    throw new Error(errMsg);
                });
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            // Connect ws 
            StartClientWebsocket(event.target.text.value, event.target.color.value, updatePlayers)
        })
        .catch(error => {
            console.log("Error:", error);
        })
    }

    // let amogus = <Lol></Lol>
    // const [lobbyBool, changeLobby] = LAR.useState(true)



return (<div>

    <div>{players}</div>
    <form onSubmit={(event)=>sendJoinRequest(event)} id="join-form" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div class="input-container">
                <input class="input" type="text" name="text" placeholder="Your name here..." id="username-field" />
>>>>>>>>> Temporary merge branch 2
            </div>
            <div id="game"></div>
        </body>
    )
};

export default App;