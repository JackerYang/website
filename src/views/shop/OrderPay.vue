<template>
  <div class="order-pay">
    <!-- 头部信息 -->
    <div class="info">
      <div class="title clearfloat">
        <p class="title-all">完成付款</p>
        <p class="title-price">
          <Steps :current="2" size="small">
            <Step title="拍下商品"></Step>
            <Step title="提交订单"></Step>
            <Step title="完成付款"></Step>
          </Steps>
        </p>
      </div>
      <Divider />
    </div>

    <!-- 提示信息 -->
    <div v-if="!isPay" class="tip">
      <p class="base">
        <span>订单提交成功，请尽快付款！订单号：{{ allData.code }}</span>
        <span class="price">
          应付金额
          <span>{{ allData.amountTotal }}</span>
          元
        </span>
      </p>
      <p class="time">
        <span class="limit">
          请您在
          <span>3分钟</span>
          内完成支付，否则订单会被自动取消
        </span>
        <span class="detail" @click="show = !show">
          {{ show ? "收起详情" : "查看详情" }}
          <Icon :type="show ? 'ios-arrow-up' : 'ios-arrow-down'" />
        </span>
      </p>
    </div>

    <!-- 详细信息 -->
    <div v-if="!isPay" :class="['product', show ? 'show' : '']">
      <p>
        <span class="tip">收&ensp;货&ensp;人：</span>
        {{ allData.consigneeName }}&ensp;{{ allData.consigneePhone }}
      </p>
      <p>
        <span class="tip">收货地址：</span>
        {{ allData.consigneeAddress }}
      </p>
      <div class="clearfloat">
        <span class="tip">商品名称：</span>
        <div class="lists">
          <p
            class="list"
            v-for="item, index in allData.userOrderProductList"
            :key="item.id"
          >{{ index + 1 }}、 {{ item.productName }}</p>
        </div>
      </div>
    </div>

    <!-- 付款 -->
    <div v-if="!isPay" class="pay clearfloat">
      <div class="pay-pwd">
        <pay-input @getPwd="getPwd"></pay-input>
      </div>
      <Button size="large" type="primary" :disabled="!finish" @click="pay">立即支付</Button>
    </div>

    <div v-if="isPay" class="isPay">
      <img :src="require('../../assets/img/true.png')" />
      <p>
        <span class="tip">您已成功付款 {{ allData.amountTotal }} 元。</span>
        <span class="href">
          <span @click="buy">继续购物</span>
          <span @click="view">查看订单</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import PayInput from "../../components/common/PayInput.vue";
import { payOrder, getOrder } from "@/api/api";
export default {
  name: "order-pay",
  components: {
    PayInput
  },
  data() {
    return {
      show: false,
      finish: false,
      pwd: "",
      order: null,
      allData: {},
      isPay: false
    };
  },
  methods: {
    // 输入密码事件
    getPwd(pwd) {
      if (pwd.length === 6) {
        this.finish = true;
        this.pwd = pwd;
      } else {
        this.finish = false;
      }
    },

    // 支付事件
    pay() {
      payOrder(this.order).then(res => {
        if (res.data.res) {
          this.isPay = true;
          this.$Message.success(res.data.msg);
          sessionStorage.removeItem("X-website-order");
          this.$store.dispatch("getOrderList");
        }
      });
    },

    // 继续购买
    buy() {
      this.$router.push({ name: "product-list" });
    },

    // 查看订单
    view() {
      this.$router.push({
        name: "product-order-detail",
        params: {
          id: this.order.id
        }
      });
    }
  },
  created() {
    this.$emit("set-bread", [
      {
        name: "商城",
        router: {
          name: "product-list"
        }
      },
      {
        name: "完成付款"
      }
    ]);

    if (
      sessionStorage["X-website-order"] &&
      sessionStorage["X-website-order"] !== "{}"
    ) {
      this.order = JSON.parse(sessionStorage["X-website-order"]);
      getOrder(this.order.id).then(res => {
        if (res.data.res) {
          this.allData = res.data.data;
        }
      });
    } else {
      this.$router.push({ name: "product-cart" });
    }
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");
.order-pay {
  .info {
    .title {
      height: 50px;
      line-height: 50px;
      transition: all 0.3s;
      &-all {
        font-size: 16px;
        float: left;
        font-weight: bolder;
      }
      &-price {
        width: 400px;
        float: right;
        margin-top: 20px;
        .ivu-icon {
          position: relative;
          top: -2px !important;
        }
      }
    }
    .ivu-divider {
      margin: 10px 0;
    }
  }
  .tip {
    .base {
      font-size: 16px;
      margin: 20px 0 10px;
      .price {
        float: right;
        span {
          font-size: 18px;
          font-weight: bolder;
          color: @main-color;
        }
      }
    }
    .time {
      font-size: 14px;
      .limit {
        span {
          color: @main-color;
        }
      }
      .detail {
        float: right;
        color: @main-color;
        cursor: pointer;
      }
    }
  }
  .product {
    max-height: 0;
    overflow: hidden;
    margin: 15px 0;
    font-size: 14px;
    transition: 0.3s;
    border: 1px solid transparent;
    padding: 0 20px;
    .tip {
      display: inline-block;
      width: 5em;
    }
    .lists {
      width: ~"calc(100% - 5em)";
      float: right;
      .list {
        margin: 1px 0;
      }
    }
    &.show {
      max-height: 250px;
      overflow: auto;
      border: 1px solid #efefef;
      padding: 20px;
    }
  }
  .pay {
    width: 60%;
    box-shadow: 1px 1px 3px #eee, -1px -1px 3px #eee;
    margin: 50px auto;
    padding: 30px;
    .ivu-btn {
      float: right;
      margin: 40px 0 0;
    }
  }
  .isPay {
    width: 40%;
    margin: 50px auto;
    background: #f6f6f6;
    padding: 20px;
    img {
      width: 100px;
      height: 100px;
      vertical-align: middle;
    }
    p {
      width: 328px;
      font-size: 16px;
      float: right;
      .tip {
        display: inline-block;
        width: 100%;
        padding: 20px 40px 10px;
      }
      .href {
        display: inline-block;
        width: 100%;
        padding: 0 40px 10px;
        span {
          cursor: pointer;
          color: @main-color;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>