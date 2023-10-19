import App from "./App";

// #ifndef VUE3
import Vue from "vue";
import request from "@/util/request/index";
import utils from "@/util/utils";

Vue.prototype.$request = request;
Vue.prototype.$ut = utils;
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
