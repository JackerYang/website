<template>
  <div class="home">
    <div class="items" v-for="type in allData" :key="type.id">
      <div class="title">
        <img :src="type.plateIcon" />
        {{ type.plateName }}
        <span class="more" @click="viewMore(type.id)" title="查看更多">
          <Icon type="ios-arrow-forward" />
        </span>
      </div>
      <div class="content clearfloat">
        <div
          :class="['left', type.articles[0].imgPath ? '' : 'full']"
          v-for="article, index in type.articles"
          @click="viewDetail(type.id, article.id)"
          :key="article.id"
          v-if="index === 0"
        >
          <img v-if="type.articles[0].imgPath" :src="article.imgPath" />
          <h3>
            <span v-if="!type.articles[0].imgPath">●</span>
            {{ article.title }}
          </h3>
          <p v-html="article.content"></p>
        </div>

        <div
          :class="['right', type.articles[0].imgPath ? '' : 'full']"
          v-for="article, index in type.articles"
          @click="viewDetail(type.id, article.id)"
          :key="article.id"
          v-if="index > 0 && index < 4"
        >
          <div class="list">
            <h4>
              <span>●</span>
              {{ article.title }}
            </h4>
            <p v-html="article.content"></p>
          </div>
        </div>
      </div>
      <the-empty v-if="!type.articles.length"></the-empty>
    </div>
    <div class="items"></div>
    <the-empty v-if="!allData.length"></the-empty>
    <div class="swiper">
      <div class="title">
        <img :src="require('../assets/img/icon.png')" />
        <span>企业成果</span>
      </div>
      <the-swiper v-if="achievements.length && show" :data="achievements"></the-swiper>
      <the-empty v-if="!achievements.length"></the-empty>
    </div>
  </div>
</template>

<script>
import { getPlateInfoFor3, getOrgAchievement } from "@/api/api";
import TheEmpty from "../components/common/TheEmpty.vue";
import TheSwiper from "../components/common/TheSwiper.vue";
export default {
  name: "home",
  components: {
    TheEmpty,
    TheSwiper
  },
  computed: {
    plates() {
      return this.$store.state.common.plates;
    }
  },
  data() {
    return {
      infos: [],
      allData: [],
      achievements: [],
      show: false
    };
  },
  methods: {
    // 查看详情
    viewDetail(id, _id) {
      this.$router.push({
        name: "template-detail",
        params: { id, _id }
      });
    },
    // 数据初始化
    init() {
      this.allData = JSON.parse(JSON.stringify(this.plates)).map(item => {
        item.articles = this.infos.filter(v => v.plate === item.id);
        return item;
      });
    },

    // 查看更多
    viewMore(id) {
      this.$router.push({
        name: "template-list",
        params: {
          id
        }
      });
    }
  },
  watch: {
    plates() {
      this.init();
    }
  },
  created() {
    getPlateInfoFor3().then(res => {
      if (res.data.res) {
        this.infos = res.data.data.map(v => {
          v.content = v.content.replace(/<[^>]+>/g, "").slice(0, 36) + "...";
          return v;
        });
        this.init();
      }
    });
    getOrgAchievement().then(res => {
      if (res.data.res) {
        this.achievements = res.data.data;
        this.show = true;
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "../assets/less/common.less";
.home {
  .content-width;
  margin: 40px auto;
  text-align: center;
  .items {
    text-align: left;
    width: 49%;
    &:nth-child(odd) {
      margin-right: 2%;
    }
    display: inline-block;
    min-width: 450px;
    margin: 15px 0;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: @main-color;
      padding: 0 10px;
      font-size: 16px;
      color: #fff;
      border: 1px solid #eee;
      img {
        width: 28px;
        height: 28px;
        margin-right: 5px;
        vertical-align: middle;
        position: relative;
        top: -3px;
        padding: 1px;
        border: 1px solid #fff;
      }
      .more {
        float: right;
        cursor: pointer;
        .ivu-icon {
          font-size: 26px;
          position: relative;
          top: -2px;
        }
      }
    }
    .content {
      width: 100%;
      margin: 10px 0;
      .left {
        width: 46%;
        float: left;
        box-shadow: 1px 1px 3px #ccc;
        cursor: pointer;
        position: relative;
        top: 0;
        transition: all 0.3s;
        img {
          width: 100%;
          height: 175px;
          overflow: hidden;
        }
        h3 {
          text-align: center;
          transition: all 0.3s;
          span {
            color: @main-color;
          }
        }
        p {
          padding: 10px;
        }
        &:hover {
          top: -2px;
          h3 {
            color: @main-color;
          }
        }
        &.full {
          width: 100%;
          border-bottom: 1px solid #efefef;
          box-shadow: none;
          &:hover {
            top: 0;
            background: #efefef;
          }
          p {
            padding-top: 5px;
          }
          h3 {
            text-align: left;
            padding: 10px 0 0 10px;
          }
        }
      }
      .right {
        width: 51%;
        float: right;
        &:not(:last-of-type) {
          border-bottom: 1px solid #efefef;
        }
        &.full {
          width: 100%;
        }
        .list {
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s;
          h4 {
            font-size: 14px;
            transition: all 0.3s;
            margin-bottom: 5px;
            span {
              color: @main-color;
            }
          }
          &:hover {
            background: #efefef;
            h4 {
              color: @main-color;
            }
          }
        }
      }
    }
  }
  .swiper {
    width: 100%;
    height: 280px;
    padding: 10px 0;
    margin: 50px 0;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: @main-color;
      padding: 0 10px;
      font-size: 16px;
      color: #fff;
      border: 1px solid #eee;
      text-align: left;
      margin-bottom: 20px;
      img {
        width: 28px;
        height: 28px;
        margin-right: 5px;
        vertical-align: middle;
        position: relative;
        top: -3px;
        padding: 1px;
        border: 1px solid #fff;
      }
    }
  }
}
</style>
