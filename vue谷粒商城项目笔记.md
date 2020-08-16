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

```js
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
```

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

### 解决多次触发编程式导航 报错的问题

```js
const originPush = VueRouter.prototype.push; //保存原来的push函数 ，后面修改之后可以找到原来的
const originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function(location, onResolved, onRejected) {
  //调用push根本没有处理promise的回调，无论成功和失败
  if (onResolved === undefined && onRejected === undefined) {
    return originPush.call(this, location).catch(() => {});
  } else {
    //代表调用push的时候，传了处理promise的回调
    return originPush.call(this, location, onResolved, onRejected);
  }
};

VueRouter.prototype.replace = function(location, onResolved, onRejected) {
  //调用push根本没有处理promise的回调，无论成功和失败
  if (onResolved === undefined && onRejected === undefined) {
    return originReplace.call(this, location).catch(() => {});
  } else {
    //代表调用push的时候，传了处理promise的回调
    return originReplace.call(this, location, onResolved, onRejected);
  }
};
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

## 20、事件控制 23 级的显示和隐藏

将 css 控制显示隐藏改为事件控制
修改 css 类名

```css
&.item_on {
  background-color: skyblue;
  .item-list {
    display: block;
  }
}
```

添加移入和移出事件,移出事件我们需要添加在外部一个 div 上

```html
<div @mouseleave="currentIndex=-1 ">
  <h2 class="all">全部商品分类</h2>
  <div
    @mouseenter="moveIn(index)"
    :class="{item_on:currentIndex === index}"
  ></div>
</div>
```

定义鼠标移入方法

```js
data() {
    return {
      currentIndex: -1, //当前移入项的下标  初始值 -1  移入某一项，就把这个值改为移入的这项的下标
    };
  },
moveIn(index) {
    //移入某一项 就把currentIndex的值改为移入这个项的下标
    //而我们在项上添加的item_on这个类就会生效
    this.currentIndex = index;
     },
```

## 21、演示快速触发事件卡顿现象

鼠标快速移动会发生卡顿现象

## 22、函数的防抖和节流讲解

100 秒触发 100 次
正常：事件触发非常频繁，而且每一次的触发，回调函数都要去执行
节流：在规定的间隔时间范围内不会重复触发回调，只有大于这个时间间隔才会触发回调，把频繁触发变为少量触发
防抖：前面的所有的触发都被取消，最后一次执行在规定的时间之后才会，也就是说如果连续快速的触发 只会执行一次

## 23、24 优化快速触发 typeNav 鼠标移入和移出事件，节流 lodash 的 throttle 节流操作、按需引入 lodash 减少打包体积

```js
import {throttle} from "lodash";
moveIn: throttle(
      function (index) {
        //throttle是一个函数，内部需要传递一个回调函数，最后会返回一个新的函数
        this.currentIndex = index;
      },
      30,
      { trailing: false }
    ), //在刚触发就执行
```

## 25、解决使用 lodash 节流后，快速移出后，可能还会显示某个子项

```js
{
  trailing: fasle;
} //的作用    是否在结束延迟之后调用
```

## 26、点击某个类别（无论几级）跳转到搜索页面

先用声明式导航替换原来的 a
需要把类别的 id 和类别的名字通过 query 参数传递
此方法会造成卡顿

```html
<router-link
  :to="{name:'search',query:{categoryName:c2.categoryName,category2Id:c2.categoryId}}"
  >{{c2.categoryName}}</router-link
>
```

## 27、使用编程式路由导航优化声明式导航组件对象过多造成的卡顿

声明式导航本质上是组件对象，组件对象过多，会造成效率很慢 所以会很卡

## 28、29 利用事件委派提高处理事件的效率、利用自定义属性携带动态数据

每个项都添加事件，事件的回调函数很多，效率也不好
在共同的父级元素添加事件监听

```html
<div class="container" @click="toSearch"></div>
```

问题：怎么知道点击的是不是 a 标签
问题：怎么知道点击的是一级还是二级还是三级
问题：参数怎么携带，要携带携带哪些个的参数
通过设置自定义属性

```html
<a
  href="javascript:;"
  :data-categoryName="c1.categoryName"
  :data-category1Id="c1.categoryId"
  >{{c1.categoryName}}</a
