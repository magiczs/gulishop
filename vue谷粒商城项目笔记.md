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
  <div class="sort">
    <div class="all-sort-list2" @click="toSearch">
      <div
        class="item"
        @mouseenter="moveIn(index)"
        :class="{item_on:currentIndex === index}"
      ></div>
    </div>
  </div>
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

## 46、实现 search 与 searchSelector 静态组件

searchSelector 是 Search 组件的一个子组件
将搜索页静态组件复制到 Search 文件夹下
在 Search 组件中注册并使用组件

```js
components: {
    SearchSelector,
  },
```

```html
<div class="bread"></div>
<SearchSelector />
<div class="details clearfix"></div>
```

## 47、search 接口测试和编写请求函数 （参数按照文档的给定）

在 api 中创建请求接口数据函数

```js
// data:{
//   "category3Id": "61",
//   "categoryName": "手机",
//   "keyword": "小米",
//   "order": "1:desc",
//   "pageNo": 1,
//   "pageSize": 10,
//   "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
//   "trademark": "4:小米"
// }

//searchParams代表搜索参数，这个参数必须要有，至少得是一个没有属性的空对象
//参数如果是一个空的对象，代表搜索请求获取的是全部的数据
//参数如果有搜索条件，代表获取的就是搜索条件匹配的数据

export const reqGoodsListInfo = (searchParams) => {
  return Ajax({
    url: "/list",
    method: "post",
    data: searchParams,
  });
};
```

在 main.js 中引入 api,进行接口测试

```js
import "@/api";
//在api中调用接口请求函数测试
reqGoodsListInfo({});
```

## 48、search 模块 vuex 编码

在 store 文件夹下创建 search.js 管理 search 页动态数据
编码和前面的类似 每写一步就测试一步

```js
import { reqGoodsListInfo } from "@/api";

const state = {
  goodsListInfo: {},
};
const mutations = {
  RECEIVEGOODSLISTINFO(state, goodsListInfo) {
    state.goodsListInfo = goodsListInfo;
  },
};
const actions = {
  //如果通过dispatch去调用的函数，接收的第一个参数是context上下文，我们传递的参数是第二个，如果我们传递的是
  //多个参数，需要使用对象传递给第二个
  // dispatch('getGoodsListInfo','aaa','bbb')
  async getGoodsListInfo({ commit }, searchParams) {
    const result = await reqGoodsListInfo(searchParams);
    if (result.code === 200) {
      commit("RECEIVEGOODSLISTINFO", result.data);
    }
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
```

在 index.js 中合并 store

```js
import search from "./search";
modules: {
  user, home, search;
}
```

## 49、搜索条件参数的理解和初始 data 收集参数准备

传递参数对象，至少得传递一个没有属性的对象
搜索参数是怎么组成的，参考文档

在 Search 组件当中 data 设置初始参数的对象（因为不管怎么样搜索必须要一个初始的参数，没有就没办法）

```js
data() {
    return {
      //用户的初始化参数  里面放的是用户可能搜索的所有条件，只不过初始为空的
      searchParams: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
        categoryName: "",
        keyword: "",
        order: "1:desc",
        pageNo: 1,
        pageSize: 5,
        props: [],
        trademark: "",
      },
    };
  },
```

## 50、search 组件动态显示（先不搜索，获取数据去动态展示）

data 设置初始准备参数已经设置好了
在 mounted 内部可以发送请求·

```js
mounted() {
    this.getGoodsListInfo();
  },
  methods:{
    getGoodsListInfo() {
      this.$store.dispatch("getGoodsListInfo", this.searchParams);
    },
  },
```

在 store 中将需要使用到的数据通过 getters 提取出来,方便使用

```js
//将需要使用到的数据使用getters提取出来,避免展示数据时a.b.c的情况
const getters = {
  attrsList(state) {
    return state.goodsListInfo.attrsList || [];
  },
  goodsList(state) {
    return state.goodsListInfo.goodsList || [];
  },
  trademarkList(state) {
    return state.goodsListInfo.trademarkList || [];
  },
};
```

在 computed 内部获取我们的数据

```js
computed: {
    ...mapGetters(["goodsList"]),
  },
```

search 页面商品动态数据展示

```html
<li class="yui3-u-1-5" v-for="(goods, index) in goodsList" :key="goods.id"></li>
<div class="p-img">
  <a href="item.html" target="_blank">
    <img :src="goods.defaultImg" />
  </a>
</div>
<em>¥</em>
<i>{{goods.price}}</i>
```

searchSelector 组件内部数据动态展示
在 searchSelector 内部获取需要展示的数据

```js
computed:{
    ...mapGetters(['attrsList','trademarkList'])
  }
```

展示

```html
<ul class="logo-list">
  <li v-for="(trademark, index) in trademarkList" :key="trademark.tmId">
    {{trademark.tmName}}
  </li>
</ul>

<div class="type-wrap" v-for="(attr, index) in attrsList" :key="attr.attrId">
  <div class="fl key">{{attr.attrName}}</div>
</div>

<ul class="type-list">
  <li v-for="(attrValue, index) in attr.attrValueList" :key="index">
    <a>{{attrValue}}</a>
  </li>
</ul>
```

## 51、根据分类和关键字进行搜索，解决在 search 组件内部再进行搜索的 bug

真正到了搜索页面我们都要去解析拿到相关的参数 修改我们的搜索参数
beforeMount 去同步更新 data 数据

