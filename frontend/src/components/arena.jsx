import { LAR } from "../framework"
import { sendMessage, ws } from "../websocket";
import Level from "./level";

const Arena = (props) => {

    const [nuss, nussime] = LAR.useState(0)//n2ide useStatest

    return (
        <div>
            <h1>ARENA</h1>
            <button onClick={()=>sendMessage(JSON.stringify({ type:'ping'}))}>Ping Test</button>
            <button onClick={()=>nussime(nuss+1)}>Nussi</button> {nuss}
            <Level players={props.players} updatePlayers={props.updatePlayers} nuss={nuss}/>

        </div>
    ) 
}

export default Arena;