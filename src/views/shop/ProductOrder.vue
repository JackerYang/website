<template>
  <div class="product-order">
    <div class="filter clearfloat">
      <div class="state">
        <span
          v-for="s in states"
          :key="s.value"
          :class="[state === s.value ? 'on' : '']"
          @click="selectState(s.value)"
        >{{ s.label }}</span>
      </div>
      <div class="search">
        <Input size="small" v-model="productName" @on-enter="search" placeholder="搜索商品名称" />
        <Input size="small" v-model="code" @on-enter="search" placeholder="搜索订单号" />
        <Button size="small" type="primary" @click="search">查询</Button>
        <Button size="small" @click="reset">重置</Button>
      </div>
    </div>
    <div class="items">
      <!-- 全选 -->
      <div class="title">
        <Checkbox
          size="large"
          :indeterminate="indeterminate"
          :value="checkAll"
          @click.prevent.native="handleCheckAll"
        >&emsp;全选</Checkbox>
        <div class="extre">
          <Button
            type="error"
            size="small"
            :disabled="!checkAllGroup.length"
            @click="delOrders(null)"
          >删除订单</Button>
        </div>
      </div>
      <!-- 商品列表 -->
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <Checkbox size="large" :label="order.id" v-for="order in orderList" :key="order.id">
          <div class="header">
            <span>{{ order.createDate }}</span>
            <span>
              订单号：
              <span class="code" @click.prevent="viewOrderDetail(order.id)">{{ order.code }}</span>
            </span>
            <span class="more">
              <Tooltip content="查看订单详情" placement="left-start">
                <Icon @click.prevent="viewOrderDetail(order.id)" type="ios-arrow-forward" />
              </Tooltip>
            </span>
          </div>
          <div class="content clearfloat">
            <div class="left">
              <div
                class="per clearfloat"
                v-for="item in order.userOrderProductLogisticsVOList"
                :key="item.id"
              >
                <img @click="viewDetail(item.productId)" :src="item.firstProductImgPath" />
                <span class="name" @click="viewDetail(item.productId)">{{ item.productName }}</span>
                <span class="num">x {{ item.num }}</span>
              </div>
            </div>
            <div class="right">
              <div class="name">
                {{ order.consigneeName }}
                <Icon type="md-contact" />
              </div>
              <div class="price">￥ {{ order.amountTotal }}</div>
              <div class="status">{{ state_obj[order.status] }}</div>
              <div>
                <Button
                  v-if="order.status === 0"
                  size="small"
                  type="primary"
                  @click="pay(order)"
                  ghost
                >付款</Button>
                <Button size="small" type="error" @click="delOrders(order.id)" ghost>删除订单</Button>
              </div>
            </div>
          </div>
        </Checkbox>
      </CheckboxGroup>
      <the-empty v-if="!orderList.length" style="margin-bottom: 20px;"></the-empty>

      <div class="page clearfloat">
        <Page
          :total="orderListTotal"
          :page-size="5"
          @on-change="pagechange"
          show-total
          show-elevator
        />
      </div>
    </div>
  </div>
</template>