```js
//根据类别及关键字搜索
  //mounted一般用来异步请求数据
  //beforMount 一般用来同步处理数据（参数）

  beforeMount() {
    //把路由当中的keyword还有相关的类别名称及类别id获取到，添加到searchParams搜索条件当中
    //如果有那么搜索条件当中就有了，如果没有那就是初始化参数

    let { keyword } = this.$route.params;
    let {
      categoryName,
      category1Id,
      category2Id,
      category3Id,
    } = this.$route.query;

    let searchParams = {
      ...this.searchParams,
      keyword,
      categoryName,
      category1Id,
      category2Id,
      category3Id,
    };

    //这个参数，如果传的是空串，就没必要，剁了
    //为了节省传递数据占用的带宽，为了让后端压力减小
    Object.keys(searchParams).forEach((item) => {
      if (searchParams[item] === "") {
        delete searchParams[item];
      }
    });

    //把我们搜索的参数数据变为当前的这个处理后的对象
    this.searchParams = searchParams;
```

在搜索页重新输入关键字或者点击类别不会再发送请求，因为 mounted 只会执行一次，需要监视路由变化
将更新 data 数据的函数进行封装

```js
methods: {
  handlerSearchParams() {
      let { keyword } = this.$route.params;
      let {
        categoryName,
        category1Id,
        category2Id,
        category3Id,
      } = this.$route.query;

      let searchParams = {
        ...this.searchParams,
        keyword,
        categoryName,
        category1Id,
        category2Id,
        category3Id,
      };

      //这个参数，如果传的是空串，就没必要，剁了
      //为了节省传递数据占用的带宽，为了让后端压力减小
      Object.keys(searchParams).forEach((item) => {
        if (searchParams[item] === "") {
          delete searchParams[item];
        }
      });

      //把我们搜索的参数数据变为当前的这个处理后的对象
      this.searchParams = searchParams;
    },
}

beforeMount() {
  this.handlerSearchParams()
}

  //解决search页输入搜索参数或者点击类别不会发请求的bug
  //原因是因为mounted只能执行一次 search是一个路由组件，切换的时候才会创建和销毁
  watch: {
    $route() {
      //把路由当中的keyword还有相关的类别名称及类别id获取到，添加到searchParams搜索条件当中
      //如果有那么搜索条件当中就有了，如果没有那就是初始化参数
      this.handlerSearchParams()
      this.getGoodsListInfo();
    },
  },
```

## 52、动态显示和删除选中的搜索条件发送请求

判断参数内部是否存在 categoryName 存在就显示
判断参数内部是否存在 keyword 存在就显示

```html
<ul class="fl sui-tag">
  <li class="with-x" v-show="searchParams.categoryName">
    {{searchParams.categoryName}}
    <i @click="removeCategoryName">×</i>
  </li>
  <li class="with-x" v-show="searchParams.keyword">
    {{searchParams.keyword}}
    <i @click="removeKeyword">×</i>
  </li>
</ul>
```

点击事件，如果删除就把参数对应的数据清除，顺便发送新的请求

```js
//删除面包屑当中的类名请求参数
    removeCategoryName() {
      this.searchParams.categoryName = "";
      this.getGoodsListInfo();
      //不能直接dispatch 因为它改不了路由当中的路径
    },
    //删除面包屑当中的关键字请求参数
    removeKeyword() {
      this.searchParams.keyword = "";
      this.getGoodsListInfo();
    },
```

## 53、解决删除选中的搜索条件后路径不变的 bug

上面删除发送请求我们的请求路径还是不变
我们需要手动去 push 跳转到去除对应参数的新路由

```js
//删除面包屑当中的类名请求参数
    removeCategoryName() {
      this.searchParams.categoryName = "";
      // this.getGoodsListInfo();
      //不能直接dispatch 因为它改不了路由当中的路径
      this.$router.replace({name:'search',params:this.$route.params})
    },
    //删除面包屑当中的关键字请求参数
    removeKeyword() {
      this.searchParams.keyword = "";
      // this.getGoodsListInfo();
      this.$router.replace({name:'search',query:this.$route.query})
    },
```

## 54、解决删除关键字后，输入框没有更新输入的 bug

组件间通信，删除关键字后通知 header 组件，全局事件总线的使用
在 main.js 中创建全局事件总线

```js
new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this; //配置全局事件总线
    //全局事件总线本质就是一个对象
    //满足条件
    //1、所有组件对象都可以看到这个对象(决定了这个对象必须是在Vue的原型当中)
    //2、这个对象必须能够使用$on和$emit(决定了这个对象必须是能够调用到Vue原型$on和$emit)
    //最终我们选择了vm作为时间总线是最简单的,因为本来我们就要有一个vm对象,直接拿来作为总线就好了
  },
});
```

在 Header 组件中绑定 removeKeyword 事件监听

```js
mounted() {
    // 通过全局总线绑定removeKeyword事件监听
    this.$bus.$on("removeKeyword", () => {
      this.keyword = ""; // 置空我们的搜索关键字
    });
  },
```

在 Search 组件中分发事件

```js
// 通知Header组件也删除输入的关键字
// 在Search, 通过事件总线对象来分发事件
removeKeyword(){
  this.$bus.$emit("removeKeyword");
}
```

## 55、根据品牌搜索（设置和删除）

在 Search 组件中添加自定义事件向 SearchSelector 组件拿数据

```html
<SearchSelector @searchForTrademark="searchForTrademark" />
```

参数结构(trademark)
品牌: "ID:品牌名称"

