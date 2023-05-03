// 这个文件充当 vue 模块
export * from "../src/reactivity";
import * as runtimeDom from "../src/runtime-dom";
import { registerRuntimeCompiler } from "../src/runtime-dom";

import { baseCompile } from "../src/compiler-core/src";

export * from "../src/runtime-dom";


function compileToFunction(template, options = {}) {
    const { code } = baseCompile(template, options);

    // 调用 compile 得到的代码在给封装到函数内，
    // 这里会依赖 runtimeDom 的一些函数，所以在这里通过参数的形式注入进去
    const render = new Function("Vue", code)(runtimeDom);

    return render;
}

registerRuntimeCompiler(compileToFunction);