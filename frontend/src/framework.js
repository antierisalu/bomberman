function createElement(type, props, ...children) {
    //flattening the children due to how jsx converts children
    const flattenedChildren = children.flat().reduce((acc, child) => {
        if (Array.isArray(child)) {
            return [...acc, ...flattenChildren(child)];
        }
        return [...acc, child];
    }, []);

    //validate children
    flattenedChildren.forEach(child=>{

        if (child && !child.type && typeof child === 'object'){
            const propsString = Object.entries(props).map(([key, value]) => {
                return `${key}="${value}"`;
            }).join(' '); // Join them with spaces between each pair
            let errormessage=(`<${type} ${propsString} >${children}</${type}>`)
            console.error(flattenedChildren)
            throw new Error("Te ei tohi panna objecteid JSXi sisse textina! "+errormessage+" object on konsoolis ka");
        }
    })

    return {
        type,
        props: {
            ...props,
            children: flattenedChildren.map(child =>
                typeof child === "object"
                    ? child
                    : createTextElement(child)
            ),
        },
    }
}
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}
function createDom(fiber) {
    const dom =
        fiber.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type)
    updateDom(dom, {}, fiber.props || {})
    return dom
}
const isEvent = key => key.startsWith("on")
const isProperty = key =>
    key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
    prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
    //Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            key =>
                !(key in nextProps) ||
                isNew(prevProps, nextProps)(key)
        )
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.removeEventListener(
                eventType,
                prevProps[name]
            )
        })
    // Remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
            if (name === "class") {
                dom.removeAttribute("class")
            } else if (name in dom) {
                dom[name] = ""
            } else {
                dom.removeAttribute(name)
            }
        })
    // Set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            if (name === "class") {
                dom.className = nextProps[name]
            } else if (name in dom) {
                dom[name] = nextProps[name]
                if (name === "style" && typeof nextProps[name] === "object") {
                    let keys = Object.keys(nextProps[name])
                    dom.style[keys[0]] = nextProps[name][keys[0]]
                }
            } else {
                dom.setAttribute(name, nextProps[name])
            }
        })
    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.addEventListener(
                eventType,
                nextProps[name]
            )
        })
}
function commitRoot() {
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}
function commitWork(fiber) {
    if (!fiber) {
        return
    }
    let domParentFiber = fiber.parent
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent
    }
    const domParent = domParentFiber.dom
    //the effect tags are added in the diffing algorithm
    if (fiber.effectTag === "PLACEMENT") {
        if (fiber.dom != null) {
          domParent.appendChild(fiber.dom)
        }
        runEffects(fiber)
        
      } else if (fiber.effectTag === "UPDATE") {
        cancelEffects(fiber)
        if (fiber.dom != null) {
          updateDom(
    if (fiber.effectTag === "PLACEMENT") {
        if (fiber.dom != null) {
          domParent.appendChild(fiber.dom)
        }
        runEffects(fiber)
        
      } else if (fiber.effectTag === "UPDATE") {
        cancelEffects(fiber)
        if (fiber.dom != null) {
          updateDom(
            fiber.dom,
            fiber.alternate.props,
            fiber.props
          )
        }
        runEffects(fiber)
          )
        }
        runEffects(fiber)
    } else if (fiber.effectTag === "DELETION") {
        cancelEffects(fiber)
        cancelEffects(fiber)
        commitDeletion(fiber, domParent)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}
function commitDeletion(fiber, domParent) {
    fiber.effectTag = ""
    if (fiber.dom) {
        domParent.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child, domParent)
    }
}
function render(element, container) {
    if (typeof element === "function") {
        element = element()
    }
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    }
    deletions = []
    nextUnitOfWork = wipRoot
}
let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null
function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    //requestIdleCallback is a javascript api function that allows you to schedule a function to be called on the next available idle time.
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)
function performUnitOfWork(fiber) {
    const isFunctionComponent =
        fiber.type instanceof Function
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}
let wipFiber = null
let hookIndex = null
function updateFunctionComponent(fiber) {
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks = []
    const children = [fiber.type(fiber.props)]
    reconcileChildren(fiber, children)
}
function useState(initial) {
    const oldHook =
        wipFiber.alternate &&
        wipFiber.alternate.hooks &&
        wipFiber.alternate.hooks[hookIndex]
    const hook = {
        state: oldHook ? oldHook.state : initial,
        queue: [],
    }
    const actions = oldHook ? oldHook.queue : []
    actions.forEach(action => {
        hook.state = action(hook.state)
    })
    const setState = (action) => {
        const newState = typeof action === 'function' ? action(hook.state) : action // able to add non functions to state
        hook.queue.push(() => newState) //instead of push added new state
        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
        }
        nextUnitOfWork = wipRoot
        deletions = []
    }
    wipFiber.hooks.push(hook)
    hookIndex++
    return [hook.state, setState]
}
function cancelEffects(fiber) {
    if (fiber.hooks) {
      fiber.hooks
        .filter(
          hook => hook.tag === "effect" && hook.cancel
        )
        .forEach(effectHook => {
          effectHook.cancel()
        })
    }
  }
