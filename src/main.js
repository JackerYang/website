import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import iview from "./assets/js/iview";
import Vue2OrgTree from "vue2-org-tree";
import plugin from "./assets/js/directive";
import requestAnimationFrame from "./assets/js/requestAnimationFrame";

import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

import contentmenu from "v-contextmenu";
import "v-contextmenu/dist/index.css";

Vue.use(iview);
Vue.use(plugin);
Vue.use(Vue2OrgTree);
Vue.use(requestAnimationFrame);
Vue.use(Viewer);
Vue.use(contentmenu);

Viewer.setDefaults({
  zIndexInline: 9999,
  title: false,
  url(image) {
    return image.id;
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
