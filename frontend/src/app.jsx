import { LAR } from './framework';
import Lobby from './components/lobby';
import Chat from './components/chat';

const App = () => {

    return (
        <body>
            <div id="chat">
                <Chat /> 
            </div>
          {/*   <div id="lobby">
                <Lobby />
            </div> */}
            <div id="game"></div>
        </body>
    )
};

export default App;