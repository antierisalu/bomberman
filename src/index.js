import { LAR } from './framework';
import '../public/styles.css';
import App from './app';

let element = <App />
const rootElement = document.getElementById("root");
LAR.render(element, rootElement); 