<template>
  <div class="company-achievement-detail">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <h2>{{allData.title}}</h2>
      <p class="time">{{allData.subTitle}} · 时间：{{allData.eventDate}}</p>
      <p v-html="allData.content"></p>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import { getOrgAchievementDetail } from "@/api/api";
export default {
  name: "company-achievement-detail",
  components: {
    BreadCrumbs
  },
  data() {
    return {
      // 面包屑
      crumbImg: require("../../assets/img/icon.png"),
      crumbs: [
        {
          name: "企业成果"
        },
        {
          name: "重大事件"
        }
      ],

      allData: {}
    };
  },
  created() {
    let id = this.$route.path.split("/").reverse()[0];
    getOrgAchievementDetail(id).then(res => {
      if (res.data.res) {
        this.allData = res.data.data;
        this.crumbs[1].name = this.allData.title;
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.company-achievement-detail {
  width: 100%;
  .content {
    .content-width;
    margin: 50px auto;
    h2 {
      margin: 30px 0;
      text-align: center;
    }
    .time {
      font-size: 14px;
      text-align: right;
      color: #ccc;
      margin: 20px 0;
    }
    & /deep/ p {
      font-size: 16px;
      margin: 10px 0;
      &:first-child {
        margin-top: 50px;
      }
    }
  }
}
</style>
