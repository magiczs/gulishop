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
