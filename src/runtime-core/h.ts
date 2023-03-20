import { createVnode } from "./vNode";

export function h(type, props?, children?) {
  return createVnode(type, props, children);
}
