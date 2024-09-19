
export const updateGame = (deltaTime, input, players, client) => {
    players.forEach(player => {
        if (player.element) {


            //move players
            if (player.name === client.name) {
                //TODO: check if chatbox is open
                player.update(input, deltaTime);
            } else {
                // Updates other players based on their new position from the server
                player.moveOther()
            }
    }});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
}