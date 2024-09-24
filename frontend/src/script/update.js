export const updateGame = (deltaTime, input, players, client) => {
    players.forEach(player => {
        if (player.element) {


            //move players
            if (player.name === client.name) {
                // dont move if chat is input is focused
                var chatInput = document.getElementById('chatInput');
                var isFocused = (document.activeElement === chatInput);
                if (isFocused) return;
                
                player.update(input, deltaTime);
            } else {
                // Updates other players based on their new position from the server
                player.moveOther()
            }
    }});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}