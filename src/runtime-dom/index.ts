import { createRenderer } from "../runtime-core";

function createElement(type) {
  return document.createElement(type);
}
// 1. 属性值不一样更新值
// 2. 值为undefined 删除key
// 3. 新增或者删除属性
function patchProp(el, key, prevVal, nextVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);

  console.log(nextVal);

  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

function insert(el, parent) {
  parent.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";
