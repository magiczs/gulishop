import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
// import { router } from "@/router";
import store from "@/store";
import TypeNav from "@/components/TypeNav";
import SliderLoop from "@/components/SliderLoop";
// import Pagination from "@/components/Pagination";
import "@/mock/mockServer";
import * as API from "@/api";
import './validate'
import { MessageBox, Message, Pagination,Button } from "element-ui";

import VueLazyload from 'vue-lazyload'
import loading from '@/assets/images/timg.gif'
// 在图片界面没有进入到可视范围前不加载, 在没有得到图片前先显示loading图片
Vue.use(VueLazyload, { // 内部自定义了一个指令lazy
  loading,  // 指定未加载得到图片之前的loading图片
})

//声明使用或注册
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.use(Pagination);
Vue.use(Button);
//全局注册TypeNav公共组件
Vue.component("TypeNav", TypeNav);
Vue.component("SliderLoop", SliderLoop);
// Vue.component("Pagination", Pagination);
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