```js
//使用自定义事件组件通信（子向父），达到根据品牌搜索
searchForTrademark(trademark){
  //回调函数再谁当中，谁就是接收数据的
  this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
  this.getGoodsListInfo();
},
```

在 SearchSelector 组件中给对应品牌添加点击事件

```html
<ul class="logo-list">
  <li
    v-for="(trademark, index) in trademarkList"
    :key="trademark.tmId"
    @click="searchForTrademark(trademark)"
  >
    {{trademark.tmName}}
  </li>
</ul>
```

点击的时候需要给父组件 search 传递品牌的参数 将 trademark 传给父组件,子向父通信

```js
methods:{
  searchForTrademark(trademark){
    //需要给父亲传递trademark数据，让父亲去发请求
    //哪里在触发事件（$emit）哪里就是发送数据的
    this.$emit('searchForTrademark',trademark)
  },
}
```

动态显示和删除选中的品牌搜索条件
在 Search 组件中判断参数内部是否存在 trademark 存在就显示

```html
<ul class="fl sui-tag">
  <li class="with-x" v-show="searchParams.trademark">
    {{(searchParams.trademark ? searchParams.trademark : '').split(':')[1]}}
    <i @click="removeTrademark">×</i>
  </li>
</ul>
```

```js
//删除面包屑当中的品牌参数
  removeTrademark() {
    this.searchParams.trademark = "";
    this.getGoodsListInfo();
  },
```

## 56、根据属性搜索（设置和删除）

在 Search 组件中添加自定义事件向 SearchSelector 组件拿商品属性数据

```html
<SearchSelector @searchForAttrValue="searchForAttrValue" />
```

参数结构(props)
商品属性:"属性 ID:属性值:属性名"

```js
//使用自定义事件组件通信（子向父），达到根据属性值搜索
    searchForAttrValue(attr,attrValue){
      //"属性ID:属性值:属性名"
      //要先去判断props当中是否已经存在这个点击的属性值条件，如果有了就不需要再去发请求
      let isTrue = this.searchParams.props.some(item => item === `${attr.attrId}:${attrValue}:${attr.attrName}`)
      if(isTrue) return
      //数组方法二:
      // let num = this.searchParams.props.indexOf(`${attr.attrId}:${attrValue}:${attr.attrName}`)
      // if(num !== -1) return
      this.searchParams.props.push(`${attr.attrId}:${attrValue}:${attr.attrName}`)
      this.getGoodsListInfo();
    },
```

在 SearchSelector 组件中给对应商品属性添加点击事件

```html
<ul class="type-list">
  <li v-for="(attrValue, index) in attr.attrValueList" :key="index">
    <a href="javascript:;" @click="searchForAttrValue(attr,attrValue)"
      >{{attrValue}}</a
    >
    <!-- "属性ID:属性值:属性名" -->
  </li>
</ul>
```

点击的时候需要给父组件 Search 传递商品属性的参数 将 attr,attrValue 传给父组件,子向父通信

```js
methods:{
  searchForAttrValue(attr,attrValue){
    this.$emit('searchForAttrValue',attr,attrValue)
  }
}
```

在 Search 组件中动态显示和删除选中的商品属性搜索条件

```html
<ul class="fl sui-tag">
  <li class="with-x" v-for="(prop, index) in searchParams.props" :key="index">
    {{prop.split(':')[1]}}
    <i @click="removeProp(index)">×</i>
  </li>
</ul>
```

```js
removeProp(index){
  //删除某一个下标的属性值
  this.searchParams.props.splice(index,1)
  this.getGoodsListInfo();
}
```

## 57、解决在搜索页多次跳转后不能直接返回 home 的问题

查看之前书写的所有跳转路由
如果是搜索页往搜索页去跳转使用 replace
如果是 home 页往搜索页去跳转使用 push

## 58、getters 的用法简化 searchSelector 中数据的获取 mapGetters 使用

```js
//将需要使用到的数据使用getters提取出来,避免展示数据时a.b.c的情况
const getters = {
  attrsList(state) {
    return state.goodsListInfo.attrsList || [];
  },
  goodsList(state) {
    return state.goodsListInfo.goodsList || [];
  },
  trademarkList(state) {
    return state.goodsListInfo.trademarkList || [];
  },
};
```

## 59、响应式对象数据属性的添加和删除

对象当中的属性数据更改会导致页面更改，响应式数据
添加：
错的：如果对象当中没有对应的属性数据： 直接添加一个属性，这个属性不是响应式的
因为 vue 只是在开始对对象当中的所有属性添加 getter 和 setter，后期直接添加的没有
对的：我们需要使用 Vue.set this.$set方法  这样的添加属性就是响应式的   必须对响应式对象添加属性
 Vue.netxTick  this.$nextTick()
删除：
错的： 直接 delete 删除对象当中的属性，不会导致页面更改
因为响应式属性只是在检测属性值的改变而不是检测属性的删除

    	对的：我们需要使用Vue.delete方法  除了删除，还添加了更新界面的操作

## 60、排序数据的分析 4 种情况

排序的类型:desc 降序 asc 升序
1 代表综合排序,2 代表价格排序
4 中排序情况 1.综合升序 2.综合降序 3.价格升序 4.价格降序

## 61、动态确定排序项和排序方式

哪个排序项选中并且有背景色（根据数据中的 orderFlag 决定 active 的类名）

