import { LAR } from './framework';
import '../public/styles.css';
import App from './app';

import SmollFramework from './smollFramework/main';

const smFW = new SmollFramework();
smFW.stateManager.setState('smFW-LOADED', false)
smFW.stateManager.subscribe('smFW-LOADED', (state) => {
    console.log("SmollFramework (smFW) Loaded?: ", state);
});
smFW.stateManager.setState('smFW-LOADED', true);

LAR.render(<App />, document.body);
