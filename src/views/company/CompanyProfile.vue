<template>
  <div class="company-profile">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <template v-if="content">
        <h2>企业简介</h2>
        <p v-html="content"></p>
      </template>
      <the-empty v-else></the-empty>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import { getOrgProfile } from "@/api/api";
import TheEmpty from "../../components/common/TheEmpty.vue";
export default {
  name: "company-profile",
  components: {
    BreadCrumbs,
    TheEmpty
  },
  data() {
    return {
      // 面包屑
      crumbImg: require("../../assets/img/icon.png"),
      crumbs: [
        {
          name: "企业概况"
        },
        {
          name: "企业简介"
        }
      ],

      content: ""
    };
  },
  created() {
    getOrgProfile().then(res => {
      if (res.data.res) {
        this.content = res.data.data.content;
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.company-profile {
  width: 100%;
  .content {
    .content-width;
    height: 100%;
    margin: 0 auto;
    h2 {
      margin: 50px 0;
      text-align: center;
    }
    & /deep/ p {
      margin: 10px 0;
      font-size: 16px;
    }
    & /deep/ img {
      max-width: 100%;
    }
    .the-empty {
      margin-top: 60px;
    }
  }
}
</style>