<script>
import getOrderList from "@/api/api";
import TheEmpty from "../../components/common/TheEmpty.vue";
import { getToken } from "../../libs/token";
export default {
  name: "product-order",
  components: {
    TheEmpty
  },
  computed: {
    orderList() {
      return this.$store.state.shop.orderList;
    },
    orderListTotal() {
      return this.$store.state.shop.orderListTotal;
    },
    orderCon() {
      return this.$store.state.shop.orderCon;
    }
  },
  data() {
    return {
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],

      states: [
        {
          label: "全部订单",
          value: null
        },
        {
          label: "待付款",
          value: 0
        },
        {
          label: "已付款",
          value: 1
        },
        {
          label: "已发货",
          value: 2
        },
        {
          label: "已完成",
          value: 3
        },
        {
          label: "已取消",
          value: 4
        }
      ],
      state: null,

      productName: null,
      code: null,

      state_obj: {
        0: "待付款",
        1: "已付款",
        2: "已发货",
        3: "已完成",
        4: "已取消"
      }
    };
  },
  methods: {
    // 订单状态查询 全部订单|待付款|已付款|已发货|已完成|已取消
    selectState(state) {
      this.state = state;
      this.$store.commit("CHANGE_ORDER_CON", {
        ...this.orderCon,
        status: state
      });
      this.$store.dispatch("getOrderList");
    },

    // 切换页码
    pagechange(page) {
      this.$store.commit("CHANGE_ORDER_CON", {
        ...this.orderCon,
        page: page
      });
      this.$store.dispatch("getOrderList");
    },

    // 商品名称|订单号搜索
    search() {
      this.$store.commit("CHANGE_ORDER_CON", {
        ...this.orderCon,
        productName: this.productName,
        code: this.code,
        status: this.state
      });
      this.$store.dispatch("getOrderList");
    },
    // 重置，清空搜索条件
    reset() {
      this.code = null;
      this.productName = null;
      this.state = null;
      this.$store.commit("CHANGE_ORDER_CON", {
        ...this.orderCon,
        productName: null,
        code: null,
        status: null
      });
      this.$store.dispatch("getOrderList");
    },

    // 查看商品详情
    viewDetail(id) {
      this.$router.push({
        name: "product-detail",
        params: {
          id
        }
      });
    },

    // 查看订单详情
    viewOrderDetail(id) {
      this.$router.push({
        name: "product-order-detail",
        params: {
          id
        }
      });
    },

    // 待付款订单去付款
    pay(order) {
      let { code, id } = order;
      sessionStorage["X-website-order"] = JSON.stringify({
        code,
        id
      });
      this.$router.push({ name: "order-pay" });
    },

    // 删除订单
    delOrders(id) {
      let ids = id ? [id] : this.checkAllGroup;
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>确定删除订单？</p>",
        onOk: () => {
          this.$store.dispatch("delOrder", {
            ids,
            callback: msg => {
              this.indeterminate = false;
              this.checkAll = false;
              this.checkAllGroup = [];
              this.$Message.success(msg);
            }
          });
        }
      });
    },

    // 多选框的两个事件
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = this.orderList.map(item => item.id);
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.orderList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
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
        name: "订单"
      }
    ]);
    if (getToken()) {
      this.$store.dispatch("getOrderList");
    } else {
      this.$router.push({ name: "product-list" });
    }
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");
.product-order {
  height: 100%;
  .filter {
    background: #efefef;
    border: 1px solid #eaeaea;
    height: 40px;
    .state {
      float: left;
      span {
        float: left;
        padding: 8px 15px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 2px solid transparent;
        &.on {
          color: @main-color;
          border-bottom: 2px solid @main-color;
        }
      }
    }
    .search {
      float: right;
      & > .ivu-input-wrapper {
        float: left;
        width: 100px;
        height: 24px;
        margin: 7px 20px 7px 0;
      }
      .ivu-btn {
        margin: 7px 10px 0 0;
      }
    }
  }
  .items {
    .title {
      height: 30px;
      position: relative;
      margin: 15px 0;
      .ivu-checkbox-wrapper {
        position: absolute;
        top: 10px;
        left: 10px;
      }
      .extre {
        float: right;
        .ivu-btn {
          margin: 10px 0 0;
        }
      }
    }
    .ivu-checkbox-group {
      overflow: hidden;
      .ivu-checkbox-wrapper {
        width: 100%;
        border: 1px solid #e5e5e5;
        margin: 0 0 20px;
        position: relative;
        overflow: hidden;
        .ivu-checkbox {
          position: absolute;
          top: 6px;
          left: 9px;
        }
        .header {
          background: #efefef;
          padding: 0 0 0 20px;
          height: 28px;
          line-height: 28px;
          & > span {
            margin-left: 20px;
            .code {
              &:hover {
                color: @main-color;
                text-decoration: underline;
              }
            }
          }
          .more {
            float: right;
            .ivu-icon {
              font-size: 24px;
              color: #ccc;
              margin-right: 5px;
              &:hover {
                color: @main-color;
              }
            }
          }
        }
        .content {
          width: 100%;
          overflow: hidden;
          .left {
            width: 50%;
            float: left;
            border-right: 1px solid #e5e5e5;
            .per {
              width: 100%;
              padding: 15px;
              &:not(:last-child) {
                border-bottom: 1px solid #e5e5e5;
              }
              img {
                width: 60px;
                height: 60px;
                vertical-align: top;
                border: 1px solid #e5e5e5;
                float: left;
                cursor: pointer;
              }
              span {
                margin: 0 10px;
                float: left;
                &.name {
                  width: ~"calc(100% - 150px)";
                  cursor: pointer;
                  &:hover {
                    color: @main-color;
                  }
                }
                &.num {
                  width: 50px;
                  text-align: center;
                  color: #999;
                }
              }
            }
          }
          .right {
            width: 50%;
            float: left;
            position: absolute;
            right: 0;
            & > div {
              float: left;
              text-align: center;
              width: 25%;
              height: 1000px;
              padding: 15px 0;
              &:not(:last-child) {
                border-right: 1px solid #e5e5e5;
              }
              .ivu-btn {
                display: block;
                margin: 5px auto;
              }
            }
            .name {
              .ivu-icon {
                color: #ccc;
                font-size: 20px;
              }
            }
          }
        }
      }
    }
    .page {
      .ivu-page {
        float: right;
      }
    }
  }
}
</style>