<template>
  <div class="main-logo">
    <a href>
      <img :src="logo" alt="logo" />
      <h1>{{ name }}</h1>
    </a>
  </div>
</template>

<script>
export default {
  name: "main-logo",
  data() {
    return {
      logo: require("../../assets/img/logo.png"),
      name: "悦图遥感"
    };
  }
};
</script>

<style lang="less">
@import "../../assets/less/common.less";
.main-logo {
  position: absolute;
  top: 15px;
  left: 0;
  a {
    height: 56px;
    line-height: 56px;
    img {
      float: left;
      height: 56px;
      margin-right: 15px;
    }
    h1 {
      float: left;
      color: #fff;
    }
  }
}
</style>
