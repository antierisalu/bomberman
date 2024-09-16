import { LAR } from "../framework"
import { sendMessage, ws } from "../websocket";
import Level from "./level";
import Players from "./players";

const Arena = (props) => {

    // console.log("GGG", props.gameState)

    const [nuss, nussime] = LAR.useState(0)//n2ide useStatest

    if (ws){ // see kirjutab yle lobby.jsx'i ws.onmessage methodi
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
                switch (data.type) {
                }

        }
    }


    
    

    LAR.useEffect(()=>{
        console.log("init players")
    },[])//tyhi [] teeb ainult esimene kord

    return (
        <div>
            <h1>ARENA</h1>
            <button onClick={()=>sendMessage(JSON.stringify({ type:'ping'}))}>Ping Test</button>
            <button onClick={()=>nussime(nuss+1)}>Nussi</button> {nuss}
            <Level players={props.players} updatePlayers={props.updatePlayers} gameState={props.gameState} updateGameState={props.updateGameState}/>

        </div>
    ) 
}

export default Arena;