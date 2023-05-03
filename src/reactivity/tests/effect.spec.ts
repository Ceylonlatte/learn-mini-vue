import { effect, stop } from "../effect";
import { reactive } from "../reactive";
import {vi} from "vitest";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });

    let nextAge;

    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    // // update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner", () => {
    // 1. effect => return function(runner) => fn => reutrn 调用effect会返回内部_effect.run方法，_effect.run又会返回effect的返回值

    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  /**
   * 当响应式值发生改变，不是执行effect方法而是执行传入的scheduler
   */
  it("scheduler", () => {
    // 1. 通过effect的第二个参数给定一个scheduler的fn
    // 2. effect 第一次初始化的时候，还会执行fn
    // 3. 当响应式对象set 发生改变不会执行fn 而是执行scheduler
    // 4. 当执行runner的时候， 会再次执行fn

    let dummy;
    let run: any;
    const scheduler = vi.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled(); // 不会被调用
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1); // 这里验证当响应式值发生改变，不是执行effect方法而是执行传入的scheduler
    // // should not run yey
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });

  /**
   * 调用stop时，当响应式数据改变时不会执行effect
   */
  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  /**
   * 调用stop时，会执行onStop回调
   */
  it("onStop", () => {
    const obj = reactive({ foo: 1 });
    const onStop = vi.fn();
    let dummy;

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );
    stop(runner);

    expect(onStop).toBeCalledTimes(1);
  });
});
