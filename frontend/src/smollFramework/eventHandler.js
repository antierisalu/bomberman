export class EventHandler {
    constructor() {
        this.events = {};
    }

    addEvent(element, eventType, callback) {
        if (!this.events[element]) {
            this.events[element] = {};
        }

        if (!this.events[element][eventType]) {
            this.events[element][eventType] = [];
        }

        this.events[element][eventType].push(callback);
        document.getElementById(element).addEventListener(eventType, callback);
        console.log(`EventHandler: Added ${eventType} event to #${element}`);
        console.log("Current Events:", this.events);
    }

    removeEvent(element, eventType, callback) {
        if (this.events[element] && this.events[element][eventType]) {
            const index = this.events[element][eventType].indexOf(callback);
            if (index > -1) {
                this.events[element][eventType].splice(index, 1);
                document
                    .getElementById(element)
                    .removeEventListener(eventType, callback);
                console.log(
                    `EventHandler: Removed ${eventType} event from #${element}`
                );
            }
        }
    }

    clearEvents(element, eventType) {
        if (this.events[element] && this.events[element][eventType]) {
            this.events[element][eventType].forEach((callback) => {
                document
                    .getElementById(element)
                    .removeEventListener(eventType, callback);
            });
            this.events[element][eventType] = [];
            console.log(
                `EventHandler: Cleared all ${eventType} events from #${element}`
            );
        }
    }
}
