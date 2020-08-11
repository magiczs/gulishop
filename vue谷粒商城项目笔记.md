# day01

## 01、脚手架创建项目

vue create 'xxx' vue 脚手架创建项目
选择 default 默认设置

## 02、认识项目目录及各个目录的作用

assets--公共静态文件夹
components--非路由组件(公共组件)
pages 或者 views--路由组件文件夹

## 03、vue 的 main.js 基本编码

组件三大步:定义 注册 使用

```js
import Vue from "vue";
import App from "@/App";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

## 04、eslint 错误级别禁用

创建 vue.config.js 配置文件,在里面设置

```js
module.exports = {
  lintOnSave: false,
};
```

## 05、jsconfig.json 配置别名@提示

创建 jsconfig.json 配置文件,在里面设置
用来简路径

```js
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
        "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

## 06、git 的基本操作

git init 创建本地仓库
创建远程仓库
关联本地与远程仓库
git remote add origin '远程仓库地址'
git push -u origin master 将本地仓库推送到远程仓库

## 07、观察页面确定页面主体框架

    所有的功能页面都是 上中下结构    上和下是不变化的，只有中间在变化

## 08、定义页面主体组件组装，切换路径可以组件跳转（非路由组件和路由组件）

Header 和 Footer 是固定的所以是非路由组件
Home Search Login Register 都是点击才会出现所以是路由组件并且是一级的（可能内部还有二级）
非路由组件组装
路由的注册使用
路由可以分模块去编写

## 09、把 Header 和 Footer 的模板进行替换显示

创建相应的组件文件夹拆分组件
在 components 文件夹中创建 footer 和 header 组件文件夹
将相应的 html 结构放入组件中
将相应的 css 或者 less 文件放入组件中
将图片文件(logo.png 和 wx_cz.jpg)放入组件文件夹下的 images 文件夹中
在 App.vue 文件中引入并注册组件
缺少 less-loader,npm i less-loader -D 下载包
初始化样式:将 reset.css 文件复制到与 index.html 同级的 css 文件夹内
在 index.html 中引入 reset.css

## 10、配置路由在对应点击切换路由组件的位置，替换路由链接

创建 pages 路由组件文件夹,在里面创建 Home,Login,Register,Search 路由组件
npm i vue-router -S 下载 router 插件包
在 router 文件夹下创建 routes.js,模块化方便管理

```js
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Search from "@/pages/Search";

export default [
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/search",
    component: Search,
  },
  {
    //重定向路由
    path: "/",
    redirect: "/home",
  },
];
```

在 router 文件夹下创建 index.js 配置文件

```js
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "@/router/routes";
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});

export default router;
```

在 main.js 中注入 router

```js
import Vue from "vue";
import App from "@/App";
import router from "@/router";
Vue.config.productionTip = false;

new Vue({
  router, //注入router,给Vue添加路由功能并且让每个组件内部都有两个对象可以拿到:$router $route
  render: (h) => h(App),
}).$mount("#app");
```

将结构内对应的 a 标签替换为<router-link></router-link>

```html
<router-link to="/login">登录</router-link>
<router-link class="register" to="/register">免费注册</router-link>
<router-link class="logo" title="尚品汇" to="/home">
  <img src="./images/logo.png" alt="" />
</router-link>
```

每个 router-link 标签都会创建一个组件对象,使用过多会消耗更多内存,编程式导航可以解决
编程式导航

```html
<button @click="toSearch">搜索</button>
```

```js
methods: {
    toSearch() {
      this.$router.push('/search')
    },
  },
```

## 11、登录注册不需要 Footer,通过路由 meta 配置解决

从 route 当中可以获取到 path 判断可以解决但是麻烦

```html
<footer v-if="$route.path !== '/login' && $route.path !== '/register'"></footer>
```

meta 配置
在路由配置对象中设置 meta 属性

```js
{
    path: "/login",
    component: Login,
    meta: {
      isHide:true  //要隐藏footer
    },
  },
  {
    path: "/register",
    component: Register,
    meta: {
      isHide:true //要隐藏footer
    },
  },
```

在标签中使用 meta 配置

```html
<footer v-if="!$route.meta.isHide"></footer>
```

## 12、路由传参相关

路径后拼接传参

```js
this.$router.push("/search?keyword=");
```

对象传参

```js
let location = {
  path: "/search",
};
this.$router.push(location);
```

传递 params 参数和 query 参数

params 参数需要在路由配置路径中接收

```js
{
    path: "/search/:keyword",
    component: Search,
},
```

指定 params 参数时不可以用 path 和 params 配置的组合,只能用 name 和 params 配置的组合

```js
let location = {
  // path: "/search",
  name: "search",
  params: {
    keyword: this.keyword,
  },
  query: {
    keyword: this.keyword.toUpperCase(),
  },
};
this.$router.push(location);

{
    path: "/search/:keyword",
    component: Search,
    name: "search",
  },
```

解决 params 中数据是一个"", 无法跳转，路径出错问题

```js
{
    path: "/search/:keyword?",//?代表这个params参数可传可不传
    component: Search,
    name: "search",
}

let location = {
        // path: "/search",
        name: "search",
        params: {
          keyword: this.keyword || undefined,
        },
        query: {
          keyword: this.keyword.toUpperCase(),
        },
      };
      this.$router.push(location);
```

路由组件传递 props 数据(简便使用)
1.
```js
props: true; //代表只是把params参数通过属性传递给相应的组件
```
2.
```js
props: {name: "jack";} //只能传递静态数据
```
3.
```js
{
    path: "/search/:keyword?",
    component: Search,
    name: "search",
    props(route){ //route收集好参数的路由对象
      //把传递过来的params参数和query参数一起映射为组件的属性
      return{keyword:route.params.keyword,keyword2:route.query.keyword}
    }
},
//接收使用
export default {
  name: "Search",
  props: ["keyword", "keyword2"],
};
```
