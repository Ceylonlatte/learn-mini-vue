import { h, ref } from "../../dist/learn-mini-vue.esm.js";
export const App = {
  name: "App",

  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };

    const props = ref({
      foo: "foo",
      bar: "bar",
    });

    const onChnagePropsDemo1 = () => {
      props.value.foo = "new-foo";
    };
    const onChnagePropsDemo2 = () => {
      props.value.foo = undefined;
    };
    const onChnagePropsDemo3 = () => {
      props.value = {
        foo: "foo",
      };
    };
    return {
      count,
      onClick,
      onChnagePropsDemo1,
      onChnagePropsDemo2,
      onChnagePropsDemo3,
      props,
    };
  },
  render() {
    return h(
      "div",
      {
        id: "root",
        ...this.props,
      },
      [
        h("div", {}, "count:" + this.count),
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
        h(
          "button",
          {
            onClick: this.onChnagePropsDemo1,
          },
          "changeProps -- 值改变了 -- 修改"
        ),
        h(
          "button",
          {
            onClick: this.onChnagePropsDemo2,
          },
          "changeProps -- 值变成undefined -- 修改"
        ),
        h(
          "button",
          {
            onClick: this.onChnagePropsDemo3,
          },
          "changeProps -- 值的属性减少了 -- 修改"
        ),
      ]
    );
  },
};