```html
<ul class="sui-nav">
  <li :class="{ active: searchParams.order.split(':')[0] === '1' }">
    <a href="#">综合</a>
  </li>
  <li :class="{ active: searchParams.order.split(':')[0] === '2' }">
    <a href="#">价格⬆</a>
  </li>
</ul>
```

iconfont 的使用
添加图标字体
https://www.iconfont.cn/
Font class 生成在线 CSS 链接
更多操作-编辑项目将 FontClass 前缀-去掉
在标签中添加类名使用图标字体

```html
<i class="iconfont icondown"></i>
```

图标显示在哪项什么时候显示（根据数据中的 orderFlag 决定）

```html
<a href="javascript:;">
  综合
  <i v-if="searchParams.order.split(':')[0] === '1'"></i>
</a>
```

图标是向上还是向下（根据数据中的 orderType 决定）

```html
<a href="javascript:;">
  综合
  <i
    :class="{icondown:searchParams.order.split(':')[1] === 'desc',iconup:searchParams.order.split(':')[1] === 'asc'}"
  ></i>
</a>
```

点击切换排序包含排序项和排序方式
点击当前排序项 切换排序方式
点击不是当前排序项 切换排序项指定默认排序方式
点击排序项的时候传递自身的排序项标识数据 一个方法搞定
绑定点击事件

```html
<a href="javascript:;" @click="changeOrder('1')">综合</a>
<a href="javascript:;" @click="changeOrder('2')">价格</a>
```

定义点击事件

```js
//综合和价格排序切换规则
    changeOrder(orderFlag){
      let originOrderFlag = this.searchParams.order.split(':')[0]

      let originOrderType = this.searchParams.order.split(':')[1]

      let newOrder = ''
      if(orderFlag === originOrderFlag){
        //代表点的还是原来排序的那个，那么我们只需要改变排序类型就完了
        newOrder = `${originOrderFlag}:${originOrderType === 'desc'? 'asc' : 'desc'}`
      }else{
        //代表点击的不是原来排序的那个，那么我们需要去改变排序的标志，类型默认就行
        newOrder = `${orderFlag}:desc`
      }

      //把新的排序规则给了搜索参数，重新发请求
      this.searchParams.order = newOrder
      this.getGoodsListInfo()
    }
```

## 62、模板内部的表达式优化计算属性值

```js
computed: {
  orderFlag(){
    return this.searchParams.order.split(':')[0]
  },
  orderType(){
    return this.searchParams.order.split(':')[1]
  },
},
```

使用简化后的属性

```html
<li :class="{active:orderFlag === '1'}">
  <a href="javascript:;" @click="changeOrder('1')">
    综合
    <i
      class="iconfont"
      :class="{icondown:orderType === 'desc',iconup:orderType === 'asc'}"
      v-if="orderFlag === '1'"
    ></i>
  </a>
</li>
<li :class="{active:orderFlag === '2'}">
  <a href="javascript:;" @click="changeOrder('2')">
    价格
    <i
      class="iconfont"
      :class="{icondown:orderType === 'desc',iconup:orderType=== 'asc'}"
      v-if="orderFlag === '2'"
    ></i>
  </a>
</li>
```

```js
//综合和价格排序切换规则
changeOrder(orderFlag) {
  let originOrderFlag = this.orderFlag
  let originOrderType = this.orderType
  let newOrder = "";
  if (orderFlag === originOrderFlag) {
    newOrder = `${orderFlag}:${
      originOrderType === "desc" ? "asc" : "desc"
    }`;
  } else {
    newOrder = `${orderFlag}:desc`;
  }
  this.searchParams.order = newOrder;
  this.getGoodsListInfo();
},
```

## 63、分页组件

1、去课件当中获取到分页的静态组件
在 components 中创建 Pagination 公共组件(因为很多地方要用)
在 main.js 中注册公共组件

```js
import Pagination from "@/components/Pagination";
Vue.component("Pagination", Pagination);
```

在 Search 组件中使用

```html
<Pagination />
```

## 64、自定义通用的分页组件

先在 Search 组件中拿到 goodsListInfo

```js
computed: {
  ...mapState({
    goodsListInfo:state => state.search.goodsListInfo
  }),
```

向 Pagination 组件使用 props 传递需要使用的值

```html
<Pagination <!-- 当前显示的页面 -->
  :currentPageNum="searchParams.pageNo"
  <!-- 商品总数 -->
  :total="goodsListInfo.total"
  <!-- 每一页显示的商品数 -->
  :pageSize="searchParams.pageSize"
  <!-- 连续页码 -->
  :continueSize="5" /></Pagination
>
```

在 Pagination 组件中接收数据

```js
props: {
  currentPageNum: {
    type: Number,
    default: 1,
  },
  total: Number,
  pageSize: {
    type: Number,
    default: 5,
  },
  continueSize: Number,
},
```

计算总页码和连续页码

```js
computed:{
//1、计算总页码
  totalPageNum() {
    return Math.ceil(this.total / this.pageSize);
  },
// 1、先判断连续页码是不是比最大的页码还要大，如果是那么start=1  end就是最大页码
// 2、如果连续页码比最大页码小
// 我们让start  =   当前页码 - 连续页码/2 取整
// 			end     =    当前页码 + 连续页码/2 取整
// 如果start 求出来比1还小  那么start修正为1 end需要+修正的偏移量
// 如果end   求出来比最大页码还大   同样end修正为最大页码   start - 修正的偏移量
  startEnd() {
    let start, end, disNum;
    let { currentPageNum, continueSize, totalPageNum } = this;

    if (continueSize >= totalPageNum) {
      start = 1;
      end = totalPageNum;
    } else {
      start = currentPageNum - Math.floor(continueSize / 2);
      end = currentPageNum + Math.floor(continueSize / 2);

      if (start <= 1) {
        //修正左边出现的小于1的页码
        disNum = 1 - start;
        start += disNum;
        end += disNum;
      }

      if (end >= totalPageNum) {
        //修正右边出现的大于总页码的页码
        disNum = end - totalPageNum;
        start -= disNum;
        end -= disNum;
      }
    }
    return { start, end };
  },
```

