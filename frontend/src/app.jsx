import { LAR } from './framework';
import Lobby from './components/lobby';
import Chat from './components/chat';
import Game from './components/game';
import Level from './components/level';
import { StartClientWebsocket } from './websocket';


const App = () => {
    const [players, updatePlayers] = LAR.useState([])
    const [gameState, updateGameState] = LAR.useState([])
    const [messages, setMessages] = LAR.useState([]);

     // Use useEffect to start WebSocket connection only once on mount
     LAR.useEffect(() => {
        StartClientWebsocket("testUsername", "red", updatePlayers, updateGameState);

        // Clean up the WebSocket connection when the component is unmounted, if necessary
        return () => {
            // Perform any cleanup here if needed, like closing the WebSocket connection
        };
    }, []); // Empty dependency array means this effect runs once on mount

    
    return (
        <body>
            <div id="chat">
                <Chat messages={messages} setMessages={setMessages} /> 
            </div>
           {/*  <div id="lobby">
                <Lobby players={players} updatePlayers={updatePlayers} gameState={gameState} updateGameState={updateGameState}/>
            </div>
            <div id="game">
                <Game players={players} updatePlayers={updatePlayers} gameState={gameState} updateGameState={updateGameState}/>
            </div>
            <div id="level">
                <Level players={players} updatePlayers={updatePlayers} gameState={gameState} updateGameState={updateGameState}/>
            </div>
            <div id="waitingScreen">
                <WaitingScreen />
            </div> */}
        </body>
    )
};

export default App;