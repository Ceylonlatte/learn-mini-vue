import { render } from "./render";
import { createVnode } from "./vNode"

export function creatApp(rootComponent) {

    return {
        mount(rootContainer) {
             const vnode = createVnode(rootComponent);

             render(vnode, rootContainer);
        }
    }
}