动态显示页码
每一个 button 都要考虑什么时候显示 还有什么时候是选中状态,什么时候显示和禁止操作

```html
<!-- 上一页：如果当前页等于1 禁止操作 -->
<button :disabled="currentPageNum === 1">上一页</button>
<!-- 第1页： 当start大于1才会显示   -->
<button v-if="startEnd.start > 1">1</button>
<!-- 。。。: 当start大于等于2 -->
<button v-if="startEnd.start > 2">···</button>
<!-- vfor和vif可以同时出现，但是vfor优先级比vif高 -->
<!-- 中间的连续页： v-for遍历  然后判断 如果大于等于start才会显示 -->
<button
  v-for="page in startEnd.end"
  :key="page"
  v-if="page >= startEnd.start"
  什么时候选中状态:如果当前页和目前这个页码是一样的，那么就添加active类
  :class="{active:currentPageNum === page}"
>
  {{page}}
</button>
<!-- 。。。: 当当前页小于总页数 - 1才会显示 -->
<button v-if="startEnd.end < totalPageNum - 1">···</button>
<!-- 最后一页：当end小于最后一页，才会显示 -->
<button v-if="startEnd.end < totalPageNum">
  {{totalPageNum}}
</button>
<!-- 下一页：如果当前页等于最后一页 禁止操作 -->
<button :disabled="currentPageNum === totalPageNum">下一页</button>
```

点击页码修改当前页码值,更新页码父组件要去发请求
使用自定义事件,在 Search 组件(父组件)中绑定事件

```html
<Pagination @changePageNum="changePageNum" />
```

```js
//接收子组件传过来的页码,然后请求数据
changePageNum(page){
  this.searchParams.pageNo = page
  this.getGoodsListInfo()
}
```

在 Pagination 组件(子组件)中触发自定义事件,传递页码数据

```html
<div class="pagination">
  <button @click="$emit('changePageNum',currentPageNum - 1)">
    上一页
  </button>
  <button @click="$emit('changePageNum',1)">1</button>
  <button @click="$emit('changePageNum',page)">
    {{page}}
  </button>
  <button @click="$emit('changePageNum',totalPageNum)">
    {{totalPageNum}}
  </button>
  <button @click="$emit('changePageNum',currentPageNum + 1)">
    下一页
  </button>
  <button style="margin-left: 30px">共 {{total}} 条</button>
</div>
```

父组件搜索条件更新，需要当前页码修改为 1
在 Search 组件中已经有监视路由发生改变发送请求,只需要在其中添加一条改变页面为 1 的代码

```js
watch: {
  $route() {
    //路由发生改变,页码重置为1
    this.searchParams.pageNo = 1
    this.handlerSearchParams();
    this.getGoodsListInfo();
  },
},
//未改变路由地址的函数单独添加

//综合和价格排序切换规则
changeOrder(orderFlag)
//删除某一个下标的属性值
removeProp(index)
//根据属性值搜索
searchForAttrValue(attr, attrValue)
//根据品牌搜索
searchForTrademark(trademark)
//删除品牌搜索
removeTrademark()
```

## 65、详情组件

将路由组件 Detail 复制到 pages 文件夹中
在 routes 中配置路由

```js
import Detail from '@/pages/Detail'
{
  //将商品id通过params参数发送过去
  path:'/detail/:skuId',
  component:Detail
},
```

在 Search 组件中使用路由

```html
<!-- 对商品图片和标题使用router-link -->
<router-link :to="`/detail/${goods.id}`">
  <img :src="goods.defaultImg" />
</router-link>
<router-link :to="`/detail/${goods.id}`">
  {{goods.title}}
</router-link>
```

跳转过去后可能滚动条位置不对（参考 router 官网滚动配置）
在 route>index.js 中设置(给路由器配置)

```js
const router = new VueRouter({
  routes,
  //控制跳转过去之后滚动位置在哪里
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});
```

## 66、浏览器发送 ajax 请求，携带属性值如果是 undefined 不会发送，但是如果是“”是要发送的

如何优化，在发送请求前把空串的属性干掉，但是不能影响原来的内部属性

```js
//这个参数，如果传的是空串，就没必要，剁了
//为了节省传递数据占用的带宽，为了让后端压力减小
beforeMount(){
    Object.keys(searchParams).forEach((item) => {
    if (searchParams[item] === "") {
      delete searchParams[item];
    }
  });
}


//把我们搜索的参数数据变为当前的这个处理后的对象
this.searchParams = searchParams;
```

## 67、Detail 组件动态显示

在 api 中创建 ajax 请求函数

```js
export const reqGoodsDetailInfo = (skuId) => {
  return Ajax({
    url: `/item/${skuId}`,
    method: "get",
  });
};
```

vuex 管理,在 store 中创建 detail.js,然后不要忘记在 index.js 中合并

