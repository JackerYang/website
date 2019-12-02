<template>
  <div class="bread-crumbs">
    <div class="content">
      <div class="left">
        <img :src="icon" />
        <Breadcrumb>
          <BreadcrumbItem
            v-for="label in data"
            :key="label.name"
            :to="label.router"
          >{{ label.name }}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="right">
        <Tooltip content="返回" placement="left">
          <Icon @click="back" type="ios-redo" />
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bread-crumbs",
  props: {
    // 小图片
    icon: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.bread-crumbs {
  width: 100%;
  height: 50px;
  background: #eee;
  .content {
    .content-width;
    height: 50px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      img {
        width: auto;
        height: 24px;
        margin: 13px 10px;
      }
    }
    .right {
      font-size: 24px;
      .ivu-icon {
        -moz-transform: scalesX(-1);
        -webkit-transform: scsaleX(-1);
        -o-transform: scaleX(-1);
        transform: scaleX(-1);
        /*IE*/
        filter: FlipH;
        cursor: pointer;
        &:hover {
          color: @main-color;
        }
      }
    }
  }
}
</style>
