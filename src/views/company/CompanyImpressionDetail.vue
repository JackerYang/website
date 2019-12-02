<template>
  <div class="company-impression-detail">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <h2>{{allData.title}}</h2>
      <hr />
      <p class="time">时间：{{allData.eventDate}}</p>
      <p class="sub">{{allData.subTitle}}</p>
      <img v-if="allData.imgPath" :src="allData.imgPath" />
      <p v-html="allData.content"></p>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import { getOrgImpressionDetail } from "@/api/api";
export default {
  name: "company-impression-detail",
  components: {
    BreadCrumbs
  },
  data() {
    return {
      // 面包屑
      crumbImg: require("../../assets/img/icon.png"),
      crumbs: [
        {
          name: "企业印象",
          router: {
            name: "company-impression"
          }
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
    getOrgImpressionDetail(id).then(res => {
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
.company-impression-detail {
  width: 100%;
  .content {
    .content-width;
    margin: 50px auto;
    text-align: center;
    h2 {
      margin: 20px 0;
    }
    .time {
      font-size: 14px;
      text-align: right;
      color: #ccc;
      margin: 20px 0;
    }
    .sub {
      text-align: center;
      font-size: 16px;
      margin-bottom: 40px;
      font-weight: bold;
    }
    img {
      max-width: 80%;
      margin-bottom: 40px;
    }
    & /deep/ p {
      font-size: 16px;
      margin: 10px 0;
      text-align: left;
      &:first-child {
        margin-top: 50px;
      }
    }
  }
}
</style>
