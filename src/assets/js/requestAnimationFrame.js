/**
 * @description window.requestAnimationFrame 多浏览器兼容问题补丁
 */

const requestAnimationFrame = {
  install: () => {
    if (!window.requestAnimationFrame) {
      let vendors = ["ms", "moz", "webkit", "o"];
      vendors.forEach(key => {
        window.requestAnimationFrame =
          window[vendors[key] + "RequestAnimationFrame"];
        window.cancelAnimationFrame =
          window[vendors[key] + "CancelAnimationFrame"] ||
          window[vendors[key] + "CancelRequestAnimationFrame"];
      });
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = callback => {
        let lastTime = 0;
        let currTime = new Date().getTime();
        let timeToCall = Math.max(0, 16 - (currTime - lastTime));
        let id = window.setTimeout(() => {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = id => {
        clearTimeout(id);
      };
    }
  }
};

export default requestAnimationFrame;
