import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Detail from "@/pages/Detail";
import AddCartSuccess from "@/pages/AddCartSuccess";
import ShopCart from "@/pages/ShopCart";

export default [
  {
    path: "/shopcart",
    component: ShopCart,
  },
  {
    path: "/addCartSuccess",
    component: AddCartSuccess,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
    meta: {
      isHide: true,
    },
  },
  {
    path: "/register",
    component: Register,
    meta: {
      isHide: true,
    },
  },
  {
    path: "/search/:keyword?",
    component: Search,
    name: "search",
    // props: true,
    // props(route) {
    //   return {
    //     keyword: route.params.keyword,
    //     keyword2: route.query.keyword,
    //   };
    // },
  },
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/detail/:skuId",
    component: Detail,
  },
];
