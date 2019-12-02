/**
 * @description token 存在于sessionStorage的名称
 */
const TOKEN_KEY = "X-website-token";

/**
 * @description 获取token
 */
export const getToken = () => {
  if (sessionStorage[TOKEN_KEY]) {
    return sessionStorage[TOKEN_KEY];
  }
  return null;
};

/**
 * @description 设置token
 * @param {String} token
 */
export const setToken = token => {
  sessionStorage[TOKEN_KEY] = token;
};

/**
 * @description 删除token
 */
export const delToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};
