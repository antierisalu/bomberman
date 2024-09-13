export class StateManager {
    constructor() {
        this.state = {};
        this.subscribers = {};
    }

    setState(key, value) {
        this.state[key] = value;
        this.notifyStateChange(key);
    }

    getState(key) {
        return this.state[key];
    }

    subscribe(key, callback) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        this.subscribers[key].push(callback);
    }

    notifyStateChange(key) {
        if (this.subscribers[key]) {
            this.subscribers[key].forEach(callback => callback(this.state[key]));
        }
        console.log("StateManager: State changed. ", this.subscribers[key], this.state[key]);
    }
}