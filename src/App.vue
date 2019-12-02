<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { setToken } from "./libs/token";
export default {
  name: "App",
  beforeCreate() {
    const { search, hostname, origin } = window.location;
    // 路径中包含token
    if (search.indexOf("token") > -1) {
      let token = search.split("token=")[1];
      setToken(token);
      window.location.href = origin;
    }
  }
};
</script>

<style lang="less">
@import "./assets/less/common.less";
// iview 样式
@import "~iview/src/styles/index.less";
@primary-color: @main-color;
// 初始化 样式
@import "./assets/less/reset.less";
</style>
