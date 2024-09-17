
export const updateGame = (deltaTime, input, players, client) => {
    players.forEach(player => {
        if (player.element) {
            if (player.name === client.name) {
                player.update(input, deltaTime);
            }
        }
    });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
}