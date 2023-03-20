export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type
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

    handleSetupResult(instance ,setupResult);
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
  instance.render = Component.render;
}