>
```

定义点击事件回调

```js
    //点击类别事件回调
    toSearch(event) {
      //event 就是我们的事件对象
      let target = event.target //就是我们的目标元素（真正发生事件的儿子元素）
      let data = target.dataset //拿到目标元素身上所有的自定义属性组成的对象
      // 什么时候点的就是a标签  data当中存在categoryname那么就是点击的a标签
      let {categoryname,category1id,category2id,category3id} = data

      if(categoryname){
        //点击的就是a标签
        let location = {
          name:'search'
        }
        let query = {
          categoryName:categoryname
        }
        if(category1id){
          query.category1Id = category1id
        }else if(category2id){
          query.category2Id = category2id
        }else{
          query.category3Id = category3id
        }
        //到了这query参数就收集ok
        location.query = query

        //点击类别的时候带的是query参数，我们得去看看原来有没有params参数，有的话也得带上
        if(this.$route.params){
          location.params = this.$route.params
        }

        this.$router.push(location)
      }//else{
      //   //点击不是a标签，不关心
      // }
    },
```

## 30、搜索页的 typeNav 一级列表隐藏

首先这个组件被多个页面公用
在 mounted 的时候可以判断路由是不是 home 如果不是把 isShow 改为 false, 只是初始显示组件的时候隐藏一级分类

```html
<div class="sort" v-show="isShow"></div>
```

```js
mounted() {
    if(this.$route.path !== '/home'){
      this.isShow = false
    }
  },
```

## 31、显示和隐藏一级列表的过渡效果添加

首先谁要加过渡就看谁在隐藏和显示
需要放在 transition 标签内部，name 需要起名字

<transition name="show"> 
<div class="sort" v-show="isShow"></div>
</transition>
设置鼠标移入移出事件
<div @mouseleave="moveOutDiv" @mouseenter="moveInDiv">
设置鼠标移入移出函数

```js
moveInDiv() {
    this.isShow = true;
  },
  moveOutDiv() {
    this.currentIndex = -1;
    if (this.$route.path !== "/home") {
      this.isShow = false;
    }
  },
```

设置 CSS

```css
&.show-enter {
  opacity: 0;
  height: 0;
}
&.show-enter-to {
  opacity: 1;
  height: 461px;
}
&.show-enter-active {
  transition: all 0.5s;
}
```

## 32、优化 typeNav 数据 ajax 请求次数，改变请求的位置

之前我们是在 typeNav 组件内部 dispatch 去发送 ajax 请求，这样的话
因为 typeNav 是被多个页面公用的，所以每次切换到一个页面，这个组件都会重新创建 mounted 都会执行
因此有几个页面公用了这个 typeNav 就会执行几次 ajax 请求
所以我们放到 App 里面就只用执行一次，因为数据一样，没必要多次请求

```js
import { mapActions } from "vuex";
mounted() {
    this.getCategoryList();
  },
methods: {
    ...mapActions(["getCategoryList"]),
  },
```

## 33、合并分类的 query 参数和搜索关键字的 params 参数

点击类别选项的时候，去看看有没有 params 参数
见 28、29 步
点击 search 按钮的时候，去看看有没有 query 参数(在 Header 中设置)

```js
toSearch() {
  let location = {
    name: "search",
    params: {
      keyword: this.keyword || undefined,
    },
  };
  if (this.$route.query) {
    location.query = this.$route.query;
  }
  this.$router.push(location);
},
```

注意：我们点击搜索的时候关键字使用的是 params 参数
点击类别选项的时候我们的参数使用的是 query 参数

## 34、设计 json 数据的结构和值

创建 mock 文件夹,模拟本地数据,创建 banner.json floor.json

## 35、使用 mockjs 来模拟数据接口

mock 会拦截我们的 ajax 请求，不会真正去发送请求。
安装
npm i mockjs -S
创建 mockServer.js 文件(相当于后台服务)

```js
import mock from "mockjs";
import banner from "./banner.json";
import floor from "@/mock/floor";

