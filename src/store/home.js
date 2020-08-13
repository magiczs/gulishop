import { reqCategoryList } from "@/api";
const state = {
  categoryList: [],
};
const mutations = {
  RECEIVECATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList;
  },
};

const actions = {
  async getCategoryList({ commit }) {
    // reqCategoryList().then((result) => {
    //   commit("RECEIVECATEGORYLIST", result.data);
    // });
    const result = await reqCategoryList()
    if (result.code === 200) {
      commit("RECEIVECATEGORYLIST", result.data);
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
