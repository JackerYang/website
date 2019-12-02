<template>
  <div class="the-swiper">
    <swiper ref="swiper" :options="swiperOption">
      <swiper-slide @click.native="viewDetail(item.id)" v-for="item in data" :key="item.id">
        <img :src="item.imgPath" />
        <p class="title">{{ item.title }}</p>
      </swiper-slide>
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
      <!-- <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-white" slot="button-next"></div>-->
    </swiper>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.min.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "the-swiper",
  props: {
    data: Array
  },
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        autoplay: {
          delay: 0,
          // delay: 5000, //自动切换的时间间隔，单位ms
          stopOnLastSlide: false, //当切换到最后一个slide时停止自动切换
          disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。
          reverseDirection: false, //开启反向自动轮播。
          waitForTransition: true //等待过渡完毕。自动切换会在slide过渡完毕后才开始计时。
        },
        speed: 3000,
        slidesPerView: 3,
        spaceBetween: 20,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: false,
        fadeEffect: {
          crossFade: false
        }
        // freeMode: true,
        // freeModeSticky: true
        // 分页
        // pagination: {
        //   el: ".swiper-pagination",
        //   clickable: true
        // },
        // 左右按钮
        // navigation: {
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev"
        // }
      }
    };
  },
  methods: {
    viewDetail(id) {
      this.$router.push({
        name: "company-achievement-detail",
        params: {
          id
        }
      });
    }
  },
  mounted() {
    let ele = this.$refs["swiper"].$el;
    let swiper = this.$refs["swiper"].swiper;

    ele.onmouseenter = () => {
      swiper.autoplay.stop();
    };
    ele.onmouseleave = () => {
      swiper.autoplay.start();
    };
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/common.less");
.the-swiper {
  width: 100%;
  height: 100%;
  .swiper-container {
    height: 100%;
    .swiper-slide {
      height: 100%;
      position: relative;
      cursor: pointer;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      p {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        background: rgba(0, 0, 0, 0.3);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &:hover {
        p {
          color: @main-color;
        }
      }
    }
  }
}
</style>