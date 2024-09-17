
export const updateGame = (deltaTime, input, players, client) => {
    players.forEach(player => {
        if (player.element) {
            if (player.name === client.name) {
                player.update(input, deltaTime);
                //sendThrottled(x, y);
            } else {
                // console.log('moving', player.name)
                player.moveOther()
            }
    }});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
}

/*     function throttle(fn, limit) {
        let lastTime = 0;
        return function(...args) {
        const now = Date.now();
        if (now - lastTime >= limit) {
            lastTime = now;
            fn(...args);
        }
        };
    }

    function sendData(x, y) {
        sendMessage(JSON.stringify({type:'position', position:{x:x,y:y}}))
    }

    const sendThrottled = throttle(sendData, 1000 / 32); */