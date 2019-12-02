<template>
  <div class="main-shop">
    <Affix :offset-bottom="130">
      <div class="demo-affix">
        <Tooltip content="商城" placement="left">
          <span class="rel" @click="jumpShop">
            <span class="iconfont icon-store"></span>
          </span>
        </Tooltip>
        <Tooltip content="购物车" placement="left">
          <Badge :count="cartLength" :offset="[5,5]">
            <span class="rel" @click="jumpCart">
              <Icon type="md-cart" />
            </span>
          </Badge>
        </Tooltip>
        <Tooltip content="订单" placement="left">
          <span class="rel" @click="jumpOrder">
            <Icon type="md-list-box" />
          </span>
        </Tooltip>
      </div>
    </Affix>
  </div>
</template>

<script>
import { getToken } from "../../libs/token";
export default {
  name: "main-shop",
  computed: {
    cartLength() {
      return this.$store.getters.cartLength;
    }
  },
  methods: {
    jumpShop() {
      this.$router.push({ name: "product-list" });
    },
    jumpCart() {
      this.$router.push({ name: "product-cart" });
    },
    jumpOrder() {
      if (getToken()) {
        this.$router.push({ name: "product-order" });
      } else {
        this.$store.commit("CHANGE_LOGIN_SHOW", true);
      }
    }
  },
  created() {
    this.$store.dispatch("getCartList");
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");
.main-shop {
  .ivu-affix {
    z-index: 999;
    width: 48px !important;
    position: fixed;
    right: 30px;
    left: auto !important;
    .demo-affix {
      .ivu-tooltip {
        display: block;
        margin-top: 10px;
        .ivu-tooltip-rel {
          .rel {
            display: block;
            width: 48px;
            height: 40px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 2px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            color: #fff;
            font-size: 24px;
            text-align: center;
            &:hover {
              color: @main-color;
            }
          }
        }
      }
    }
  }
}
</style>