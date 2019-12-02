<template>
  <div class="chat-empty">
    <!-- 空白页 -->
    <div class="container">
      <div class="bg">
        <img :src="require('../../assets/img/logo.png')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat-empty"
};
</script>

<style lang="less" scoped>
.chat-empty {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f5f5f5;
  .container {
    width: 240px;
    height: 240px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .bg {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: auto;
        opacity: 0.1;
        user-select: none;
        -webkit-user-drag: none;
      }
    }
  }
}
</style>