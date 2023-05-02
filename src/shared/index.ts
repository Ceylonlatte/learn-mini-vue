export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};
export const isString = (val) => typeof val === "string";

export const hasChanged = (newVal, val) => {
  return !Object.is(newVal, val);
};

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);

export const camlieze = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
