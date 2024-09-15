export class DOMutils {
    // Creates a new element, for example: ()
    static createElement(tag, attributes = {}, children =[]) {
        const element = document.createElement(tag);
    

        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        element.appendTo = function (parent) {
            parent.appendChild(element);
            return element;
        }

        return element;
    }


    static addAttributes(element, attributes) {
        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }
    
    static nestElements(parent, children) {
        children.forEach(child => {
            parent.appendChild(child);
        });
    }
}