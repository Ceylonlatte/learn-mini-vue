// 这个文件充当 vue 模块
export * from "@learn-mini-vue/runtime-dom";
import * as runtimeDom from "@learn-mini-vue/runtime-dom";
import { registerRuntimeCompiler } from "@learn-mini-vue/runtime-dom";

import { baseCompile } from "@learn-mini-vue/compiler-core";

export * from "@learn-mini-vue/runtime-dom";


function compileToFunction(template, options = {}) {
    const { code } = baseCompile(template, options);

    // 调用 compile 得到的代码在给封装到函数内，
    // 这里会依赖 runtimeDom 的一些函数，所以在这里通过参数的形式注入进去
    const render = new Function("Vue", code)(runtimeDom);

    return render;
}

registerRuntimeCompiler(compileToFunction);