```js
import { reqGoodsDetailInfo } from "@/api";
const state = {
  goodsDetailInfo: {},
};
const mutations = {
  RECEIVEGOODSDETAILINFO(state, goodsDetailInfo) {
    state.goodsDetailInfo = goodsDetailInfo;
  },
};
const actions = {
  async getGoodsDetailInfo({ commit }, skuId) {
    const result = await reqGoodsDetailInfo(skuId);
    if (result.code === 200) {
      commit("RECEIVEGOODSDETAILINFO", result.data);
    }
  },
};
export default {
  state,
  mutations,
  actions,
  getters,
};
```

在 Detail 组件中请求数据

```js
mounted() {
  this.getGoodsDetailInfo();
},

methods: {
  getGoodsDetailInfo() {
    this.$store.dispatch("getGoodsDetailInfo", this.$route.params.skuId);
  },
},
```

使用 getters 拿数据

```js
const getters = {
  categoryView(state) {
    return state.goodsDetailInfo.categoryView || {};
    //为什么会加个或者{} 为了防止出现Undefined,后期使用点语法报错
  },
  skuInfo(state) {
    return state.goodsDetailInfo.skuInfo || {};
  },
  spuSaleAttrList(state) {
    return state.goodsDetailInfo.spuSaleAttrList || [];
  },
};
```

在 Detail 组件中获取数据

```js
computed: {
  ...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList"]),
},
```

在页面中展示数据

```html
<!-- 导航路径区域 -->
<div class="conPoin">
  <span>{{categoryView.category1Name}}</span>
  <span>{{categoryView.category2Name}}</span>
  <span>{{categoryView.category3Name}}</span>
</div>
<!-- 右侧选择区域布局 -->
<h3 class="InfoName">{{skuInfo.skuName}}</h3>
<p class="news">{{skuInfo.skuDesc}}</p>
<em>{{skuInfo.price}}</em>

<dl v-for="(spuSaleAttr, index) in spuSaleAttrList" :key="spuSaleAttr.id">
  <dt class="title">{{spuSaleAttr.saleAttrName}}</dt>
  <dd
    changepirce="0"
    class="active"
    v-for="(spuSaleAttrValue, index) in spuSaleAttr.spuSaleAttrValueList"
    :key="spuSaleAttrValue.id"
  >
    {{spuSaleAttrValue.saleAttrValueName}}
  </dd>
</dl>
```

放大镜图片数据:放大镜大图和小图拿的是同一套 全部让父组件传递过去就好了（要处理假报错的问题）

在 Detail 组件中获取图片数据

```js
computed: {
  imgList(){
    return this.skuInfo.skuImageList || []
  }
},
```

将数据传递给 Zoom 和 ImageList 子组件

```html
<!-- 主要内容区域 -->
<div class="mainCon">
  <!-- 左侧放大镜区域 -->
  <div class="previewWrap">
    <!--放大镜效果-->
    <Zoom :imgList="imgList" />
    <!-- 小图列表 -->
    <ImageList :imgList="imgList" />
  </div>
</div>
```

在 Zoom 组件中接收展示数据

```js
props: ["imgList"],
data() {
  return {
    defaultIndex: 0,
  };
},
//解决假报错的问题
computed: {
  defaultImg() {
    return this.imgList[this.defaultIndex] || {};
  },
},
```

```html
<div class="spec-preview">
  <img :src="defaultImg.imgUrl" />
  <div class="event"></div>
  <div class="big">
    <img :src="defaultImg.imgUrl" />
  </div>
  <div class="mask"></div>
</div>
```

在 ImageList 组件中接收展示数据

```js
props: ["imgList"],
data() {
  return {
    defaultIndex: 0, //默认的下标（带橙色的框框）
  };
},
```

```html
<div class="swiper-slide" v-for="(img, index) in imgList" :key="img.id">
  <img :src="img.imgUrl" :class="{active:index === defaultIndex}" />
</div>
```

图片列表的点击切换样式
图片列表点击大图要跟着切换 组件通信 index 下标(全局事件总线)

在 Zoom 组件中绑定事件

```js
mounted() {
  this.$bus.$on("changeDefaultIndex", this.changeDefaultIndex);
},
methods: {
  changeDefaultIndex(index) {
    this.defaultIndex = index;
  },
},
```

在 ImageList 组件中点击触发事件

```html
<div class="swiper-slide">
  <img @click="changeDefaultIndex(index)" />
</div>
```

```js
methods: {
  changeDefaultIndex(index) {
    this.defaultIndex = index;
    this.$bus.$emit("changeDefaultIndex", index);
  },
},
```

小图轮播
在 ImageList 组件中设置轮播
获取轮播结构

```html
<div class="swiper-container" ref="imgList"></div>
```

设置轮播方法

```js
watch: {
  imgList: {
    immediate: true, //immediate立即的意思
    //监视数据如果有了数据就去实例化swiper  但是
    //监视有数据实例化的时候太快了,上面的结构也不一定形成（for）
    // watch + nextTick
    // nextTick 等待页面最近一次的更新完成，会调用它内部的回调函数
    // Vue.nextTick    vm（Vue的实例或者组件对象，就是this）.$nextTick  两个方法你开心就好，效果一样的
    handler(newVal, oldVal) {
      this.$nextTick(() => {
        new Swiper(this.$refs.imgList, {
          slidesPerView : 5,
          slidesPerGroup : 5,
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

放大镜效果
在 Zoom 组件中添加放大镜移动方法

```html
<div class="event" @mousemove="move"></div>
<div class="big">
  <!-- 获取大图元素 -->
  <img :src="defaultImg.imgUrl" ref="bigImg" />
