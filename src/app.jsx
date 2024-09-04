import { LAR } from './framework';
const App = () => {

    let counter = 0

   const [count, updateCount] = LAR.useState(1);

   const addOne = () => {
    counter = count + 1
    updateCount(counter)
}

return (<body>
            <h1 onClick={() => addOne()}>COUNTER: {count}</h1>
</body>)};

export default App; 
 