import { LAR } from './framework';
import '../public/styles.css';
import App from './app';
import Lobby from './components/lobby';

// let appElement = <App />
// LAR.render(appElement, document.body);

LAR.render(<Lobby />, document.body)