import Vue from "vue";
import VueRouter from "vue-router";
import routes from "@/router/routes";

Vue.use(VueRouter);
//解决多次触发编程式导航报错的问题
const originPush = VueRouter.prototype.push; //保存原来的push函数 ，后面修改之后可以找到原来的
const originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function(location, onResolved, onRejected) {
  if (onResolved === undefined && onRejected === undefined) {
    return originPush.call(this, location).catch(() => {});
  } else {
    return originPush.call(this, location, onResolved, onRejected);
  }
};

VueRouter.prototype.replace = function(location, onResolved, onRejected) {
  if (onResolved === undefined && onRejected === undefined) {
    return originReplace.call(this, location).catch(() => {});
  } else {
    return originReplace.call(this, location, onResolved, onRejected);
  }
};
const router = new VueRouter({
  routes,
});
export default router;
// export const router = new VueRouter({
//   routes,
// });
