import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

export default [
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
    path: "/search",
    component: Search,
    name: "search",
    // props: true,
    props(route) {
      return {
        keyword: route.params.keyword,
        keyword2: route.query.keyword,
      };
    },
  },
  {
    path: "/",
    redirect: "/home",
  },
];
