import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import home from "./home";
import search from "./search";
import detail from "./detail";
import shopcart from "./shopcart";
import trade from "./trade";
Vue.use(Vuex);

const state = {};
const mutations = {};
const actions = {};
const getters = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  //合并小的store到大的store中
  modules: {
    user,
    home,
    search,
    detail,
    shopcart,
    trade,
  },
});
