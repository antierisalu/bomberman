import { LAR } from "../framework"
import { StartClientWebsocket } from '../websocket.js'
import { sendMessage, ws } from "../websocket";

const Lobby = (props) => {

    const [timer, setTimer] = LAR.useState(0)

    function sendJoinRequest(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch('http://localhost:8080/newPlayer', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text); 
                    });
                }
                return response.json(); 
            })
            .then(data => { 
                props.changeClientInfo({name:event.target.text.value, index: data})
                props.registerPlayer(true)
            })
            .catch(error => {
                console.log("Error:", error);
            })
    }

    if (ws){ // see kirjutab yle websocket.js'i ws.onmessage methodi
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case "player_list": //backendilt saadud player list (saadab iga kord kui keegi joinib). clienti info on clientInfo stateis App tasemel
                    console.log("Updating players with:", data.players);
                    props.updatePlayers(data.players)
                    break;
                case "gameState":
                    props.updateGameState(data.gameState);
                    // console.log("IM UPDATING GAMESTATE")
                    break;
                case "timer":
                    // console.log(data.gameState.Timer)
                    setTimer(data.gameState.Timer.TimeRemaining/1000000000)
                    if (data.gameState.Timer.TimeRemaining < 1){
                        props.sendToGame(true)
                    }
                }
            }
        }

    return (
        <div>
            {props.isRegistered ? 
            <div>
                {timer>0 ? <div className="timer">{timer} seconds remaining</div> : "Waiting for players"}
                <div className="players">{props.players.map(elem=><div>{elem.username} - {elem.color}</div>)}</div>
                <button onClick={()=>sendMessage(JSON.stringify({ type:'ping'}))}>Ping Test</button>
            </div> : 
            <div>       
                
                <form onSubmit={(event) => sendJoinRequest(event)} id="join-form" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div class="input-container">
                        <input style="margin-bottom: 50px;" class="input" type="text" name="text" placeholder="Your name here..." id="username-field" />
                    </div>
                    <button class="button-50" type="submit">Play</button>
                </form>
            </div>}
        </div>
    )
}

export default Lobby;