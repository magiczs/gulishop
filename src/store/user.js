import { getUserTempId } from "@/utils/userabout";
import { reqRegister, reqLogin, reqLogout } from "@/api";
const state = {
  userTempId: getUserTempId(),
  userInfo: JSON.parse(localStorage.getItem("USERINFO_KEY")) || {},
};
const mutations = {
  RECEIVEUSERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },

  RESETUSERINFO(state) {
    state.userInfo = {};
  },
};
const actions = {
  async register({ commit }, userInfo) {
    const result = await reqRegister(userInfo);
    if (result.code === 200) {
      return "ok";
    } else {
      // return Promise.reject(new Error(`注册失败,${result.data}`));
      throw Error(`注册失败,${result.data}`);
    }
  },

  async login({ commit }, userInfo) {
    const result = await reqLogin(userInfo);
    if (result.code === 200) {
      commit("RECEIVEUSERINFO", result.data);
      localStorage.setItem("USERINFO_KEY", JSON.stringify(result.data));
      return "ok";
    } else {
      return Promise.reject(new Error(result.message));
    }
  },

  async logout({ commit }) {
    const result = await reqLogout();
    if (result.code === 200) {
      //清空 localStorage当中的用户数据
      //清空 state当中的userInfo数据
      localStorage.removeItem("USERINFO_KEY");
      commit("RESETUSERINFO");
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },
};
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
