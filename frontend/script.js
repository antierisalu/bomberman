import { StartClientWebsocket } from "./websocket.js";
document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById('join-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        fetch('http://localhost:8080/newPlayer', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log("success:", data)
            // Connect ws 
            StartClientWebsocket(this.text.value, this.color.value)
        })
        .catch(error => {
            console.log("Error:", error);
        })
    })



});

/* function gameLoop(){
    
    requestAnimationFrame(gameLoop())
}
window.requestAnimationFrame(gameLoop())
 */

