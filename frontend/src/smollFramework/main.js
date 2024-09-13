import { EventHandler } from './eventHandler.js'
import { Router } from './routing.js'
import { StateManager } from './stateManager.js'
import { DOMutils } from './dom.js'

export default class SmollFramework {
    constructor() {
        this.eventHandler = new EventHandler();
        this.router = null;
        this.stateManager = new StateManager();
        this.DOMutils = DOMutils;
    }

    setupRouter(routes) {
        this.router = new Router(routes);
        this.router.init();
    }
}