import { LAR } from "../framework";
import { sendMessage, ws } from "../websocket";
import Chat from "./chat";

const Lobby = (props) => {
    const [timer, setTimer] = LAR.useState(0);
    const [lobbyTimer, setLobbyTimer] = LAR.useState(true);
    const [errorMsg, changeErrorMsg] = LAR.useState("");

    function sendJoinRequest(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        fetch("http://localhost:8080/newPlayer", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(text);
                    });
                }
                return response.json();
            })
            .then((data) => {
                props.changeClientInfo({
                    name: event.target.text.value,
                    index: data,
                });
                props.registerPlayer(true);
            })
            .catch((error) => {
                changeErrorMsg(error.message);
            });
    }

    if (ws) {
        // see kirjutab yle websocket.js'i ws.onmessage methodi
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case "player_list": //backendilt saadud player list (saadab iga kord kui keegi joinib). clienti info on clientInfo stateis App tasemel
                    props.updatePlayers(data.players);
                    break;
                case "gameState":
                    props.updateGameState(data.gameState);
                    // console.log("IM UPDATING GAMESTATE")
                    break;
                case "timer":
                    // console.log(data.gameState.Timer)
                    setTimer(data.gameState.Timer.TimeRemaining / 1000000000);
                    if (!data.gameState.Timer.LobbyTimer) {
                        setLobbyTimer(false);
                    }
                    if (
                        data.gameState.Timer.TimeRemaining < 1 &&
                        data.gameState.Timer.LobbyTimer == false
                    ) {
                        props.sendToGame(true);
                    }
                    break;
                case "chat_message":
                    props.setMessages((prevMessages) => [
                        ...prevMessages,
                        data,
                    ]); // Update chat messages
                    break;
                case "timer_stopped":
                    setTimer(-1);
                    console.log(
                        "Timer has been stopped due to insufficient players."
                    );
                    break;
            }
        };
    }

    return (
        <div>
            {props.isRegistered ? (
                <div>
                    {timer > 0 ? (
                        <div>
                            <div>
                                {lobbyTimer
                                    ? "Waiting for players"
                                    : "Starting Soon"}
                            </div>
                            <div className="timer">
                                {timer} seconds remaining
                            </div>
                        </div>
                    ) : (
                        <div>
                            {lobbyTimer
                                ? "Waiting for players"
                                : "Starting Soon"}
                        </div>
                    )}
                    <Chat
                        messages={props.messages}
                        setMessages={props.setMessages}
                        style={{
                            position: "absolute",
                            left: "600px",
                            top: "-9px",
                            padding: "10px",
                            width: "200px",
                        }}
                        messagesStyle={{
                            height: "510px",
                        }}
                    />
                    <div className="players">
                        {props.players.map((elem) => (
                            <div>{elem.username}</div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <form
                        onSubmit={(event) => sendJoinRequest(event)}
                        id="join-form"
                        style="display: flex; flex-direction: column; align-items: center; justify-content: center;"
                    >
                        <div class="input-container">
                            <input
                                style="margin-bottom: 50px;"
                                class="input"
                                type="text"
                                name="text"
                                placeholder="Your name here..."
                                id="username-field"
                            />
                        </div>
                        <button class="button-50" type="submit">
                            Play
                        </button>
                        <div style="color: red; font-size:x-large; margin-top: 20px">
                            {errorMsg}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Lobby;
