<template>
  <div class="main-carousel">
    <Carousel
      v-if="showCarousel"
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
        <img :src="carousel.imgPath" alt="企业印象" />
        <div class="container">
          <p>{{ carousel.title }}</p>
        </div>
      </CarouselItem>
    </Carousel>
    <img v-if="bgImg" :src="bgImg" />
  </div>
</template>

<script>
import { getOrgImpressionCarousel } from "@/api/api";
export default {
  name: "main-carousel",
  computed: {
    plates() {
      return this.$store.state.common.plates;
    }
  },
  data() {
    return {
      currentCarousel: 0,
      showCarousel: true,
      setting: {
        autoplay: true,
        autoplaySpeed: 5000,
        dots: "inside",
        radiusDot: false,
        trigger: "click",
        arrow: "hover",
        loop: true
      },
      carousels: [],
      bgImg: ""
    };
  },
  methods: {
    init() {
      let path = this.$route.path;
      if (path.indexOf("/template/list/") > -1) {
        this.showCarousel = false;
        let id = 0;
        if (path.indexOf("detail") > -1) {
          id = path.split("/").reverse()[2];
        } else {
          id = path.split("/").reverse()[0];
        }
        id = Number(id);
        this.bgImg = this.plates.filter(item => item.id === id)[0].plateImg;
      } else {
        this.bgImg = "";
        this.showCarousel = true;
      }
    }
  },
  watch: {
    $route() {
      this.init();
    },
    plates() {
      this.init();
    }
  },
  created() {
    getOrgImpressionCarousel().then(res => {
      if (res.data.res) {
        this.carousels = res.data.data;
      }
    });
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");
.main-carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #ccc;
  .ivu-carousel-item {
    width: 100%;
    height: 220px !important;
    img {
      width: 100%;
      height: 220px;
    }
    .container {
      position: relative;
      .content-width;
      height: 220px;
      margin: 0 auto;
      top: -220px;
      p {
        position: absolute;
        left: 0;
        bottom: 10px;
        color: #fff;
        font-size: 14px;
        padding: 3px 8px;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.3);
      }
    }
  }
  img {
    width: 100%;
    height: 220px;
  }
}
</style>
