import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
// import { router } from "@/router";
import store from "@/store";
import TypeNav from "@/components/TypeNav";
import SliderLoop from "@/components/SliderLoop";
import Pagination from "@/components/Pagination";
import "@/mock/mockServer";
import * as API from "@/api";
import { MessageBox, Message } from "element-ui";

//声明使用或注册
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
//全局注册TypeNav公共组件
Vue.component("TypeNav", TypeNav);
Vue.component("SliderLoop", SliderLoop);
Vue.component("Pagination", Pagination);
Vue.config.productionTip = false;
new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this;

    Vue.prototype.$API = API; //它没法使用$on和$emit,只是为了让所有的组件能用API
  },
  router,
  // el: "#app",
  render: (h) => h(App),
  store,
}).$mount("#app");
