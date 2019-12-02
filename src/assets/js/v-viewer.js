/**
 * @desc 图片预览组件
 */
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

Viewer.setDefaults({
  zIndexInline: 9999,
  title: false,
  url(image) {
    if (image.src.indexOf("-yasuo") > -1) {
      return image.id;
    }
    return image.src;
  }
});

const viewer = {
  install: Vue => {
    Vue.component("Viewer", Viewer);
  }
};

export default viewer;