mock.mock("/mock/banner", { code: 200, data: banner });
mock.mock("/mock/floor", { code: 200, data: floor });
//这个方法就是用来让我们模拟接口使用的
//第一个参数是模拟的接口路径
//第二个参数是返回的数据
```

在 main.js 中引入 mock 服务

```js
import "@/mock/mockServer";
```

封装 mockAjax
在 ajax 文件夹中创建 mockAjax.js 文件
只需要将 baseURL 改为/moke,其他配置一样

```js
const instance = axios.create({
  baseURL: "/mock", //配置请求基础路径
  timeout: 20000, //配置请求超时时间
});
```

## 36、mock 数据的随机语法

看文档
http://mockjs.com/examples.html

## 37、mock 数据的 vuex 编码

在 api 中添加 mock 接口的请求函数,请求模拟的 bannerList 和 floorList 数据

```js
import mockAjax from "@/ajax/mockAjax";
//请求banner和floor  mock的接口请求函数
export const reqBannerList = () => {
  return mockAjax({
    url: "/banner",
    method: "get",
  });
};
export const reqFloorList = () => {
  return mockAjax({
    url: "/floor",
    method: "get",
  });
};
```

在 store 中的 home.js 中创建 bannerList 和 floorList 数据以及发送请求的函数

```js
//引入请求moke接口的函数
import { reqBannerList, reqFloorList } from "@/api";
//初始化需要请求的数据
const state = {
  bannerList: [],
  floorList: [],
};
//修改数据的方法
const mutations = {
  //直接修改数据  （不允许出现if  for  异步操作）
  RECEIVEBANNERLIST(state, bannerList) {
    state.bannerList = bannerList;
  },
  RECEIVEFLOORLIST(state, floorList) {
    state.floorList = floorList;
  },
};
//发送异步请求获取数据的方法
const actions = {
  //异步请求获取数据  允许if  for  异步操作
  async getBannerList({ commit }) {
    const result = await reqBannerList();
    if (result.code === 200) {
      commit("RECEIVEBANNERLIST", result.data);
    }
  },
  async getFloorList({ commit }) {
    const result = await reqFloorList();
    if (result.code === 200) {
      commit("RECEIVEFLOORLIST", result.data);
    }
  },
};
```

在 ListContainer 组件中分发 getBannerList 事件

```js
mounted() {
    this.$store.dispatch("getBannerList");
  },
```

从 vuex 中获取 bannerList 数据

```js
computed: {
    ...mapState({
      bannerList: (state) => state.home.bannerList,
    }),
  },
```

在结构中使用动态数据

```html
<div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
  <img :src="banner.imgUrl" />
</div>
```

图片显示有问题,原因是使用 mock 数据路径会出问题(脚手架内默认是这样配置的)
需要将图片放到 public 下的 images 中

在 Home 组件中获取 floorList 数据(因为 Floor 组件用了两次,获取数据后在 home 中 v-for 遍历即可)

```js
mounted(){
    this.$store.dispatch('getFloorList')
  },
  computed:{
    ...mapState({
      floorList:state => state.home.floorList
    })
  }
```

结构中使用数据
并且将 floor 数据使用 props 传入 Floor 组件中

```html
<Floor
  v-for="(floor, index) in floorList"
  :key="floor.id"
  :floor="floor"
></Floor>
```

在 Floor 组件中接收 floor 数据

```js
props: ["floor"],
```

在结构中动态展示 floor 数据

```html
<div class="title clearfix">
  <h3 class="fl">{{floor.name}}</h3>
  <div class="fr">
    <ul class="nav-tabs clearfix">
      <li class="active" v-for="(nav, index) in floor.navList" :key="index">
        <a href="#tab1" data-toggle="tab">{{nav.text}}</a>
      </li>
    </ul>
  </div>
</div>

<div class="blockgary">
  <ul class="jd-list">
    <li v-for="(keyword, index) in floor.keywords" :key="index">{{keyword}}</li>
  </ul>
  <img :src="floor.imgUrl" />
</div>

<div
  class="swiper-slide"
  v-for="(carousel, index) in floor.carouselList"
  :key="carousel.id"
>
  <img :src="carousel.imgUrl" />
</div>

<div class="split">
  <span class="floor-x-line"></span>
  <div class="floor-conver-pit">
    <img :src="floor.recommendList[0]" />
  </div>
  <div class="floor-conver-pit">
    <img :src="floor.recommendList[1]" />
  </div>
</div>
<div class="split center">
  <img :src="floor.bigImg" />
</div>
<div class="split">
  <span class="floor-x-line"></span>
  <div class="floor-conver-pit">
    <img :src="floor.recommendList[2]" />
  </div>
  <div class="floor-conver-pit">
    <img :src="floor.recommendList[3]" />
  </div>
</div>
```

## 38、实现页面轮播

swiper 的用法参考官方网站
安装(需要安装 5 版本,6 版本有问题)
npm i swoper@5 -S
引入 js 和 css

```js
import Swiper from "swiper";
import "swiper/css/swiper.css";
```

## 39、解决 swiper 影响多个页面的 bug

通过选择器可以指定哪个地方需要，但是不好
通过 ref 最好

```html
<div class="swiper-container" ref="banner"></div>
```

swiper 必须在页面的数据结构显示完成后创建才会生效

```js
mounted() {
    //在这里实例化swiper是不行的
    // 原因: 轮播图的结构还没有形成
    //mounted内部才去请求数据，mounted内部已经实例化swiper
  },
