# 🏗️ SmollFramework 🏗️
#### 📖 *This repository contains the mini-framework project.*
<div style="display: flex; justify-content: center;">

[Overview](#overview) •
[Auditing](#auditing) •
[How To Use](#how-to-setup-a-new-project) •
[Features](#features) •
[Credits](#credits)
</div>

## Overview
Smollframework, as the name implies, is a small and lightweight native Javascript framework made to help streamline the development of interactive web applications. It uses a component based architecture, allowing you to build modular UI components that manage their own state and rendering.
<br><br>
Instead of relying on a virtual DOM, Smollframework utilizes a direct data-binding approach with element IDs.
This means that changes in component state are reflected in the actual DOM through direct updates.
This approach eliminates the need for a virtual DOM layer, ensuring efficient and direct manipulation of DOM components.
<br>

### Main Components
- **[DOMutils](#domutils)**
    - `DOMutils` provides a set of methods for efficient DOM handling and manipulation.
- **[State Manager](#state-manager)**
    - `stateManager` provides a way of managing and tracking changes to application state.
- **[Router](#routing)**
    - `router` provides URL routing and navigation between different views and components in the app.
- **[Event Handler](#event-handler)**
    - `eventHandler` simplifies the process of adding, removing, and managing event listeners on DOM elements.




## Auditing
>#### 1) Clone the repo:
>```bash
>git clone https://01.kood.tech/git/claks/mini-framework
>```
>#### 2) Navigate to the TodoMVC project:
>```bash
>cd mini-framework/example/todoMVC/
>```
>#### 3) Start the `index.html` with a live server:
>>You can use the `live-server` npm package, which works across different platforms.<br>
>>**Start the live server:**
>>```bash
>>live-server --port=8080 --mount=/src:../../src/
>>```
>
><br>
>
>If you don't have `live-server` installed, you can install it globally using npm:
>>```bash
>>npm install -g live-server
>>```
><div style="display: flex; justify-content: right; align-items: center;"><a href="https://github.com/01-edu/public/blob/master/subjects/mini-framework/audit/README.md#functional" style="margin-bottom: 10px; font-weight: 700;">📋 Auditing readme</a></div>
>

## How to setup a new project:
*Setting up your project with* **Smollframework** *is easy as 1-2-3-(4).*
>
><br>
>
>**1) Create a new directory for your project:**
>>```bash
>># In `~./mini-framework/example/`
>>mkdir newProject && cd newProject
>>```
><br>
>
>**2) Create files for the project:**
>>```bash
>># Create index.html, script.js, styles.css
>>touch index.html, script.js, styles.css
>>```
><br>
>
>**3) Import the framework to your project:**
>>`~./mini-framework/example/newProject/script.js:`
>>```javascript
>>import SmollFramework from '../../src/main.js'
>>const framework = new SmollFramework();
>>```
><br>
>
>**4) Include the javascript module in the html file:**
>>`~./mini-framework/example/newProject/index.html:`
>>```html
>><script type="module" src="script.js"></script>
>>```
><br>
>

## Features

### DOMutils
The `DOMutils` provides a set of methods for efficient DOM handling and manipulation. With functions such as `createElement()`, you can create new elements with specific attributes, append child elements, and insert content directly.
#### Creating a new element
You can create new elements using `framework.DOMutils.createElement()`<br>
createElement() takes a `tag`, multiple `attributes` and an array of `children` that you want to append to the element.
#### Basic Usage
**1. Creating a simple new element:**<br>

```javascript
framework.DOMutils.createElement(tag);

// Example
const parentDiv = framework.DOMutils.createElement('div');
```
**2. Creating a new element and appending it to a parent:**<br>
```javascript
framework.DOMutils.createElement(tag).appendTo(element);

// Example
const childDiv = framework.DOMutils.createElement('div').appendTo(parentDiv);
```

**3. Creating an element with attributes:**<br>

Adding attributes is simple and its possible to add as many attributes as you want!<br>
`createElement()` takes attributes as a second parameter (takes an object)
```javascript
framework.DOMutils.createElement(tag, {id: 'elementID', class: 'elementClass'});
```
**4. Appending children immediately after creation :**<br>

If you already have the child elements created, you can append them directly in `createElement()` as a third parameter (takes an array of elements)
```javascript
const child1 = framework.DOMutils.createElement('div');
const child2 = framework.DOMutils.createElement('div');

framework.DOMutils.createElement('div', {}, [child1, child2]);
```
**5. Adding a text value to the element:**<br>

If you want to add a `text value` to the element, you can put it in the third parameter as a string value.
```javascript
framework.DOMutils.createElement(tag, {}, ["text value"]);
```
---
### State Manager
The `stateManager` allows you to manage and track changes to application state.<br>
You can set, get, and subscribe to state changes using this feature.

#### Basic Usage
**1. Create and Update State:**<br>
You can create a new state by providing a key and an initial value. To update the state, simply
call `setState` with the same key and the new value.
```javascript
// Create a new state 'counter' with initial value of 0
framework.stateManager.setState("counter", 0);

// Get the current state value of 'counter'
let counter = framework.stateManager.getState("counter");

// Increment the counter
counter += 1;

// Update the state with a new value
framework.stateManager.setState("counter", counter);
```
**2.Subscribe to State Changes:**<br>
If you want to be notified whenever a particular state changes, you can subscribe to it.<br>
This is useful for triggering functions or updates in your application when a state value is modified.
```javascript
// Subscribe to changes to the 'counter' state
framework.stateManager.subscribe("counter", (counterValue) => {
    console.log(`Counter value updated: ${counterValue}`);
});
```
Whenever the state of `'counter'` is updated, the subscribed callback will be triggered, logging the new value to the console.
#### Example Statemanager Setup for a project:
1. **Initialize a state** when your application starts or at a relevant point in your app.
2. **Update the state** as your app logic requires.
3. **Subscribe to the state** to react to changes, such as updating the UI or triggering other functions.

With `stateManager`, your app can manage and respond to state changes, making it dynamic and reactive to user interaction or other events.

---
### Routing
The `Router` enables navigation between different views and components in the app, based on the **URL's hash fragment**.<br>
It supports static and dynamic routes, and automatically handles routing when the hash fragment changes.
#### Basic Usage
**1. Define Routes:**<br>
The `Router` expects an array of route objects, where each route has a `path` and `handler` function, which is executed when the route is loaded. 
```javascript
// Define the routes
const routes = [
    { path: '/', handler: showHomePage },
    { path: '/about', handler: showAboutPage },
    { path: '/contact', handler: showContactPage },
    { path: '/404', handler: show404Page },
];
```
**2. Initialize the router:**<br>
When the `Router` is initialized with an array of route objects `routes`, it loads the initial route based on the current URL hash fragment.
```javascript
// Initialize the router with `setupRouter` 
framework.setupRouter(routes);
```
**3. Navigating between routes:**<br>
Use `navigate` method to update the URL hash fragment and automatically execute it's handler.
```javascript
// Navigate to the 'about' page
framework.router.navigate('/about');
```
**4. Handling undefined routes:**<br>
When user tries to navigate to an undefined route, the router defaults to the `/404` route, and loads the 404 handler.
```javascript
framework.router.navigate('/example-undefined-route');
// Which routes to `/404` and loads the 404 handler
```
#### Example Router Setup for a project:
1. **Define the routes** when setting up the router for your app.
2. **Initialize the router** to load the inital route and start listening for hash changes.
3. **Use the** `navigate` **method** to change routes as needed in your app.
4. **Provide a 404 route** or another fallback route to handle undefined routes.

With `Router` you can manage your app's navigation, ensuring users can switch between different views and components seamlessly.

---
### Event Handler

The `eventHandler`  is designed to simplify the process of adding, removing, and managing event listeners on DOM elements.

#### Basic Usage
**1. Add an Event:**<br>


To attach an event listener to a DOM element, use the `addEvent` method. This method takes three parameters:
- `element`: The ID of the DOM element.
- `eventType`: The type of event (e.g., "click", "mouseover").
- `callback`: The function to be executed when the event is triggered.

```javascript
// Add a click event to a button with the ID 'myButton'
framework.eventHandler.addEvent("myButton", "click", () => {
    console.log("Button clicked!");
});
```
<br>

**2. Remove an Event:**<br>
If you need to remove an event listener, use the `removeEvent` method. This method requires the same parameters used to add the event.
```javascript
// Define the callback function to ensure it matches the one used when adding the event
const handleClick = () => {
    console.log("Button clicked!");
};

// Add an event listener
framework.eventHandler.addEvent("myButton", "click", handleClick);

// Remove the click event from the button with the ID 'myButton'
framework.eventHandler.removeEvent("myButton", "click", handleClick);
```

**3. Clear all Event:**<br>
To remove all event listeners of a specific type from an element, use the `clearEvents` method.
```javascript
// Clear all click events from the button with the ID 'myButton'
framework.eventHandler.clearEvents("myButton", "click");
```

## Credits
**[Marcus Kangur (mkangur)](https://01.kood.tech/git/mkangur)**<br>
**[Chris Laks (claks)](https://01.kood.tech/git/claks)**<br>
**[Kaarup Vares (kvares)](https://01.kood.tech/git/kvares)**
