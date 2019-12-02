<template>
  <div class="product-order-detail">
    <!-- 头部信息 -->
    <div class="info">
      <div class="title clearfloat">
        <p class="title-all">订单详情</p>
      </div>
      <Divider />
    </div>

    <!-- 订单信息 -->
    <div class="msg">
      <div class="item-title clearfloat">
        <span class="title">订单信息</span>
      </div>
      <div class="msg-item">
        <p>
          <span class="tip">总金额：</span>
          <span class="val">￥{{ allData.amountTotal }}</span>
        </p>
        <p>
          <span class="tip">下单时间：</span>
          <span class="val">{{ allData.createDate }}</span>
        </p>
        <p>
          <span class="tip">订单号：</span>
          <span class="val">{{ allData.code }}</span>
        </p>
        <p>
          <span class="tip">付款时间：</span>
          <span class="val">{{ allData.payTime }}</span>
        </p>
        <p>
          <span class="tip">付款号：</span>
          <span class="val">{{ allData.payNo }}</span>
        </p>
        <p>
          <span class="tip">订单状态：</span>
          <span class="val">{{ state_obj[allData.status] }}</span>
        </p>
      </div>
    </div>

    <!-- 地址信息 -->
    <div class="msg address">
      <div class="item-title clearfloat">
        <span class="title">地址信息</span>
      </div>
      <div class="msg-item">
        <p>
          <span class="tip">收货人：</span>
          <span class="val">{{ allData.consigneeName }}</span>
        </p>
        <p>
          <span class="tip">手机号：</span>
          <span class="val">{{ allData.consigneePhone }}</span>
        </p>
        <p>
          <span class="tip">收货地址：</span>
          <span class="val">{{ allData.consigneeAddress }}</span>
        </p>
      </div>
    </div>

    <!-- 商品清单 -->
    <div class="list">
      <div class="item-title clearfloat">
        <span class="title">商品清单</span>
      </div>
      <div class="items">
        <div class="item title">
          <div class="attr">商品信息</div>
          <div class="settlement">
            <div class="price">单价</div>
            <div class="number">数量</div>
            <div class="total">小计</div>
          </div>
        </div>
        <div class="item" v-for="product in allData.userOrderProductLogisticsVOList" :key="product.id">
          <div class="attr">
            <div class="img">
              <img @click.prevent="viewDetail(product.id)" :src="product.firstProductImgPath" />
            </div>
            <div @click.prevent="viewDetail(product.id)" class="name">{{ product.productName }}</div>
          </div>
          <div class="settlement">
            <div class="price">￥{{ product.productPrice }}</div>
            <div class="number">X {{ product.num}}</div>
            <div class="total">￥{{ product.productPrice * product.num }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrder } from "@/api/api";
export default {
  name: "product-order-detail",
  data() {
    return {
      allData: {},
      state_obj: {
        0: "待付款",
        1: "已付款",
        2: "已发货",
        3: "已完成",
        4: "已取消"
      }
    };
  },
  methods: {},
  created() {
    let id = this.$route.path.split("/").reverse()[0];
    getOrder(id).then(res => {
      if (res.data.res) {
        this.allData = res.data.data;
        this.$emit("set-bread", [
          {
            name: "商城",
            router: {
              name: "product-list"
            }
          },
          {
            name: "订单",
            router: {
              name: "product-order"
            }
          },
          {
            name: this.allData.code
          }
        ]);
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/common.less");
.product-order-detail {
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
    }
    .ivu-divider {
      margin: 10px 0;
    }
  }
  .item-title {
    font-size: 15px;
    width: 100%;
    .title {
      float: left;
      font-weight: bold;
    }
  }
  .msg {
    width: 49%;
    border: 1px solid #efefef;
    padding: 20px;
    margin-top: 20px;
    min-height: 245px;
    display: inline-block;
    box-shadow: 1px 1px 3px #efefef, -1px -1px 3px #efefef;
    &-item {
      width: 100%;
      padding: 10px 20px;
      font-size: 14px;
      p {
        margin: 5px 0;
        .tip {
          color: #777;
          display: inline-block;
          width: 5em;
          text-align: justify;
          text-align-last: justify;
        }
        .val {
          font-weight: bold;
        }
      }
    }
    &.address {
      margin-left: 2%;
      vertical-align: top;
    }
  }
  .list {
    width: 100%;
    border: 1px solid #efefef;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 1px 1px 3px #efefef, -1px -1px 3px #efefef;
    .items {
      width: 100%;
      padding: 10px 20px;
      .item {
        width: 100%;
        height: 120px;
        border: 1px solid #e7e7e7;
        border-bottom: none;
        position: relative;
        padding: 15px 40px;
        background: #fcfcfc;
        &:last-child {
          border-bottom: 1px solid #e7e7e7;
        }
        .attr {
          float: left;
          width: 45%;
          font-size: 14px;
          & > div {
            float: left;
            margin-left: 20px;
            &.img {
              width: 88px;
              height: 88px;
              border: 1px solid #ccc;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
              }
            }
            &.name {
              width: ~"calc(100% - 130px)";
              min-width: 150px;
              cursor: pointer;
              margin-top: 23px;
              &:hover {
                color: @main-color;
                text-decoration: underline;
              }
            }
          }
        }
        .settlement {
          float: right;
          width: 50%;
          min-width: 350px;
          text-align: center;
          font-size: 14px;
          & > div {
            float: left;
            height: 88px;
            line-height: 88px;
            &.price {
              width: ~"calc(50% - 60px)";
              min-width: 80px;
              font-weight: bold;
            }
            &.number {
              width: 80px;
            }
            &.total {
              width: ~"calc(50% - 60px)";
              min-width: 80px;
              font-weight: bold;
            }
          }
        }
      }
      .item.title {
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        padding: 0 40px;
        .attr {
          text-align: center;
        }
        .settlement {
          vertical-align: top;
          div {
            height: 50px;
            line-height: 50px;
          }
        }
      }
    }
  }
}
</style>