import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  render() {
    window.self = this;
    return h("div", { id: "root", class: ["red", "hard"] }, [
      h("p", {
        class: "red"
      },`hi,${this.msg}`) // this => render.call(proxy) => proxy get(key)
      ,h("p", {
        class: "blue"
      },"hi")
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
