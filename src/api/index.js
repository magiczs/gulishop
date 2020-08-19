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
