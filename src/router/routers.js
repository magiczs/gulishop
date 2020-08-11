
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Search from "@/pages/Search";


export default [
  [
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
      path: "/",
      redirect: "/home",
    },
  ],
];
