/**
 * @description 绑定事件 on(ele, event, handler)
 * @param {Object} ele 元素
 * @param {String} event 事件
 * @param {Function} handler 事件
 * @return {null}
 */
export const on = (ele, event, handler) => {
  if (ele && event && handler) {
    if (document.addEventListener) {
      ele.addEventListener(event, handler, false);
    } else {
      ele.attachEvent("on" + event, handler);
    }
  }
};

/**
 * @description 解绑事件 off(ele, event, handler)
 * @param {Object} ele 元素
 * @param {String} event 事件
 * @param {Function} handler 事件
 * @return {null}
 */
export const off = (ele, event, handler) => {
  if (ele && event && handler) {
    if (document.removeEventListener) {
      ele.removeEventListener(event, handler, false);
    } else {
      ele.detachEvent("on" + event, handler);
    }
  }
};

/**
 * @description getSelection、createRange兼容
 */
export const isSupportRange = () => {
  return (
    typeof document.createRange === "function" ||
    typeof window.getSelection === "function"
  );
};

/**
 * @description 获取光标位置
 */
export const getCurrentRange = () => {
  let range = null;
  let selection = null;
  if (isSupportRange()) {
    selection = document.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
      range = document.getSelection().getRangeAt(0);
    }
  } else {
    range = document.selection.createRange();
  }
  return range;
};

/**
 * @description 插入内容
 */
export const insertHtmlAfterRange = html => {
  let selection = null;
  let range = null;

  if (isSupportRange()) {
    // IE > 9 and 其它浏览器
    selection = window.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
      let fragment, node, lastNode;
      range = selection.getRangeAt(0);
      range.deleteContents();
      let _el = document.createElement("div");
      _el.innerHTML = html || "";
      // 创建空文档对象,IE > 8支持documentFragment
      fragment = document.createDocumentFragment();

      while ((node = _el.firstChild)) {
        lastNode = fragment.appendChild(node);
      }
      range.insertNode(fragment);

      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html || "");
  }
};

/**
 * @description base64 转为 blob
 * @param {String} base64
 * @return {blob}
 */
export const base64ToBlob = base64 => {
  let arr = base64.split(",");
  let mime = arr[0].match(/:(.*?);/)[1] || "image/png";
  // 去掉url的头，并转化为byte
  let bytes = window.atob(arr[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  let ia = new Uint8Array(ab);

  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }

  return new Blob([ab], {
    type: mime
  });
};

/**
 * @description string 转为 ArrayBuffer
 * @param {String} str
 * @return {buff}
 */

export const stringToArrayBuffer = str => {
  // 首先将字符串转为16进制
  let val = "";
  for (let i = 0; i < str.length; i++) {
    if (val === "") {
      val = str.charCodeAt(i).toString(16);
    } else {
      val += "," + str.charCodeAt(i).toString(16);
    }
  }
  // 将16进制转化为ArrayBuffer
  return new Uint8Array(
    val.match(/[\da-f]{2}/gi).map(h => {
      return parseInt(h, 16);
    })
  ).buffer;
};

/**
 * @description 下载文件
 * @param {String} url
 * @param {String} fileName
 * @return {null}
 */
export const downloadFile = (url, fileName = "") => {
  let ele = document.createElement("a");
  ele.download = fileName;
  ele.style.display = "none";
  ele.href = url;
  // 受浏览器安全策略的因素，动态创建的元素必须添加到浏览器后才能实施点击
  document.body.appendChild(ele);
  // 触发点击
  ele.click();
  // 然后移除
  document.body.removeChild(ele);
};

/**
 * @description 将数字转换为长度是4的数字字符串
 * @param {Number} index
 */
export const toFourString = index => {
  if (!index && index !== 0) {
    throw new Error("index必传！");
  }
  if (index > 9999) {
    throw new Error("index取值不合理！");
  }
  let str = "000" + index;
  return str.substr(str.length - 4);
};

/**
 * @description 判断字符串是否是ip
 * @param {String} str
 * @return {Boolean}
 */
export const isIp = str => {
  let ipReg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //正则表达式
  return ipReg.test(str);
};
