import { LAR } from "../framework"
import Level from "./level";
import { renderGame } from "../script/render";
import { updateGame } from "../script/update";
import { initControls } from "../script/controls";
import Players from "./players";

const Game = (prop) => {
    console.log("GAME ON SIIN &&&**&*&*&*&*&*&*&")
    const [FPS, updateFPS] = LAR.useState(0);
    // https://www.codeease.net/programming/javascript/delta-time-js - solution 2
    // https://codepen.io/lnfnunes/pen/Qjeeyg - fps counter




    return (
        <div>
            <h1 id="fps">FPS: {FPS}</h1>
        </div>
    )
}

export default Game;