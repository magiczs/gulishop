import Vue from "vue";
import VueRouter from "vue-router";
import routes from "@/router/routes";
import store from "@/store";

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
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  //to 代表目标(准备去的组件) 路由对象
  //from 代表起始(从哪个组件) 路由对象
  //next 放行还是不放行  是个函数
  //next() 放行
  //next(false) 不放行 停在当前位置
  //next('/')  代表跳到指定的路径对应的组件

  let targetPath = to.path;
  //订单交易页面trade  //支付相关 pay paysuccess  //用户中心 center  center/myorder  center/grouporder
  if (
    targetPath.startsWith("/trade") ||
    targetPath.startsWith("/pay") ||
    targetPath.startsWith("/center")
  ) {
    //代表你要去的地方需要判断用户是否登录
    if (store.state.user.userInfo.name) {
      next();
    } else {
      alert('请登录后再进行操作!')
      //未登录就跳到登录页
      next("/login?redirect=" + targetPath);
    }
  } else {
    //代表不需要用户登录的放行
    next();
  }
});

export default router;
// export const router = new VueRouter({
//   routes,
// });