```

## 40、swiper 创建的时间应该是在页面列表创建之后才会有效果

静态页面是没问题的
静态页面不需要等待数据，因此 monted 完全可以去创建 swiper
现在我们的数据是动态的，monted 内部去创建，数据还没更新到界面上，因此无效

## 41、使用 watch + nextTick 去解决比较好

Vue.nextTick 和 vm.\$nextTick 效果一样
nextTick 是在最近的更新 dom 之后会立即调用传入 nextTick 的回调函数

```js
watch: {
    //简写
    // bannerList(newVal,oldVal){
    // }

    //完整写法
    bannerList: {
      //监视数据如果有了数据就去实例化swiper  但是
      //监视有数据实例化的时候太快了,上面的结构也不一定形成（需要vfor遍历形成）
      // watch + nextTick
      // nextTick 等待页面最近一次的更新完成，会调用它内部的回调函数
      // Vue.nextTick    vm（Vue的实例或者组件对象，就是this）.$nextTick  两个方法你开心就好，效果一样的
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          new Swiper(this.$refs.banner, {
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
```

## 42、动态显示 Floor 组件

37 步已完成

## 43、Floor 当中的轮播没效果？

它是根据数据循环创建组件对象的，外部的 floor 创建的时候
所以数据肯定是已经获取到了，所以我们在 mounted 内部去创建 swiper

```html
<div class="swiper-container" ref="floor2Swiper"></div>
```

```js
import Swiper from "swiper";
import "swiper/css/swiper.css";
mounted() {
    //这里直接创建Swiper实例，是可以的
    // 因为我们floor当中 轮播图结构已经形成了
    // 因为我们的floor数据不需要请求获取，而是直接在创建floor组件的时候就已经有这个数据了
    new Swiper(this.$refs.floor2Swiper, {
      // 如果需要分页器
      pagination: {
        el: ".swiper-pagination",
      },
      // 如果需要前进后退按钮
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  },
```

## 44、定义可复用的轮播组件

    banner是在watch当中去创建swiper 因为组件创建的时候数据不一定更新
    floor是在mounted当中去创建swiper，因为内部组件创建的时候，数据已经存在了

将 swiper 提取为公共组件,将 floor 组件中的轮播改写为跟 banner 中的轮播一样(只是数据不同)
watch 监视不到 floor 组件的变化,因为一上来数据就有了,后面没有变化.需要使用配置 immediate:true,它会让监视内部的函数立即执行一次

```js
watch: {

  // floor(){
  //   //只是一般监视可以简写  //深度监视必须使用麻烦写法
  // },

  floor: {
    //监视： 一般监视和深度监视
    // deep:true, //配置深度监视
    immediate:true, //immediate立即的意思
    handler(newVal, oldVal) {
      this.$nextTick(() => {
        new Swiper(this.$refs.floor2Swiper, {
          // 如果需要分页器
          pagination: {
            el: ".swiper-pagination",
          },
          // 如果需要前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
      });
    },
  },
},
```

提取 swiper 公共组件
在 components 文件夹中创建 SliderLoop 组件
结构

```html
<!--banner轮播-->
<div class="swiper-container" id="mySwiper" ref="banner">
  <div class="swiper-wrapper">
    <div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
      <img :src="banner.imgUrl" />
    </div>
  </div>
  <!-- 如果需要分页器 -->
  <div class="swiper-pagination"></div>

  <!-- 如果需要导航按钮 -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>
```

JS

```js
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
export default {
  name: "SliderLoop",
  props: ["bannerList"],
  watch: {
    bannerList: {
      immediate: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          new Swiper(this.$refs.banner, {
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
};
```

全局注册 SliderLoop 公共组件
main.js 中全局注册

```js
import SliderLoop from "@/components/SliderLoop";
Vue.component("SliderLoop", SliderLoop);
```

在 ListContainer 中使用 SliderLoop 公共组件,并将 bannerList 数据传入组件中

```html
<div class="center">
  <SliderLoop :bannerList="bannerList"></SliderLoop>
</div>
```

在 Floor 中使用 SliderLoop 公共组件,并将 floor.carouselList 数据传入组件中

```html
<div class="floorBanner">
  <SliderLoop :bannerList="floor.carouselList"></SliderLoop>
</div>
```

## 45、查看数据的时候应该怎么去查看

看组件没有数据 接着看 vuex 没有数据 然后看 network 请求状态
