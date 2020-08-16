import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const mockAjax = axios.create({
  baseURL: "/mock", //请求基础路径
  timeout: 20000, //请求超时时间
});

// 请求和响应拦截器;
mockAjax.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

mockAjax.interceptors.response.use(
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

export default mockAjax;
