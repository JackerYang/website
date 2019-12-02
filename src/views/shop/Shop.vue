<template>
  <div>
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <router-view @set-bread="setBread" class="shop-view"></router-view>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
export default {
  name: "shop",
  components: {
    BreadCrumbs
  },
  data() {
    return {
      // 面包屑
      crumbImg: require("../../assets/img/icon.png"),
      crumbs: [
        {
          name: "商城"
        }
      ]
    };
  },
  methods: {
    setBread(val) {
      this.crumbs = val;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.shop-view {
  .content-width;
  margin: 50px auto 0;
}
</style>