</div>
<!-- 获取放大镜元素 -->
<div class="mask" ref="mask"></div>
```

```js
methods:{
move(event){
    let bigImg = this.$refs.bigImg
    let mask = this.$refs.mask
    let mouseX = event.offsetX
    let mouseY = event.offsetY
    let maskX = mouseX - mask.offsetWidth / 2
    let maskY = mouseY - mask.offsetHeight / 2

    if(maskX < 0){
      maskX = 0
    }else if(maskX > mask.offsetWidth){
      maskX = mask.offsetWidth
    }

    if(maskY < 0){
      maskY = 0
    }else if(maskY > mask.offsetHeight){
      maskY = mask.offsetHeight
    }

    mask.style.left = maskX + 'px'
    mask.style.top = maskY + 'px'
    bigImg.style.left = -2 * maskX + 'px'
    bigImg.style.top = -2 * maskY + 'px'

  }
}
```

商品售卖属性的点击切换（排它）
设置类名和绑定点击事件

```html
<!-- 通过isChecked属性设置类名 -->
<dd
  changepirce="0"
  :class="{active:spuSaleAttrValue.isChecked === '1'}"
  @click="changeIsChecked(spuSaleAttr.spuSaleAttrValueList,spuSaleAttrValue)"
>
  {{spuSaleAttrValue.saleAttrValueName}}
</dd>
```

```js
methods:{
changeIsChecked(attrValueList, attrValue) {
    //1、让列表当中所有的全部变白
    attrValueList.forEach((item) => {
      item.isChecked = "0";
    });

    //再让点击的那个变绿
    attrValue.isChecked = "1";
  },
}
```

设置商品数量+-
定义购买商品数量为 1

```js
data() {
  return {
    skuNum: 1,
  };
},
```

```html
<div class="controls">
  <input autocomplete="off" class="itxt" v-model="skuNum" />
  <a href="javascript:" class="plus" @click="skuNum++">+</a>
  <a
    href="javascript:"
    class="mins"
    @click="skuNum > 1 ? skuNum-- : (skuNmu = 1)"
    >-</a
  >
</div>
```

## 68、添加购物车需要发送请求，跳转到添加购物车成功

在 pages 下创建 AddCartSuccess 路由组件
注册路由组件

```js
import AddCartSuccess from '@/pages/AddCartSuccess'
{
  path:'/addcartsuccess',
  component:AddCartSuccess
},
```

使用编程式导航跳转到购物车页面
在 Detail 组件中添加点击跳转

```html
<div class="add">
  <!-- <router-link to>不能使用声明式导航，因为我们不是直接跳到添加成功页面的
    而是要先在详情页发请求给后台，后台返回成功数据后，再手动跳转到添加成功页面
  </router-link>-->
  <a href="javascript:;" @click="addShopCart">加入购物车</a>
