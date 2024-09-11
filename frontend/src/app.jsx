import { LAR } from './framework';
import Lobby from './components/lobby';
import Chat from './components/chat';

const App = () => {
    const [messages, setMessages] = LAR.useState([]);
    
    return (
        <body>
            <div id="chat">
                <Chat messages={messages} setMessages={setMessages} /> 
            </div>
          {/*   <div id="lobby">
                <Lobby />
            </div> */}
            <div id="game"></div>
        </body>
    )
};

export default App;