<template>
  <div class="the-empty">
    <img :src="src" />
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {
  name: "the-empty",
  data() {
    return {
      src: require("../../assets/img/empty.svg")
    };
  }
};
</script>

<style lang="less" scoped>
.the-empty {
  width: 100%;
  padding: 20px 0;
  text-align: center;
  border: 1px solid #efefef;
  background: #fcfcfc;
  color: #999;
  img {
    width: 184px;
    height: auto;
  }
  p {
    font-size: 12px !important;
    margin: 0 !important;
  }
}
</style>
