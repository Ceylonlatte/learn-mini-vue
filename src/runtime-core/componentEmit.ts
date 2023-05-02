import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
  console.log("emit", event);
  const { props } = instance;

  // add -> Add
  // add-foo -> addFoo

  const handlerName = toHandlerKey(camelize(event));

  const handler = props[handlerName];

  handler && handler(...args);
}
