import die from '../../public/assets/die.png';
import cry from '../../public/assets/cry.png';
import crying from '../../public/assets/crying.png';
import annoyed from '../../public/assets/annoyed.png'; 


const emojiBank = {
    "die": die,
    "cry": cry,
    "crying": crying,
    "annoyed": annoyed,
}

export class HUD {
    constructor(DOM, prop)  {
        this.dom = DOM;
        this.prop = prop;
        this.health = this.dom.querySelector('#health-counter');
        this.health.dataset.currentValue = 0;
        this.health.textContent = 0;

        this.powerupSpeed = this.dom.querySelector('#powerupSpeed-counter');
        this.powerupSpeed.dataset.currentValue = 0;
        this.powerupBomb = this.dom.querySelector('#powerupBomb-counter');
        this.powerupBomb.dataset.currentValue = 0;
        this.powerupFire = this.dom.querySelector('#powerupFire-counter');
        this.powerupFire.dataset.currentValue = 0;
        this.initialize();
        this.setPlayerIcons(prop.gameState.Players);
    }

    initialize() {
        this.prop.gameState.Players.forEach((serverPlayer) => {
           if (serverPlayer.username === this.prop.clientInfo.name){
            this.health.dataset.currentValue = serverPlayer.lives;
            this.updateHealth(serverPlayer.lives);
           }
        });
    }




    setPlayerIcons(players) {
        const colors = ['red', 'blue', 'purple', 'green']
        const clientPlayer = players.find(player => player.username === this.prop.clientInfo.name);
        if (clientPlayer) {
            const playerIconContainer = this.dom.querySelector('#hudPlayer-0');
            const playerNameElement = playerIconContainer.querySelector('.playerIconName p');
            const playerIconElement = playerIconContainer.querySelector('.playerIcon');

            playerNameElement.textContent = clientPlayer.username;
 
            playerNameElement.style.backgroundColor = `${colors[clientPlayer.index]}`;
            playerIconElement.classList.add(`playerIcon-${colors[clientPlayer.index]}`);
            playerIconContainer.style.display = 'flex';
        }

        //Non client icons
        players.forEach((player, idx) => {
            if (player.username !== this.prop.clientInfo.name && idx < 3) {
            const playerIconContainer = this.dom.querySelector(`#hudPlayer-${idx+1}`);
            const playerNameElement = playerIconContainer.querySelector('.playerIconName p');
            const playerIconElement = playerIconContainer.querySelector('.playerIcon');
            playerNameElement.textContent = player.username;
            playerNameElement.style.backgroundColor = `${colors[player.index]}`;
            playerIconElement.classList.add(`playerIcon-${colors[player.index]}`);
            playerIconContainer.style.display = 'flex';

            }
        });
    }



    updateCounter(counterElement, newNumber) {
        if (!counterElement) return;

        const currentValue = parseInt(counterElement.dataset.currentValue, 10) || 0;

        counterElement.classList.remove('animate-slide-up', 'animate-slide-down');

        if (newNumber > currentValue) {
            counterElement.classList.add('animate-slide-up');
        } else if (newNumber < currentValue) {
            counterElement.classList.add('animate-slide-down');
        }


        counterElement.textContent = newNumber;
        counterElement.dataset.currentValue = newNumber;

        counterElement.offsetWidth;


        const handleAnimationEnd = () => {
            counterElement.classList.remove('animate-slide-up', 'animate-slide-down');
            counterElement.removeEventListener('animationend', handleAnimationEnd);
        };

        counterElement.addEventListener('animationend', handleAnimationEnd);
        // counter.classList.add('animate-slide-up');
    }

    updateHealth(newHealthValue) {
        this.updateCounter(this.health, newHealthValue)
    }

    updatePowerupSpeed(newPowerupValue) {
        this.updateCounter(this.powerupSpeed, newPowerupValue)
        if (newPowerupValue > 0){
            setTimeout(()=>{
                this.updateCounter(this.powerupSpeed, newPowerupValue-1)
            }, 5000)
        }
    }

    updatePowerupBomb(newPowerupValue) {
        this.updateCounter(this.powerupBomb, newPowerupValue)
    }

    updatePowerupFire(newPowerupValue) {
        this.updateCounter(this.powerupFire, newPowerupValue)
    }

    kill(playerName) {
        const playerContainer = Array.from(this.dom.querySelectorAll('.playerIconContainer')).find(container => {
            return container.querySelector('.playerIconName p').textContent === playerName;
        });

        if (playerContainer) {
            const playerIconElement = playerContainer.querySelector('.playerIcon');
            const playerCross = playerContainer.querySelector('.playerCross');
            playerIconElement.classList.add('grayScale');
            playerCross.style.display = 'block';
            this.emoji(playerName, "die");
        }
    }

    emoji(playerName, emoji) {
        const playerContainer = Array.from(this.dom.querySelectorAll('.playerIconContainer')).find(container => {
            return container.querySelector('.playerIconName p').textContent === playerName;
        });

        if (playerContainer) {
            const playerEmoji = playerContainer.querySelector('.hudEmoji');
            playerEmoji.style.backgroundImage = `url(${emojiBank[emoji]})`;
            playerEmoji.style.display = 'block';
            playerEmoji.classList.remove('show');


            void playerEmoji.offsetWidth;
            
            playerEmoji.classList.add('show');

            setTimeout(() => {
                playerEmoji.classList.add('fade-out');
            }, 1500);

            setTimeout(() => {
                playerEmoji.style.display = 'none'
                playerEmoji.classList.remove('show', 'fade-out');
            }, 2000);
            // playerEmoji.style.display = 'none';
        }

    }

    chatEmoji(playername, message) {
        if (message === ":<") {
            this.emoji(playername, 'annoyed');
        }
    }


}