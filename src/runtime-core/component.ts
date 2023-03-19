export function createComponentInstance(vnode) {
  const component = {
    vnode,
  };
  return component;
}

export function setupComponent(instance) {
  // initProps()
  // initSlots()

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.vnode.type;

  const { setup } = Component;

  if (setup) {
    // function
    const setupResult = setup();

    handleSetupResult(setupResult, instance);
  }
}

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupSatte = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
