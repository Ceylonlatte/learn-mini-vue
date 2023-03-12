import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
import { hasChanged, isObject } from "./shared";

// ref 传过来如果是对象的话需要转成reative对象

// proxy 是针对对象进行代理，如果传入的是基本类型的话无法触发get，只能依赖于类里面value值来触发

class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  public __V_isRef = true;

  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {

    // 如果是对象的话转成proxy对象无法当作普通对象比较

    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}
export function ref(raw) {
  return new RefImpl(raw);
}

export function isRef(ref) {
    return !!ref.__V_isRef;
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}