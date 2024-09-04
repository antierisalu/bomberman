
# Mini-Framework

# LAR Framework Documentation

## Authors

- Lukas Haavel
- Anti Erisalu
- Rain Praks

## Overview

LAR (Lukas Anti Rain) is a minimalist JavaScript framework inspired by React. It provides a virtual DOM, state management, and a simple API to create, update, and render UI components efficiently. LAR is designed to help developers build dynamic web applications with ease, focusing on core functionalities like element creation, attribute management, event handling, and component nesting.

## Features

- **Virtual DOM**: Efficient updates to the real DOM by calculating and applying the minimal number of changes.
- **State Management**: Manage state with a `useState` hook, allowing for reactive and dynamic UI updates.
- **Component-Based Architecture**: Build encapsulated components that manage their own state and can be reused across your application.
- **Event Handling**: Easily attach event listeners to elements, enabling interactive user interfaces.
- **JSX Support**: Compatible with JSX syntax, making it easier to write and understand UI components.

## How the Framework Works

LAR uses a virtual DOM to optimize updates to the actual DOM. Instead of directly modifying the DOM, LAR creates a virtual representation of it and only applies the necessary changes. The framework follows a component-based architecture, where each component can manage its own state using the `useState` hook.

The main functions in LAR include:

1. **createElement**: Creates a virtual DOM element.
2. **render**: Renders the virtual DOM to the actual DOM.
3. **useState**: Manages the state within components.
4. **Router**: Manages client-side routing.

## Creating an Element

To create an element in LAR, use the `createElement` function. This function takes the type of the element, an object of properties, and any child elements as arguments.

### Example

```js
import { LAR } from "./path/to/lar.js";

const element = LAR.createElement(
    "div",
    { id: "container", class: "my-container" },
    LAR.createElement("h1", null, "Hello, World!"),
    LAR.createElement("p", null, "This is a paragraph.")
);
```

**JSX Version:**

```jsx
const element = (
    <div id="container" className="my-container">
        <h1>Hello, World!</h1>
        <p>This is a paragraph.</p>
    </div>
);
```

## Adding Attributes to an Element

You can add attributes to an element by passing them as properties in the `createElement` function.

### Example

```js
const element = LAR.createElement(
    "button",
    { id: "myButton", class: "btn", onClick: () => alert("Button clicked!") },
    "Click Me"
);
```

**JSX Version:**

```jsx
const element = (
    <button id="myButton" className="btn" onClick={() => alert("Button clicked!")}>
        Click Me
    </button>
);
```

In this example, the button element is created with an `id`, `class`, and `onClick` event handler.

## Creating an Event

Events are handled by passing event listeners as properties to the `createElement` function. The event name should be prefixed with `on`.

### Example

```js
const handleClick = () => {
    console.log("Element clicked!");
};

const element = LAR.createElement(
    "div",
    { onClick: handleClick },
    "Click this div"
);
```

**JSX Version:**

```jsx
const element = (
    <div onClick={handleClick}>
        Click this div
    </div>
);
```

## Nesting Elements

You can nest elements by passing them as children to the `createElement` function. This allows you to build complex UIs by nesting components within each other.

### Example

```js
const nestedElement = LAR.createElement(
    "div",
    { id: "parent" },
    LAR.createElement(
        "div",
        { id: "child" },
        "This is a child element."
    )
);
```

**JSX Version:**

```jsx
const nestedElement = (
    <div id="parent">
        <div id="child">
            This is a child element.
        </div>
    </div>
);
```

In this example, a `div` with the ID of "child" is nested inside a `div` with the ID of "parent".

## Rendering the Elements

To render the elements to the DOM, use the `render` function. This function takes the virtual DOM element and the container where it should be rendered.

### Example

```js
LAR.render(
    LAR.createElement("div", null, "Hello, LAR!"),
    document.getElementById("root")
);
```

**JSX Version:**

```jsx
LAR.render(
    <div>Hello, LAR!</div>,
    document.getElementById("root")
);
```

## State Management with `useState`

The `useState` hook allows you to add state to your components. It returns the current state and a function to update it.

### Example

```js
function Counter() {
    const [count, setCount] = LAR.useState(0);

    return LAR.createElement(
        "div",
        null,
        LAR.createElement("p", null, `Count: ${count}`),
        LAR.createElement("button", { onClick: () => setCount(count + 1) }, "Increment")
    );
}

LAR.render(Counter, document.getElementById("root"));
```

**JSX Version:**

```jsx
function Counter() {
    const [count, setCount] = LAR.useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

LAR.render(<Counter />, document.getElementById("root"));
```

In this example, the `Counter` component manages its own state, incrementing the count each time the button is clicked.

## Conclusion

LAR is a powerful yet simple framework for building dynamic web applications. By leveraging a virtual DOM and a straightforward API, it enables developers to create efficient and maintainable code. For more details on how LAR works and the inspiration behind it, you can refer to [Build Your Own React](https://pomb.us/build-your-own-react/).
