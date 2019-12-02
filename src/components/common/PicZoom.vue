<template>
  <div class="pic-zoom">
    <div class="img-container" @mousemove="mouseMove($event)" @mouseleave="mouseLeave($event)">
      <img ref="img" @load="imgLoaded" :src="url" />
      <div
        class="img-selector"
        v-if="imgLoadedFlag"
        :style="[imgSelectorSize, imgSelectorPosition]"
      ></div>
      <div
        v-if="!hideOutShow"
        class="img-out-show"
        :style="[imgOutShowSize, imgSelectorBg, imgBgPosition]"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pic-zoom",
  data() {
    return {
      selector: {
        width: 166,
        halfWidth: 83,
        top: 0,
        left: 0,
        bgTop: 0,
        bgLeft: 0,
        rightBound: 0,
        bottomBound: 0,
        absoluteLeft: 0,
        absoluteTop: 0
      },
      imgInfo: {},
      hideOutShow: true,
      imgLoadedFlag: false,
      screenWidth: document.body.clientWidth,
      timer: null
    };
  },
  props: {
    url: String,
    scale: {
      type: Number,
      default: 2.5
    }
  },
  watch: {
    url() {
      this.imgLoadedFlag = false;
    },
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = setTimeout(() => {
          this.imgLoaded();
          clearTimeout(this.timer);
          this.timer = null;
        }, 400);
      }
    }
  },
  computed: {
    imgSelectorPosition() {
      let { top, left } = this.selector;
      return {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    imgSelectorSize() {
      let width = this.selector.width;
      return {
        width: `${width}px`,
        height: `${width}px`
      };
    },
    imgOutShowSize() {
      let {
        scale,
        selector: { width }
      } = this;
      return {
        width: `${width * scale}px`,
        height: `${width * scale}px`
      };
    },
    imgSelectorBg() {
      let {
        scale,
        url,
        imgInfo: { height, width }
      } = this;
      return {
        backgroundImage: `url(${encodeURI(url)})`,
        backgroundSize: `${width * scale}px ${height * scale}px`
      };
    },
    imgBgPosition() {
      let { bgLeft, bgTop } = this.selector;
      return {
        backgroundPosition: `${bgLeft}px ${bgTop}px`
      };
    }
  },
  methods: {
    imgLoaded() {
      let imgInfo = this.$refs["img"].getBoundingClientRect();
      if (JSON.stringify(this.imgInfo) === JSON.stringify(imgInfo)) {
        // 位置不变不更新
        return;
      }
      let { width, height, left, top } = (this.imgInfo = imgInfo);
      let selector = this.selector;
      let { width: selectorWidth, halfWidth: selectorHalfWidth } = selector;
      let { scrollLeft, scrollTop } = document.documentElement;
      selector.rightBound = width - selectorWidth;
      selector.bottomBound = height - selectorWidth;
      selector.absoluteLeft = left + selectorHalfWidth + scrollLeft;
      selector.absoluteTop = top + selectorHalfWidth + scrollTop;
    },
    mouseMove(e) {
      this.imgLoadedFlag = true;
      this.imgLoaded(); //防止img位置变化
      let { pageX, pageY } = e;
      let { scale, selector } = this;
      let {
        width,
        halfWidth,
        absoluteLeft,
        absoluteTop,
        rightBound,
        bottomBound
      } = selector;
      let x = pageX - absoluteLeft; // 选择器的x坐标 相对于图片
      let y = pageY - absoluteTop; // 选择器的y坐标
      halfWidth = 0;
      this.hideOutShow = false;
      selector.top = y > 0 ? (y < bottomBound ? y : bottomBound) : 0;
      selector.left = x > 0 ? (x < rightBound ? x : rightBound) : 0;
      // 选择器图片的坐标位置
      let left = halfWidth - (halfWidth + x) * scale;
      let top = halfWidth - (halfWidth + y) * scale;
      selector.bgLeft =
        left >= 0
          ? 0
          : left <= (width - 415) * scale
          ? (width - 415) * scale
          : left;
      selector.bgTop =
        top >= 0
          ? 0
          : top <= (width - 415) * scale
          ? (width - 415) * scale
          : top;
    },
    mouseLeave() {
      this.hideOutShow = true;
      this.imgLoadedFlag = false;
    }
  }
};
</script>

<style lang="less" scoped>
.pic-zoom {
  width: 415px;
  height: 415px;
  .img-container {
    width: 100%;
    height: 100%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .img-selector {
      background-color: rgba(0, 0, 0, 0.6);
      position: absolute;
      background-repeat: no-repeat;
      cursor: move;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .img-out-show {
      position: absolute;
      top: 0;
      left: 100%;
      background-repeat: no-repeat;
      border: 1px solid rgba(0, 0, 0, 0.1);
      margin-left: 20px;
      z-index: 5;
    }
  }
}
</style>
