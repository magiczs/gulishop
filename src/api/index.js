//所有接口请求函数的文件
import Ajax from "@/ajax/Ajax"; //引入封装后的axios
import mockAjax from "@/ajax/mockAjax"; //引入封装后的axios

export const reqCategoryList = () => {
  return Ajax({
    url: "/product/getBaseCategoryList",
    method: "get",
  });
};

// reqCategoryList();

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

export const reqGoodsListInfo = (searchParams) => {
  return Ajax({
    url: "/list",
    method: "post",
    data: searchParams,
  });
};

export const reqGoodsDetailInfo = (skuId) => {
  return Ajax({
    url: `/item/${skuId}`,
    method: "get",
  });
};

//请求添加购物车(或者修改购物车数量)
// /api/cart/addToCart/{ skuId }/{ skuNum }  post
export const reqAddOrUpdateCart = (skuId, skuNum) => {
  return Ajax({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: "post",
  });
};

//请求购物车列表数据
///api/cart/cartList  get  无
export const reqShopCartList = () => {
  return Ajax({
    url: "/cart/cartList",
    method: "get",
  });
};

export const reqUpdateIsCheck = (skuId, isChecked) => {
  return Ajax({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: "get",
  });
};

export const reqDeleteCart = (skuId) => {
  return Ajax({
    url: `/cart/deleteCart/${skuId}`,
    method: "delete",
  });
};

//请求注册  /api/user/passport/register  post {mobile,password,code}
export const reqRegister = (userInfo) => {
  return Ajax({
    url: "/user/passport/register",
    method: "post",
    data: userInfo,
  });
};

//请求登录 /api/user/passport/login  post {mobile,password}
export const reqLogin = (userInfo) => {
  return Ajax({
    url: "/user/passport/login",
    method: "post",
    data: userInfo,
  });
};

//请求退出登录  /api/user/passport/logout
export const reqLogout = () => {
  return Ajax({
    url: "/user/passport/logout",
    method: "get",
  });
};

//请求创建订单交易的数据  /api/order/auth/trade  get
export const reqTradeInfo = () => {
  return Ajax({
    url: "/order/auth/trade",
    method: "get",
  });
};

//请求创建提交订单  /api/order/auth/submitOrder?tradeNo={tradeNo}  post
export const reqSubmitOrder = (tradeNo, tradeInfo) => {
  return Ajax({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: "post",
    data: tradeInfo,
  });
};

//获取支付页面的支付信息   /api/payment/weixin/createNative/{orderId}  get
export const reqPayInfo = (orderId) => {
  return Ajax({
    url: `/payment/weixin/createNative/${orderId}`,
    method: "get",
  });
};

//获取订单支付状态的信息  /api/payment/weixin/queryPayStatus/{orderId}  get
export const reqOrderStatus = (orderId) => {
  return Ajax({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: "get",
  });
};
