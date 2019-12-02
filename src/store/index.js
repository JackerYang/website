import Vue from "vue";
import Vuex from "vuex";
import common from "./modules/common";
import shop from "./modules/shop";
import chat from "./modules/chat";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    shop,
    chat
  }
});
