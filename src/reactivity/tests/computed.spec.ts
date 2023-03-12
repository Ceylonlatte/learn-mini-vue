import { computed } from "../../computed";
import { reactive } from "../../reactive";

// computed的优势在于缓存，当依赖的响应式数据没有发生改变的话，二次调用computed不会触发计算方法,只有当响应式数据发生改变时，才会重新触发计算方法

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 1,
    });
    const age = computed(() => user.age);
    expect(age.value).toBe(1);
  });

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // // should not compute until needed   trigger -> effect -> get 重新执行了
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  });
});
