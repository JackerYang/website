const { api } = require("../../config");

import axios from "axios";
import { Message } from "iview";
import { getToken, delToken } from "../libs/token";

axios.defaults.baseURL = `${api}/api`;
axios.defaults.timeout = 3000;

// 添加请求拦截器 <==> 请求发起前做的事
axios.interceptors.request.use(
  config => {
    config.headers["type"] = "web";
    if (getToken()) {
      config.headers["X-Authorization"] = getToken();
    }
    return config;
  },
  error => {
    return Promise.resolve(error);
  }
);

// 添加响应拦截器 <==> 响应回来后做的事
axios.interceptors.response.use(
  response => {
    if (response.status === 200 && response.data.res !== true) {
      Message.error(response.data.msg);
    }
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      Message.error("账号权限过期！");
      delToken();
    } else {
      Message.error(error.message);
    }
    return Promise.resolve(error.response);
  }
);

export default axios;
