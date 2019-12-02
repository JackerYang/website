import { getPlate, getLoginUser } from "@/api/api";

export default {
  state: {
    plates: [],

    // 登录模态框状态
    loginShow: false,

    // 登录用户信息
    user: {},

    // 是否登录
    hasLogin: false
  },

  getters: {
    userName: state => state.user.userName,
    hasPermission: state => !!state.user.haveAuthority,
    userAvatar: state => state.user.imgPath,
    isCustomerService: state => !!state.user.isCustomerService
  },

  mutations: {
    CHANGE_PLATES: (state, data) => (state.plates = data),

    // 登录模态框状态
    CHANGE_LOGIN_SHOW: (state, data) => (state.loginShow = data),

    // 登录用户信息
    CHANGE_USER_INFO: (state, data) => (state.user = data),

    // 是否登录
    CHANGE_HAS_LOGIN: (state, data) => (state.hasLogin = data)
  },

  actions: {
    getPlate: async ({ commit }) => {
      let res = await getPlate();
      if (res.data.res) {
        commit("CHANGE_PLATES", res.data.data);
      }
    },

    getUserInfo: async ({ commit }, callback) => {
      let res = await getLoginUser();
      if (res.data.res) {
        commit("CHANGE_USER_INFO", res.data.data);
      } else {
        commit("CHANGE_HAS_LOGIN", false);
      }
      callback && callback();
    }
  }
};
