import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  render() {
    return h("div", { id: "root", class: ["red", "hard"] }, [
      h("p", {
        class: "red"
      },`hi,${this.msg}`)
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
