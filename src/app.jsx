import { LAR } from './framework';
const App = () => {

    const [allTasks, changeAllTasks] = LAR.useState([]);
   let counter = 1

   const addOne = () => counter++

return (<body>
            <h1 onClick={() => addOne()}> {counter}</h1>

</body>)};

export default App; 
 