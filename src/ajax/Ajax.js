import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const instance = axios.create({
  baseURL: "/api", //请求基础路径
  timeout: 20000, //请求超时时间
});

// 请求和响应拦截器;
instance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    // console.log(response);
    return response.data;
  },
  (error) => {
    NProgress.done();
    alert("发送请求失败:" + error.message || "未知错误");
    return new Promise(() => {});
  }
);

export default instance;