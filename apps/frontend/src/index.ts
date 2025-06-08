import "./assets/app.css";

import { polyfill as sanitizer } from "@plurali/sanitizer";
import { createApp } from "vue";
import { RouterView } from "vue-router";

import { router } from "./router";

sanitizer(true);

createApp(RouterView).use(router).mount("#app");
