import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
// import { router } from "@/router";
import store from "@/store";
import TypeNav from "@/components/TypeNav";
import SliderLoop from "@/components/SliderLoop";
import "@/api";
import "@/mock/mockServer";

//全局注册TypeNav公共组件
Vue.component("TypeNav", TypeNav);
Vue.component("SliderLoop", SliderLoop);
Vue.config.productionTip = false;
new Vue({
  router,
  // el: "#app",
  render: (h) => h(App),
  store,
}).$mount("#app");
