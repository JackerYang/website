/**
 * @desc 自定义插件（指令）v-xxx
 */

const directive = {
  install: Vue => {
    // 监控元素宽和高
    Vue.directive("elResize", {
      bind(el, binding) {
        setTimeout(() => {
          let origin = document.defaultView.getComputedStyle(el);
          let width = origin.width;
          let height = origin.height;
          function get() {
            let style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
              binding.value({ width, height });
            }
            width = style.width;
            height = style.height;
          }
          el.__myResize__ = setInterval(get, 500);
        }, 1000);
      },
      unbind(el) {
        clearInterval(el.__myResize__);
      }
    });

    // 监控元素宽和高
    Vue.directive("elLtWidth", {
      bind(el, binding) {
        function get() {
          let width = document.defaultView.getComputedStyle(el).width;
          binding.value({ width });
        }
        el.__myLtWidth__ = setInterval(get, 500);
      },
      unbind(el) {
        clearInterval(el.__myLtWidth__);
      }
    });

    // 点击其他元素
    Vue.directive("clickOutside", {
      bind(el, binding) {
        function documentHandler(e) {
          if (el.contains(e.target) || e.target.dataset.targetval === "view") {
            return false;
          }
          if (binding.expression) {
            binding.value(e);
          }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener("click", documentHandler);
      },
      unbind(el) {
        document.removeEventListener("click", el.__vueClickOutside__);
        delete el.__vueClickOutside__;
      }
    });

    // 拖拽
    Vue.directive("drag", {
      inserted(el) {
        el.setAttribute("style", "position: fixed; z-index: 9999");
      },

      bind(el) {
        el.setAttribute("draggable", true);
        let left, top, width, height;
        // 拖拽开始
        el._dragstart = event => {
          event.stopPropagation();
          left = event.clientX - el.offsetLeft;
          top = event.clientY - el.offsetTop;
          width = el.offsetWidth;
          height = el.offsetHeight;
        };
        // 防止被拖出边界
        el._checkPosition = () => {
          let width = el.offsetWidth;
          let height = el.offsetHeight;
          let left = Math.min(el.offsetLeft, document.body.clientWidth - width);
          left = Math.max(0, left);
          let top = Math.min(el.offsetTop, document.body.clientHeight - height);
          top = Math.max(0, top);
          el.style.left = left + "px";
          el.style.top = top + "px";
          el.style.width = width + "px";
          el.style.height = height + "px";
        };
        // 拖拽结束
        el._dragEnd = event => {
          event.stopPropagation();
          left = event.clientX - left;
          top = event.clientY - top;
          el.style.left = left + "px";
          el.style.top = top + "px";
          el.style.width = width + "px";
          el.style.height = height + "px";
          el._checkPosition();
        };
        el._documentAllowDraop = event => {
          event.preventDefault();
        };
        document.body.addEventListener("dragover", el._documentAllowDraop);
        el.addEventListener("dragstart", el._dragstart);
        el.addEventListener("dragend", el._dragEnd);
        window.addEventListener("resize", el._checkPosition);
      },

      unbind(el) {
        document.body.removeEventListener("dragover", el._documentAllowDraop);
        el.removeEventListener("dragstart", el._dragstart);
        el.removeEventListener("dragend", el._dragEnd);
        window.removeEventListener("resize", el._checkPosition);
        delete el._documentAllowDraop;
        delete el._dragstart;
        delete el._dragEnd;
        delete el._checkPosition;
      }
    });
  }
};

export default directive;
