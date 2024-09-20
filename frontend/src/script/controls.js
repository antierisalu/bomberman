import { sendMessage } from "../websocket";


export class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener("keydown", e => {
            if ((e.key === "d" ||
                e.key === "a" ||
                e.key === "w" ||
                e.key === "s" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight")
                && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key)
            }
            if (e.key === " "){
                sendMessage(JSON.stringify({type:'bomb'}))
            }
        })
        window.addEventListener("keyup", e => {
            if ((e.key === "d" ||
                e.key === "a" ||
                e.key === "w" ||
                e.key === "s" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight")) {
                this.keys.splice(this.keys.indexOf(e.key), 1)
            }
        })
    }
}
