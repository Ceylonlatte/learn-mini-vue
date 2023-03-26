import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mounsedown");
        },
      },
      [
        h(
          "p",
          {
            class: "red",
          },
          `hi,${this.msg}`
        ), // this => render.call(proxy) => proxy get(key)
        h(
          "p",
          {
            class: "blue",
          },
          "hi"
        ),
        h(Foo, { count: 1 }),
      ]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
