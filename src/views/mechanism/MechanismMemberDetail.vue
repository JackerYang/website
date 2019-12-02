<template>
  <div class="mechanism-member-detail">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <div class="base">
        <img :src="currentMember.imgPath" alt="头像" />
        <div class="info">
          <p>职&emsp;&emsp;位：{{ currentMember.title }}</p>
          <p>姓&emsp;&emsp;名：{{ currentMember.name }}</p>
          <p>生&emsp;&emsp;日：{{ currentMember.birthday }}</p>
          <p>民&emsp;&emsp;族：{{ currentMember.nation }}</p>
          <p>面&emsp;&emsp;貌：{{ currentMember.politicCountenance }}</p>
          <p>工作日期：{{ currentMember.workDate }}</p>
        </div>
        <div class="introduce">
          <p>简&emsp;&emsp;介：</p>
          <div>
            <p v-html="currentMember.remark"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import { getMemberDetail } from "@/api/api";
export default {
  name: "mechanism-member-detail",
  components: {
    BreadCrumbs
  },
  data() {
    return {
      // 面包屑
      crumbImg: require("../../assets/img/icon.png"),
      crumbs: [
        {
          name: "机构设置"
        },
        {
          name: "主要成员",
          router: {
            name: "mechanism-member"
          }
        },
        {
          name: ""
        }
      ],

      currentMember: {}
    };
  },
  created() {
    let id = this.$route.path.split("/").reverse()[0];
    getMemberDetail(id).then(res => {
      if (res.data.res) {
        this.currentMember = res.data.data;
        this.crumbs[2].name = this.currentMember.name;
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.mechanism-member-detail {
  width: 100%;
  .content {
    .content-width;
    margin: 50px auto;
    @base-width: 100%;
    .base {
      width: @base-width;
      margin: 0 auto;
      position: relative;
      border-radius: 10px;
      box-shadow: 1px 1px 3px #ccc, -1px 1px 3px #ccc;
      padding: 40px;
      img {
        width: 150px;
        height: 210px;
        position: absolute;
        top: 40px;
        right: 40px;
      }
      .info {
        font-size: 16px;
        p {
          line-height: 30px;
          margin: 5px 0;
        }
      }
      .introduce {
        font-size: 16px;
        margin-top: 20px;
        border-top: 1px solid #ccc;
        padding-top: 20px;
        width: 100%;
        &:after {
          display: block;
          content: "";
          clear: both;
          visibility: hidden;
        }
        p {
          line-height: 30px;
          width: 5em;
          float: left;
        }
        div {
          width: ~"calc(100% - 5em)";
          float: right;
          text-align: justify;
          p {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
