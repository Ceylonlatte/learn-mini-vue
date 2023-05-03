import { h, getCurrentInstance } from "../../dist/learn-mini-vue.esm.js";

export const Foo = {
  setup() {
    const instance = getCurrentInstance();
    console.log("App:", instance);
  },
  render() {
    const foo = h("p", {}, "foo");

    // 具名插槽
    // 1. 获取到要渲染的元素
    // 2. 获取到渲染的位置
    // 作用域插槽

    return h("div", {}, [foo]);
  },
};
