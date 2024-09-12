import { LAR } from './framework';
import { StartClientWebsocket } from "./websocket.js";

const App = () => {


    
    const [players, updatePlayers] = LAR.useState([])
    LAR.useEffect(()=>{
        console.log("teretere")
    })
    

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
</div>)};

export default App; 
 