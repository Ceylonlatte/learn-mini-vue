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

function handleSetupResult(instance, setupResult) {
  // setup 返回值不一样的话，会有不同的处理
  // 1. 看看 setupResult 是个什么
  if (typeof setupResult === "function") {
    // 如果返回的是 function 的话，那么绑定到 render 上
    // 认为是 render 逻辑
    // setup(){ return ()=>(h("div")) }
    instance.render = setupResult;
  } else if (typeof setupResult === "object") {
    // 返回的是一个对象的话
    // 先存到 setupState 上
    // 先使用 @vue/reactivity 里面的 proxyRefs
    // 后面我们自己构建
    // proxyRefs 的作用就是把 setupResult 对象做一层代理
    // 方便用户直接访问 ref 类型的值
    // 比如 setupResult 里面有个 count 是个 ref 类型的对象，用户使用的时候就可以直接使用 count 了，而不需要在 count.value
    // 这里也就是官网里面说到的自动结构 Ref 类型
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  // 给 instance 设置 render

  // 先取到用户设置的 component options
  const Component = instance.type;

  if (!instance.render) {
    // 如果 compile 有值 并且当组件没有 render 函数，那么就需要把 template 编译成 render 函数
    if (compile && !Component.render) {
      if (Component.template) {
        // 这里就是 runtime 模块和 compile 模块结合点
        const template = Component.template;
        Component.render = compile(template);
      }
    }

    instance.render = Component.render;
  }

  // applyOptions()
}

let currentInstance: any = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}

let compile;
export function registerRuntimeCompiler(_compile) {
  compile = _compile;
}
