import {
  reqAddOrUpdateCart,
  reqShopCartList,
  reqUpdateIsCheck,
  reqDeleteCart,
} from "@/api";

const state = {
  shopCartList: [],
};
const mutations = {
  RECEIVESHOPCARTLIST(state, shopCartList) {
    state.shopCartList = shopCartList;
  },
};
const actions = {
  async addOrUpdateCart({ commit }, { skuId, skuNum }) {
    const result = await reqAddOrUpdateCart(skuId, skuNum);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },

  async getShopCartList({ commit }) {
    const result = await reqShopCartList();
    if (result.code === 200) {
      commit("RECEIVESHOPCARTLIST", result.data);
    }
  },

  async updateIsCheck({ commit }, { skuId, isChecked }) {
    const result = await reqUpdateIsCheck(skuId, isChecked);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },
  async updateAllIsCheck({ commit, state, dispatch }, isChecked) {
    let promises = [];
    state.shopCartList.forEach((item) => {
      if (item.isChecked === isChecked) return;
      let promise = dispatch("updateIsCheck", { skuId: item.skuId, isChecked });
      promises.push(promise);
    });
    return Promise.all(promises);
  },

  async deleteCart({ commit }, skuId) {
    const result = await reqDeleteCart(skuId);
    if (result.code === 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },

  async deleteAllCheckCart({ commit, state, dispatch }) {
    let promises = [];
    state.shopCartList.forEach((item) => {
      if (item.isChecked === 0) return;
      let promise = dispatch("deleteCart", item.skuId);
      promises.push(promise);
    });
    return Promise.all(promises);
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
