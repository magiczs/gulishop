import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
// import { router } from "@/router";
import store from "@/store";
import TypeNav from "@/components/TypeNav";
import SliderLoop from "@/components/SliderLoop";
import Pagination from "@/components/Pagination";
import "@/api";
import "@/mock/mockServer";

//全局注册TypeNav公共组件
Vue.component("TypeNav", TypeNav);
Vue.component("SliderLoop", SliderLoop);
Vue.component("Pagination", Pagination);
Vue.config.productionTip = false;
new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  router,
  // el: "#app",
  render: (h) => h(App),
  store,
}).$mount("#app");
