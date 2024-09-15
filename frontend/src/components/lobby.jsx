import { LAR } from "../framework"
import { StartClientWebsocket } from '../websocket.js'
import { sendMessage, ws } from "../websocket";




const Lobby = (props) => {

    function sendJoinRequest(event) {
        event.preventDefault();

        // temporary hack hide after submit
        document.getElementById('lobby').style.display = "none";

        const formData = new FormData(event.target);
        fetch('http://localhost:8080/newPlayer', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                props.changeClientInfo({name:event.target.text.value, color:event.target.color.value})
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
                }
            }
        }

    return (
        <div>
            {props.isRegistered ? 
            <div>
                <div className="players">{props.players.map(elem=><div>{elem.username} - {elem.color}</div>)}</div>
                <button onClick={()=>props.sendToGame(true)}>GO TO GAME</button>
                <button onClick={()=>sendMessage(JSON.stringify({ type:'ping'}))}>Ping Test</button>
            </div> : 
            <div>
                
                <form onSubmit={(event) => sendJoinRequest(event)} id="join-form" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div class="input-container">
                        <input class="input" type="text" name="text" placeholder="Your name here..." id="username-field" />
                    </div>
                    <div style="margin: 30px;">
                        <div style="display: flex; gap: 10px; margin: 10px;">
                            <div style="background-color: red; height: 20px; width: 20px"></div>
                            <input name="color" type="radio" id="color-option1" value="red" />
                        </div>
                        <div style="display: flex; gap: 10px; margin: 10px;">
                            <div style="background-color: green; height: 20px; width: 20px"></div>
                            <input name="color" type="radio" id="color-option2" value="green" />
                        </div>
                        <div style="display: flex; gap: 10px; margin: 10px;">
                            <div style="background-color: blue; height: 20px; width: 20px"></div>
                            <input name="color" type="radio" id="color-option3" value="blue" />
                        </div>
                        <div style="display: flex; gap: 10px; margin: 10px;">
                            <div style="background-color: purple; height: 20px; width: 20px"></div>
                            <input name="color" type="radio" id="color-option4" value="purple" />
                        </div>

                    </div>
                    <button class="button-50" type="submit">Play</button>
                </form>
            </div>}
        </div>
    )
}

export default Lobby;