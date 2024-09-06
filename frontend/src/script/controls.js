import { LAR } from "../framework";


function plantBomb() {

    let bombLocation = 'This place where user is. player.location vms'
    console.log(bombLocation)
    return

}

function isMoving(movingDirection) {

}

export const movingDirection = null;

export const initControls = () => {
    // key down ( aka when pressed )
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW' || 'ArrowUp':
                console.log("W pressed")
                movingDirection = "up"
                break;
            case 'KeyA' || 'ArrowLeft':
                console.log("A pressed")
                movingDirection = "left"
                break;
            case 'KeyS' || 'ArrowDown':
                console.log("S pressed")
                movingDirection = "down"
                break;
            case 'KeyD' || 'ArrowRight':
                console.log("D pressed")
                movingDirection = "right"
                break;
            case 'Space' || 'KeyE' || 'Enter':
                console.log("Space pressed")
                plantBomb()
                break;
            default:
                break;
        }
    })
}
