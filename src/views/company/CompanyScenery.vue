<template>
  <div class="company-scenery">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <div class="carousel" v-if="carousels.length">
        <Carousel
          v-model="currentCarousel"
          :autoplay="setting.autoplay"
          :autoplay-speed="setting.autoplaySpeed"
          :dots="setting.dots"
          :radius-dot="setting.radiusDot"
          :trigger="setting.trigger"
          :arrow="setting.arrow"
          :loop="setting.loop"
        >
          <CarouselItem v-for="carousel in carousels" :key="carousel.id">
            <img :src="carousel.imgPath" alt="企业风光" />
          </CarouselItem>
        </Carousel>

        <div class="show">
          <p>{{ carousels[currentCarousel] && carousels[currentCarousel].title }}</p>
          <div class="total">
            <span class="curr">{{ currentCarousel + 1 }}</span>
            <span class="line">|</span>
            <span class="all">{{ carousels.length }}</span>
          </div>
        </div>
      </div>
      <the-empty v-else></the-empty>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import TheEmpty from "../../components/common/TheEmpty.vue";
import { getOrgScenery } from "@/api/api";
export default {
  name: "company-scenery",
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
          name: "企业风光"
        }
      ],

      // 轮播图
      currentCarousel: 0,
      setting: {
        autoplay: true,
        autoplaySpeed: 5000,
        dots: "none",
        radiusDot: false,
        trigger: "click",
        arrow: "hover",
        loop: true
      },
      carousels: []
    };
  },
  created() {
    getOrgScenery().then(res => {
      if (res.data.res) {
        this.carousels = res.data.data;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.company-scenery {
  width: 100%;
  .content {
    width: 620px;
    margin: 0 auto;
    .carousel {
      margin: 80px 0;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 10px;
      img {
        width: 100%;
        height: 400px;
      }
    }
    .show {
      text-align: center;
      position: relative;
      p {
        font-size: 16px;
        margin: 15px 0;
      }
      .total {
        font-size: 16px;
        .curr {
          position: absolute;
          top: 8px;
          left: 30px;
          text-align: right;
        }
        .line {
          position: absolute;
          top: 6px;
          left: 50px;
          color: #aaa;
        }
        .all {
          position: absolute;
          top: 8px;
          left: 65px;
          color: #aaa;
        }
      }
    }
    .the-empty {
      margin-top: 60px;
    }
  }
}
</style>
