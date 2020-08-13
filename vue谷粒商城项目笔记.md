# day01

## 01、脚手架创建项目

vue create 'xxx' vue 脚手架创建项目
选择 default 默认设置

## 02、认识项目目录及各个目录的作用

assets--公共静态文件夹
components--非路由组件(公共组件)
pages 或者 views--路由组件文件夹
router--路由配置项

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

路由组件传递 props 数据(简便使用) 1.

```js
props: true; //代表只是把params参数通过属性传递给相应的组件
```

2.

```js
props: {
  name: "jack";
} //只能传递静态数据
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

# day02

## 13、先来搞 Home,Home 的子组件静态页面实现

拆分 Home 的所有组件,实现主页的静态展示
因为主页和搜索页都用到了 TypeNav 组件,所以将其放至 components 文件夹中,并且全局注册
在 main.js 中配置

```js
import TypeNav from "@/components/TypeNav";
Vue.component("TypeNav", TypeNav);
```

其他组件为 Home 组件下的子组件,放至 Home 文件夹中

## 14、postman 测试后台 api 接口，保存请求信息以便后期使用

![avatar][img01]
![avatar][img02]

## 15、前后台交互模块 ajax 模块，对 axios 的二次封装

在 src 下创建 ajax 文件夹,创建 Ajax.js 文件对 axios 二次封装

```js
// 1、配置基础路径和超时限制
import axios from "axios";
//创建一个新的axios实例
const instance = axios.create({
  baseURL: "/api", //配置请求基础路径
  timeout: 20000, //配置请求超时时间
});
// 2、添加进度条信息  nprogress
//npm install nprogress -S
import NProgress from "nprogress";
import "nprogress/nprogress.css";
//请求拦截器当中添加打开进度条的功能
instance.interceptors.request.use((config) => {
  //处理config (请求报文)
  //添加额外的功能（使用进度条）
  NProgress.start();
  return config; //返回这个config  请求继续发送  发送的报文信息就是新的config对象
});
// 3、返回的响应不再需要从data属性当中拿数据，而是响应就是我们要的数据
instance.interceptors.response.use(
  (response) => {
    //默认返回去的是response 也就是我们的响应报文信息  如果我们要拿到数据  response.data去获取
    //现在我们是在返回响应之前把响应直接改成了数据，以后我们拿数据不需要再去.data了
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();
    // 4、统一处理请求错误, 具体请求也可以选择处理或不处理
    alert("发送请求失败：" + error.message || "未知错误");
    //如果你需要进一步去处理这个错误，那么就返回一个失败的promise
    // return Promise.reject(new Error('请求失败')) //new Error('请求失败')自定义错误消息
    //如果你不需要再去处理这个错误，那么就返回一个pending状态的promise（终止promise链）
    return new Promise(() => {});
  }
);
export default instance; //暴露出去我们的axios工具  后面发请求使用
```

## 16、所有接口的请求函数模块，我们定义一个 index.js 去写

在 src 下创建 api 文件夹并且创建 index.js

```js
//这个文件是所有的接口请求函数的文件
//每一个请求接口数据功能都给它定义成一个函数，以后哪里需要去请求数据，就调用对应的这个接口请求函数就好了
import Ajax from "@/ajax/Ajax"; //引入二次封装后的axios

export const reqCategoryList = () => {
  return Ajax({
    url: "/product/getBaseCategoryList",
    method: "get",
  });
};
```

## 17、测试 ajax 请求机解决跨域问题

配置代理服务器解决跨域问题
在 vue.config.js 中配置

```js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://182.92.128.115/",
      },
    },
  },
};
```

## 18、可以拿到数据，但是我们得去管理我们的数据，使用 vuex

在 src 下创建 store 文件夹,创建 user.js,home.js 使用 vux 模块化管理数据.
每个 vuex 模块都能包含 state mutations actions getters
在 home 模块内部操作自己的数据

```js
import { reqCategoryList } from "@/api";

const state = {
  categoryList: [],
};
const mutations = {
  //直接修改数据  （不允许出现if  for  异步操作）
  RECEIVECATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList;
  },
};
const actions = {
  //异步请求获取数据  允许if  for  异步操作
  async getCategoryList({ commit }) {
    //
    // reqCategoryList().then(result => {
    //   commit('RECEIVECATEGORYLIST',result.data)
    // })

    const result = await reqCategoryList();
    if (result.code === 200) {
      commit("RECEIVECATEGORYLIST", result.data);
    }
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
```

将 vuex 模块合并至主 store

```js
import user from "./user";
import home from "./home";
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    user,
    home,
  }, //合并小的store到大的store身上
});
```

state 结构要注意
state:{
home:{
},
user:{
}
}
在组件中发送请求获取数据

```js
import { mapState, mapGetters } from "vuex";
export default {
  name: "TypeNav",
  mounted() {
    // this.$store.dispatch('getCategoryList')
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      this.$store.dispatch("getCategoryList");
    },
  },
  computed: {
    // ...mapState(['categoryList']) //错的  之前是对的
    // state.categoryList
    // state.home.categoryList
    ...mapState({
      categoryList: (state) => state.home.categoryList,
    }),
    // ...mapGetters(['categoryList1'])
  },
};
```

## 19、获取到数据后显示三级分类列表

在 TypeNav 组件中展示数据

```html
<div class="item" v-for="c1 in categoryList" :key="c1.categoryId">
  <h3>
    <a href="">{{c1.categoryName}}</a>
  </h3>
</div>

<dl class="fore" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
  <dt>
    <a href="">{{c2.categoryName}}</a>
  </dt>
</dl>

<em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
  <a href="">{{c3.categoryName}}</a>
</em>
```