function runEffects(fiber) {
if (fiber.hooks) {
    fiber.hooks
    .filter(
        hook => hook.tag === "effect" && hook.effect
    )
    .forEach(effectHook => {
        effectHook.cancel = effectHook.effect()
    })
}
}
const hasDepsChanged = (prevDeps, nextDeps) =>
    !prevDeps ||
    !nextDeps ||
    prevDeps.length !== nextDeps.length ||
    prevDeps.some(
        (dep, index) => dep !== nextDeps[index]
    )
function useEffect(effect, deps) {
    if (deps){//create deep copy of deps so when state is changed it doesn't change dependencies
    deps = JSON.parse(JSON.stringify(deps));
    }
    const oldHook =
        wipFiber.alternate &&
        wipFiber.alternate.hooks &&
        wipFiber.alternate.hooks[hookIndex]
    const hasChanged = hasDepsChanged(
        oldHook ? oldHook.deps : undefined,
        deps
    )
    const hook = {
        tag: "effect",
        effect: hasChanged ? effect : null,
        cancel: hasChanged && oldHook && oldHook.cancel,
        deps,
    }
    wipFiber.hooks.push(hook)
    hookIndex++
}
function cancelEffects(fiber) {
    if (fiber.hooks) {
      fiber.hooks
        .filter(
          hook => hook.tag === "effect" && hook.cancel
        )
        .forEach(effectHook => {
          effectHook.cancel()
        })
    }
  }
function runEffects(fiber) {
if (fiber.hooks) {
    fiber.hooks
    .filter(
        hook => hook.tag === "effect" && hook.effect
    )
    .forEach(effectHook => {
        effectHook.cancel = effectHook.effect()
    })
}
}
const hasDepsChanged = (prevDeps, nextDeps) =>
    !prevDeps ||
    !nextDeps ||
    prevDeps.length !== nextDeps.length ||
    prevDeps.some(
        (dep, index) => dep !== nextDeps[index]
    )
function useEffect(effect, deps) {
    if (deps){//create deep copy of deps so when state is changed it doesn't change dependencies
    deps = JSON.parse(JSON.stringify(deps));
    }
    const oldHook =
        wipFiber.alternate &&
        wipFiber.alternate.hooks &&
        wipFiber.alternate.hooks[hookIndex]
    const hasChanged = hasDepsChanged(
        oldHook ? oldHook.deps : undefined,
        deps
    )
    const hook = {
        tag: "effect",
        effect: hasChanged ? effect : null,
        cancel: hasChanged && oldHook && oldHook.cancel,
        deps,
    }
    wipFiber.hooks.push(hook)
    hookIndex++
}
function updateHostComponent(fiber) {
    if (fiber.props === undefined){
    }
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    reconcileChildren(fiber, fiber.props.children)
}
//diffing algorithm, checks differences between old dom fiber tree and the new one
function reconcileChildren(wipFiber, elements) {
    let index = 0
    let oldFiber =
        wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null
    while (
        index < elements.length ||
        oldFiber != null
    ) {
        const element = elements[index]
        let newFiber = null
        //are the types (tags) the same
        const sameType =
            oldFiber &&
            element &&
            element.type == oldFiber.type
        //if they are the same type, only change props
        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE",
            }
        }
        //if the types are different and there is an element (new dom), we need to add a new fiber
        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT",
            }
        }
        //if the types are different and there is an old fiber, we need to delete the old one
        if (oldFiber && !sameType) {
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }
        if (index === 0) {
            wipFiber.child = newFiber
        } else if (element) {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
}
// Routing
function Router(props) {
    const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || "/");
    const handleHashChange = () => {
        setCurrentPath(c => c = window.location.hash.slice(1) || "/");
        window.removeEventListener("hashchange", handleHashChange);
    };
    window.addEventListener("hashchange", handleHashChange);
    const route = props.routes.find(route => route.path === currentPath);
    return route ? <div>{route.component.type(route.prop ? route.prop || {} : {})}</div> : "Not Found";
}
export const LAR = {
    createElement,
    render,
    useState,
    useEffect,
    Router,
}