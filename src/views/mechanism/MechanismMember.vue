<template>
  <div class="mechanism-member">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <template v-if="members.length">
        <div class="items" v-for="member in members" :key="member.id">
          <div class="title">{{ member.title }}</div>
          <div class="main">
            <img :src="member.imgPath" />
            <div class="info">
              <p>{{ member.name }}</p>
              <p>{{ member.birthday }}生</p>
              <p>{{ member.nation }}</p>
              <p>{{ member.politicCountenance }}</p>
              <p>{{ member.workDate }}工作</p>
              <p @click="viewDetail(member.id)" class="more">
                <span>阅读全部</span>
                <Icon type="md-arrow-dropright" />
              </p>
            </div>
          </div>
        </div>
        <div class="items" v-for="n in 3" :key="n.id"></div>
      </template>
      <the-empty v-else></the-empty>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import TheEmpty from "../../components/common/TheEmpty.vue";
import { getMember } from "@/api/api";
export default {
  name: "mechanism-member",
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
          name: "机构设置"
        },
        {
          name: "主要成员"
        }
      ],

      members: []
    };
  },
  methods: {
    viewDetail(id) {
      this.$router.push({
        name: "mechanism-member-detail",
        params: { id }
      });
    }
  },
  created() {
    getMember().then(res => {
      if (res.data.res) {
        this.members = res.data.data;
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.mechanism-member {
  width: 100%;
  .content {
    .content-width;
    height: 100%;
    margin: 50px auto;
    text-align: center;
    &:after {
      display: block;
      content: "";
      clear: both;
      visibility: hidden;
    }
    .items {
      width: 25%;
      min-width: 292.5px;
      padding: 10px;
      display: inline-block;
      .title {
        text-align: left;
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        background: rgba(248, 222, 170, 0.5);
        border-left: 5px solid @main-color;
        margin-bottom: 10px;
      }
      .main {
        width: 100%;
        img {
          float: left;
          width: 120px;
          height: 170px;
          padding: 5px;
          border: 1px solid #ccc;
          margin-right: 15px;
        }
        .info {
          text-align: left;
          height: 170px;
          position: relative;
          p {
            font-size: 16px;
          }
          .more {
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 14px;
            color: #999;
            cursor: pointer;
            .ivu-icon {
              font-size: 22px;
              position: relative;
              top: -1px;
            }
            &:hover {
              color: @main-color;
            }
          }
        }
      }
    }
    .the-empty {
      margin-top: 60px;
    }
  }
}
</style>
