
export class HUD {
    constructor(DOM, vDOM, prop)  {
        this.dom = DOM;
        this.prop = prop
        this.health = this.dom.querySelector('#health-counter');
        this.health.dataset.currentValue = vDOM.health;
        this.health.textContent = vDOM.health;

        this.powerupSpeed = this.dom.querySelector('#powerupSpeed-counter');
        this.powerupSpeed.dataset.currentValue = 0;
        this.powerupBomb = this.dom.querySelector('#powerupBomb-counter');
        this.powerupBomb.dataset.currentValue = 0;
        this.powerupFire = this.dom.querySelector('#powerupFire-counter');
        this.powerupFire.dataset.currentValue = 0;

        this.setPlayerIcons(vDOM.players);
    }

    setPlayerIcons(players) {
        const clientPlayer = players.find(player => player.isClient);
        if (clientPlayer) {
            const playerIconContainer = this.dom.querySelector('#hudPlayer-0');
            const playerNameElement = playerIconContainer.querySelector('.playerIconName p');
            const playerIconElement = playerIconContainer.querySelector('.playerIcon');

            playerNameElement.textContent = clientPlayer.name;
            playerNameElement.style.backgroundColor = `${clientPlayer.color}`;
            playerIconElement.classList.add(`playerIcon-${clientPlayer.color}`);
            playerIconContainer.style.display = 'flex';

        }

        // Non client icons
        players.forEach((player, idx) => {
            if (!player.isClient && idx < 3) {
            const playerIconContainer = this.dom.querySelector(`#hudPlayer-${idx+1}`);
            const playerNameElement = playerIconContainer.querySelector('.playerIconName p');
            const playerIconElement = playerIconContainer.querySelector('.playerIcon');
            playerNameElement.textContent = player.name;
            playerNameElement.style.backgroundColor = `${player.color}`;
            playerIconElement.classList.add(`playerIcon-${player.color}`);
            playerIconContainer.style.display = 'flex';

            }
        });
    }


    // displayInfo() {
    //     console.log(`Info|| ${this.who}, ${this.players}, ${this.dom}`)
    // }


    updateCounter(counterElement, newNumber) {
        // const counter = document.getElementById(counterElement);
        // console.log(counter);
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
        console.log(this.prop)
        console.log(this.prop)
        const playerContainer = Array.from(this.dom.querySelectorAll('.playerIconContainer')).find(container => {
            return container.querySelector('.playerIconName p').textContent === playerName;
        });

        if (playerContainer) {
            const playerEmoji = playerContainer.querySelector('.hudEmoji');
            playerEmoji.style.backgroundImage = `url(./assets/emojis/${emoji}.png)`;
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


}