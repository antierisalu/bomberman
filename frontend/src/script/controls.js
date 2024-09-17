import { LAR } from "../framework";


function plantBomb() {

    let bombLocation = 'This place where user is. player.location vms'
    console.log(bombLocation)
    return

}

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
                e.key === "ArrowRight" ||
                e.key === " ")
                && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key)
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
                e.key === "ArrowRight" ||
                e.key === " ")) {
                this.keys.splice(this.keys.indexOf(e.key), 1)
            }
        })
    }
}
