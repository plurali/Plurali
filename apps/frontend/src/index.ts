import "./assets/app.css";

import { $api } from "@plurali/api-client";
import { polyfill as sanitizer } from "@plurali/sanitizer";
import { createApp } from "vue";
import { RouterView } from "vue-router";

import { baseURL } from "./api";
import { router } from "./router";

sanitizer(true);

// Ensure @plurali/api-client is using the same API base URL
$api.baseUrl = baseURL;

createApp(RouterView).use(router).mount("#app");
