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
  async getGoodsListInfo({ commit }, searchParams) {
    const result = await reqGoodsListInfo(searchParams);
    if (result.code === 200) {
      commit("RECEIVEGOODSLISTINFO", result.data);
    }
  },
};
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

export default {
  state,
  mutations,
  actions,
  getters,
};
