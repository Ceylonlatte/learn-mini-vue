import { createApp } from "../../dist/learn-mini-vue.esm.js";

import App from "./App.js";

console.log("App", App);

const rootContainer = document.getElementById("app");

createApp(App).mount(rootContainer);
