import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";
import { proxyRefs } from "../reactivity/ref";

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    slots: {},
    emit: () => {},
  };

  console.log(component);

  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.vnode.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    setCurrentInstance(instance);
    // function
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });

    currentInstance = null;

    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  instance.render = Component.render;
}

let currentInstance: any = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}
