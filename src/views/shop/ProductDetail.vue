<template>
  <div class="product-detail">
    <div class="top clearfloat">
      <div class="img-box">
        <pic-zoom :url="currentImg.imgPath"></pic-zoom>
        <div class="imgs">
          <span
            class="img"
            :class="['img', currentImg.id === img.id ? 'on' : '']"
            v-for="img in allData.productImgList"
            :key="img.id"
            @click="selectImg(img)"
          >
            <img :src="img.imgPath" />
          </span>
        </div>
      </div>
      <div class="detail">
        <h2 class="name">{{ allData.productName }}</h2>
        <div class="price">
          <span class="tip">促销价</span>
          <span class="unit">￥</span>
          <span class="num">{{ allData.productPrice }}</span>
        </div>
        <div class="read">
          <span class="tip">浏览</span>
          <span class="unit">{{ allData.viewNum }}</span>
          <span>&ensp;次</span>
        </div>
        <div class="count">
          <span class="tip">数量</span>
          <span class="unit">
            <InputNumber
              size="large"
              type="number"
              v-model="count"
              placeholder="购买数量"
              style="width: 100px"
              :max="allData.productStock || 1"
              :min="1"
            />&ensp;件
          </span>
          <span class="stock">库存{{ allData.productStock }}件</span>
        </div>
        <div class="btn">
          <Button size="large" type="primary" @click="buy">立即购买</Button>
          <Button size="large" icon="md-cart" type="info" @click="addToCart">加入购物车</Button>
        </div>
      </div>
    </div>
    <div class="remark">
      <div class="title">商品介绍</div>
      <div class="html" v-html="allData.remark"></div>
    </div>
  </div>
</template>

<script>
import { getProduct, addCartSingle } from "@/api/api";
import { getToken } from "../../libs/token";
import PicZoom from "../../components/common/PicZoom.vue";
export default {
  name: "product-detail",
  components: {
    PicZoom
  },
  data() {
    return {
      allData: {},
      currentImg: {},
      count: 1
    };
  },
  methods: {
    selectImg(item) {
      this.currentImg = item;
    },
    back() {
      this.$router.push({ name: "product-list" });
    },

    // 立即购买
    buy() {
      // 没登录不能买
      if (!getToken()) {
        this.$store.commit("CHANGE_LOGIN_SHOW", true);
        return;
      }
      // 库存是0不能买
      if (this.allData.productStock === 0) {
        this.$Message.warning("当前商品没货啦，去看看其他商品吧！");
        return;
      }
      let { id } = this.allData;
      let obj = {};
      obj[id] = this.count;
      sessionStorage["X-website-orderGenerate"] = JSON.stringify(obj);
      this.$router.push({ name: "order-generate" });
    },
    // 加入购物车
    addToCart() {
      // 库存是0不能加入购物车
      if (this.allData.productStock === 0) {
        this.$Message.warning("当前商品没货啦，去看看其他商品吧！");
        return;
      }
      let { id } = this.allData;
      if (getToken()) {
        // 已登录直接加入购物车
        addCartSingle({
          productId: id,
          num: this.count
        }).then(res => {
          if (res.data.res) {
            this.$Message.success(res.data.msg);
            this.$store.dispatch("getCartList");
          }
        });
      } else {
        // 未登录，存入sessionStorage
        let obj =
          (sessionStorage["X-website-cart"] &&
            JSON.parse(sessionStorage["X-website-cart"])) ||
          {};
        obj[id] = obj[id] ? obj[id] + this.count : this.count;
        sessionStorage["X-website-cart"] = JSON.stringify(obj);
        this.$Message.success("加入购物车成功！");
        this.$store.dispatch("getCartList");
      }
    }
  },
  created() {
    let id = this.$route.path.split("/").reverse()[0];
    getProduct(id).then(res => {
      if (res.data.res) {
        this.allData = res.data.data;
        this.currentImg = this.allData.productImgList[0];
        this.$emit("set-bread", [
          {
            name: "商城",
            router: {
              name: "product-list"
            }
          },
          {
            name: this.allData.productName
          }
        ]);
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/common.less");
.product-detail {
  .top {
    .title {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      color: @main-color;
      font-size: 16px;
      background: #fafafa;
      border: 1px solid #efefef;
      margin-bottom: 30px;
      .right {
        font-size: 26px;
        float: right;
        .ivu-icon {
          -moz-transform: scalesX(-1);
          -webkit-transform: scsaleX(-1);
          -o-transform: scaleX(-1);
          transform: scaleX(-1);
          /*IE*/
          filter: FlipH;
          cursor: pointer;
          position: relative;
          top: -3px;
        }
      }
    }
    .img-box {
      width: 500px;
      float: left;
      .imgs {
        height: 64px;
        margin: 20px 0;
        .img {
          float: left;
          width: 64px;
          height: 64px;
          margin: 0 10px;
          border: 2px solid transparent;
          transition: all 0.3s;
          cursor: pointer;
          &.on {
            border: 2px solid @main-color;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .detail {
      float: right;
      width: ~"calc(100% - 500px)";
      .name {
        font-size: 18px;
        margin: 15px 0;
      }
      .price {
        padding: 20px;
        background: url("data:image/png;base64,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");
        .tip {
          color: #999;
          margin-right: 40px;
        }
        .unit {
          font-size: 22px;
          color: @main-color;
        }
        .num {
          font-size: 30px;
          font-weight: bolder;
          color: @main-color;
        }
      }
      .read {
        padding: 20px;
        .tip {
          color: #999;
          margin-right: 60px;
        }
        .unit {
          font-size: 22px;
          color: @main-color;
        }
      }
      .count {
        padding: 20px;
        .tip {
          color: #999;
          margin-right: 60px;
        }
        .unit {
          font-size: 14px;
        }
        .stock {
          margin-left: 30px;
          color: #999;
          font-size: 14px;
        }
      }
      .btn {
        margin: 80px 0 0 100px;
        .ivu-btn {
          width: 120px;
          margin-right: 20px;
        }
      }
    }
  }
  .remark {
    width: 100%;
    margin-top: 30px;
    border-top: 2px solid @main-color;
    .title {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      color: @main-color;
      font-size: 16px;
      background: #fafafa;
      border: 1px solid #efefef;
    }
    .html {
      margin-top: 15px;
      padding: 15px;
      font-size: 16px;
      & /deep/ p {
        font-size: 16px;
      }
    }
  }
}
</style>