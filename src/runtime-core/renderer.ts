import { effect } from "../reactivity/effect";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;

  function render(vnode, container) {
    patch(null, vnode, container);
  }
  // n1 -> 旧节点
  // n2 -> 新节点
  function patch(n1, n2, container, parentComponent = null) {
    const { type, shapeFlag } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processElement(n1: any, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  const EMPTY_OBJ = {};

  function patchElement(n1, n2, container) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);

    patchProps(el, oldProps, newProps);
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          patchProp(el, key, prevProp, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            patchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }
  function processComponent(n1: any, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function processFragment(n1: any, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processText(n1: any, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function mountElement(vnode, container, parentComponent) {
    const el = (vnode.el = createElement(vnode.type));

    const { shapeFlag, children } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      // // on + Event name
      // const isOn = (key: string) => /^on[A-Z]/.test(key);

      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase();
      //   el.addEventListener(event, val);
      // } else {
      //   el.setAttribute(key, val);
      // }
      patchProp(el, key, null, val);
    }
    insert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function mountComponent(initialVNode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance: any, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");

        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy)); // subTree = app.js h函数

        patch(null, subTree, container, instance);

        initialVNode.el = subTree.el;

        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;

        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
