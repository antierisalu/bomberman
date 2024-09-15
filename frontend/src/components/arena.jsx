import { LAR } from "../framework"
import { sendMessage, ws } from "../websocket";

const Arena = (props) => {

    const [nuss, nussime] = LAR.useState(0)//n2ide useStatest

    if (ws){ // see kirjutab yle lobby.jsx'i ws.onmessage methodi
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
                console.log(data)
        }
    }
    LAR.useEffect(()=>{
        console.log("init players")
    },[])//tyhi [] teeb ainult esimene kord

    return (
        <div>
            <h1>ARENA</h1>
            <button onClick={()=>sendMessage(JSON.stringify({ type:'ping'}))}>Ping Test</button>
            <button onClick={()=>nussime(nuss+1)}>Nussi</button>
            {nuss}
        </div>
    )
}

export default Arena;