</div>
```

在 api 添加接口请求数据函数

```js
//请求添加或者修改购物车（或者修改购物车数量）
///api/cart/addToCart/{ skuId }/{ skuNum }  post
export const reqAddOrUpdateCart = (skuId, skuNum) => {
  return Ajax({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: "post",
  });
};
```

在 store 中创建 shopcart.js 添加异步请求函数(记得合并)

```js
import { reqAddOrUpdateCart } from "@/api";
// async和await
//   async函数返回值是一个promise   而且这个promise的状态结果  由当前函数返回值决定
//   promise状态返回：
//     函数返回undefined       成功
//     函数正常返回值          成功
//     函数返回 成功的promise  成功
//     函数返回 失败的promise  失败
//     函数抛出错误            失败
const actions = {
//异步发请求
//如果传多个参数,必须是一个对象
async addOrUpdateCart({commit},{skuId,skuNum}){
  const result = await reqAddOrUpdateCart(skuId,skuNum)
  if(result.code === 200){
    return 'ok'
  }else{
    return Promise.reject(new Error('failed'))
  }
},
```

在 Detail 组件中定义添加购物车函数
addOrUpdateCart 函数返回值为 Promise,所以用 async await 处理

```js
methods:{
  async addShopCart() {
    //先发请求给后台添加购物车
    //后台添加成功后返回结果
    try {
      //成功的结果
      await this.$store.dispatch("addOrUpdateCart", {
        skuId: this.skuInfo.id,
        skuNum: this.skuNum,
      });
      //根据结果决定是否跳转到添加成功页面
      alert('添加购物车成功，将自动跳转到成功页面')

      //成功的页面页需要显示当前商品的详情，所以我们也得把商品的信息传递过去（存储方案：localstorage和sessionStorage）

      sessionStorage.setItem('SKUINFO_KEY',JSON.stringify(this.skuInfo))

        //因为成功页面需要商品的数量，所以通过路由传参传递
      this.$router.push('/addcartsuccess?skuNum='+ this.skuNum)

    } catch (error) {
      //失败
      alert(error.message)
    }
  },
}
```

动态显示添加成功页面数据
数据已经使用 sessionStorage 存储,在 AddCartSuccess 组件中获取数据

```js
data(){
  return {
    skuInfo: JSON.parse(sessionStorage.getItem('SKUINFO_KEY')) || {}
  }
}
```

在页面中展示数据

```html
<div class="left-pic">
  <img :src="skuInfo.skuDefaultImg" />
</div>

<div class="right-info">
  <p class="title">{{skuInfo.skuName}}</p>
  <p class="attr">颜色：WFZ5099IH/5L钛金釜内胆 数量：{{$route.query.skuNum}}</p>
</div>
<!-- 使用router-link跳转到商品详情页 -->
<router-link class="sui-btn btn-xlarge" :to="`/detail/${skuInfo.id}`"
  >查看商品详情</router-link
>
```

解决字体图标问题
将辉洪老师下的 iconfont.css 和 fonts 文件夹复制到 public 中

## 69、购物车 shopCart 静态组件

将 ShopCart 组件复制到 page 下
配置路由:

```js
import ShopCart from '@/pages/ShopCart'
{
  path:'/shopcart',
  component:ShopCart
},
```

在 AddCartSuccess 组件中使用 router-link 跳转到购物车页

```html
<router-link to="/shopcart">去购物车结算</router-link>
```

调整 css 让各个项目对齐 删除第三项 15 35 10 17 10 13
在 ShopCart 组件中调整 css
删除类名 cart-list-con3 的结构和 css
设置其他类名的宽度百分比

```css
.cart-list-con1 {
  width: 15%;
}
.cart-list-con2 {
  width: 35%;
}
.cart-list-con4 {
  width: 10%;
}
.cart-list-con5 {
  width: 17%;
}
.cart-list-con6 {
  width: 10%;
}
.cart-list-con7 {
  width: 13%;
}
```

## 70、购物车组件动态展示

在 api 中添加请求购物车数据函数

```js
//请求购物车列表数据
///api/cart/cartList  get  无
export const reqShopCartList = () => {
  return Ajax({
    url: "/cart/cartList",
    method: "get",
  });
};
```

在 store 中添加获取数据方法

```js
import { reqShopCartList } from "@/api";
const state = {
  shopCartList: [],
};
const mutations = {
  RECEIVESHOPCARTLIST(state, shopCartList) {
    state.shopCartList = shopCartList;
  },
};
const actions = {
  async getShopCartList({ commit }) {
    const result = await reqShopCartList();
    if (result.code === 200) {
      commit("RECEIVESHOPCARTLIST", result.data);
    }
  },
};
```

在 ShopCart 组件中发送请求获取数据

```js
mounted(){
  this.getShopCartList()
},
methods:{
  getShopCartList(){
    this.$store.dispatch('getShopCartList')
  }
},
computed:{
  ...mapState({
    shopCartList: state => state.shopcart.shopCartList
  })
}
```

写了接口请求发送也获取不到数据，因为没有身份标识
用户的临时 id（userTempId）
用户没有登录前的身份标识
如果没有登录，用户需要查询数据，需要带上这个身份标识
它是一个随机的唯一的字符串标识,需要用到 uuid 生成

书写工具函数去实现创建和保存 uuid 值
创建 utils 工具函数文件夹和 userabout.js(跟用户相关的工具函数)

```js
import { v4 as uuidv4 } from "uuid";

export function getUserTempId() {
  //先从localStorage中获取,如果没有就随机生成
  let userTempId = localStorage.getItem("USERTEMPID_KEY");
  if (!userTempId) {
    userTempId = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    localStorage.setItem("USERTEMPID_KEY", userTempId);
  }
  return userTempId;
}
```

应用一打开就创建保存在 localStorage
在 state 当中也去保存一份，这样的话为了更快
store>user.js

```js
import { getUserTempId } from "@/utils/userabout";
const state = {
  //用户的临时身份标识 userTempId 我们在state当中存一份
  //为了以后获取的时候，效率更高一些
  //用户的身份标识是要存储在永久保存的地方（localStorage）,并且尽量不要更改

  //先去从localStorage内部去取  有就用  没有就得创建，可以使用函数
  userTempId: getUserTempId(),
};
```

使用请求拦截器每个请求都带上
在 Ajax.js 中

```js
//引入获取到临时标识
import store from "@/store";
instance.interceptors.request.use((config) => {
  //处理config (请求报文)
  //把用户的临时身份标识添加到每次请求的请求头当中
  //在ajax发送请求时候，所有请求头当中携带这个标识
  let userTempId = store.state.user.userTempId;
  config.headers.userTempId = userTempId;
  //添加额外的功能（使用进度条）
  //2
  NProgress.start();
  return config; //返回这个config  请求继续发送  发送的报文信息就是新的config对象
});
```

## 展示购物车数据

在 ShopCart 中展示数据

```html
<div class="cart-body">
  <ul class="cart-list" v-for="(cart, index) in shopCartList" :key="cart.id">
    <li class="cart-list-con1">
      <input type="checkbox" name="chk_list" />
    </li>
    <li class="cart-list-con2">
      <img :src="cart.imgUrl" />
      <div class="item-msg">{{cart.skuName}}</div>
    </li>

    <li class="cart-list-con4">
      <span class="price">{{cart.skuPrice}}</span>
    </li>
    <li class="cart-list-con5">
      <a href="javascript:void(0)" class="mins">-</a>
      <input
        autocomplete="off"
        type="text"
        :value="cart.skuNum"
        minnum="1"
        class="itxt"
      />
      <a href="javascript:void(0)" class="plus">+</a>
    </li>
    <li class="cart-list-con6">
      <span class="sum">{{cart.skuPrice * cart.skuNum}}</span>
    </li>
    <li class="cart-list-con7">
      <a href="#none" class="sindelet">删除</a>
      <br />
      <a href="#none">移到收藏</a>
    </li>
  </ul>
</div>
```
