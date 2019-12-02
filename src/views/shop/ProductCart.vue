<template>
  <div class="product-cart">
    <!-- 头部信息 -->
    <div class="info">
      <Affix :offset-top="64">
        <div class="title clearfloat">
          <p class="title-all">全部商品 ( {{ products.length }} )</p>
          <p class="title-price">
            <span>
              已选商品
              <span class="strong">{{ selectTotal.num || 0 }}</span>
              件
            </span>
            <span>
              合计：
              <span class="strong">￥{{ selectTotal.price || 0 }}</span>
            </span>
            <Button
              type="primary"
              :disabled="checkAllGroup.length === 0"
              @click="settlement(null)"
            >结算</Button>
            <Button type="error" :disabled="checkAllGroup.length === 0" @click="delProduct(null)">删除</Button>
          </p>
        </div>
      </Affix>
      <Divider />
    </div>

    <!-- 商品信息 -->
    <div class="products">
      <!-- 全选和提示 -->
      <div class="title">
        <Checkbox
          size="large"
          :indeterminate="indeterminate"
          :value="checkAll"
          @click.prevent.native="handleCheckAll"
        >&emsp;全选</Checkbox>
        <p class="tips clearfloat">
          <span class="attr">
            <span class="name">商品信息</span>
          </span>
          <span class="settlement">
            <span class="price">单价</span>
            <span class="number">数量</span>
            <span class="total">金额</span>
            <span class="todo">操作</span>
          </span>
        </p>
      </div>

      <!-- 商品列表 -->
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <Checkbox size="large" :label="product.id" v-for="product in products" :key="product.id">
          <div class="attr">
            <div class="img">
              <img @click.prevent="viewDetail(product.id)" :src="product.firstProductImgPath" />
            </div>
            <div @click.prevent="viewDetail(product.id)" class="name">{{ product.productName }}</div>
          </div>
          <div class="settlement">
            <div class="price">￥{{ product.productPrice }}</div>
            <div class="number">
              <InputNumber
                @on-change="numberChange($event, product.id)"
                :min="1"
                :max="product.productStock || 1"
                v-model="product.num"
              ></InputNumber>
            </div>
            <div class="total">￥{{ product.productPrice * product.num }}</div>
            <div class="todo">
              <Button size="small" type="primary" @click="settlement(product.id)">结算</Button>
              <Button size="small" type="error" @click="delProduct(product.id)">删除</Button>
            </div>
          </div>
        </Checkbox>
      </CheckboxGroup>
      <the-empty v-if="!products.length" style="margin-bottom: 20px;"></the-empty>
      <!-- 总计 -->
      <p class="all-price">
        <span>
          已选商品
          <span class="strong">{{ selectTotal.num || 0 }}</span>
          件
        </span>
        <span>
          合计：
          <span class="strong">￥{{ selectTotal.price || 0 }}</span>
        </span>
        <Button type="primary" :disabled="checkAllGroup.length === 0" @click="settlement(null)">结算</Button>
        <Button type="error" :disabled="checkAllGroup.length === 0" @click="delProduct(null)">删除</Button>
      </p>
    </div>
  </div>
</template>

<script>
import {
  getCartList,
  getProductByIds,
  changeCartNum,
  delCart
} from "@/api/api";
import TheEmpty from "../../components/common/TheEmpty.vue";
import { getToken } from "../../libs/token";
export default {
  name: "product-cart",
  components: {
    TheEmpty
  },
  data() {
    return {
      indeterminate: false,
      checkAll: false,
      checkAllGroup: []
    };
  },
  computed: {
    products() {
      this.indeterminate = false;
      this.checkAll = false;
      this.checkAllGroup = [];
      return this.$store.state.shop.products;
    },
    selectTotal() {
      if (!this.checkAllGroup.length) return 0;

      let items = this.products.filter(item =>
        this.checkAllGroup.includes(item.id)
      );

      if (!items.length) return 0;

      let price = items.reduce((res, curr) => {
        let currTotal = curr.productPrice * curr.num;
        return res + currTotal;
      }, 0);

      let num = items.reduce((res, curr) => {
        return res + curr.num;
      }, 0);

      return { price, num };
    }
  },
  methods: {
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = this.products.map(item => item.id);
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.products.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
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

    // 改变商品数量
    numberChange(val, id) {
      if (getToken()) {
        changeCartNum({
          productId: id,
          num: val
        }).then(res => {
          if (res.data.res) {
          }
        });
      } else {
        let obj =
          (sessionStorage["X-website-cart"] &&
            JSON.parse(sessionStorage["X-website-cart"])) ||
          {};
        obj[id] = val;
        sessionStorage["X-website-cart"] = JSON.stringify(obj);
      }
    },

    // 结算
    settlement(id) {
      // 去结算页面
      const todo = ids => {
        if (ids.length === 0) return;
        let obj = {};
        let products = this.products.filter(p => ids.includes(p.id));
        products.forEach(item => {
          obj[item.id] = item.num;
        });

        sessionStorage["X-website-orderGenerate"] = JSON.stringify(obj);
        this.$router.push({ name: "order-generate" });
      };

      // 没登录不能结算
      if (!getToken()) {
        this.$store.commit("CHANGE_LOGIN_SHOW", true);
        return;
      }
      let ids = [];
      if (id) {
        // 点击单个商品结算
        let product = this.products.filter(p => id === p.id)[0];
        if (product.productStock) {
          ids = [id];
          todo(ids);
        } else {
          this.$Message.warning("当前商品没货啦，去看看其他商品吧！");
          return;
        }
      } else {
        let products = this.products.filter(p =>
          this.checkAllGroup.includes(p.id)
        );
        let productsNotBlank = products.filter(p => p.productStock);
        if (products.length === productsNotBlank.length) {
          ids = products.map(p => p.id);
          todo(ids);
        } else {
          if (!productsNotBlank.length) {
            this.$Modal.info({
              title: "无法结算",
              content: `当前选中的所有商品的库存都为0，无法结算！`
            });
            return;
          } else {
            let len = products.length - productsNotBlank.length;
            this.$Modal.confirm({
              title: "结算确认",
              content: `
                <div>
                  <p style="color: #f00">当前选中的商品中有 ${len} 件商品的库存为 0 </p>
                  <p style="color: #00adb5">系统将结算当前库存不为 0 的 ${productsNotBlank.length} 件商品</p>
                  <p>确定继续执行？</p>
                </div>`,
              onOk: () => {
                ids = productsNotBlank.map(p => p.id);
                todo(ids);
              }
            });
          }
        }
      }
    },
    // 删除
    delProduct(id) {
      let ids = id ? [id] : this.checkAllGroup;
      let content = id
        ? `<p>确定删除这件商品？</p>`
        : `<p>确定删除当前选中的 ${ids.length} 件商品？</p>`;
      this.$Modal.confirm({
        title: "删除确认",
        content,
        onOk: () => {
          this.$store.dispatch("delCartList", {
            ids,
            callback: msg => {
              this.$Message.success(msg);
            }
          });
        }
      });
    }
  },
  created() {
    this.$store.dispatch("getCartList");

    this.$emit("set-bread", [
      {
        name: "商城",
        router: {
          name: "product-list"
        }
      },
      {
        name: "购物车"
      }
    ]);
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");
.product-cart {
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
        float: right;
        font-size: 14px;
        & > span {
          margin-right: 15px;
        }
        .strong {
          color: @main-color;
          font-size: 16px;
          font-weight: bold;
        }
        .ivu-btn {
          position: relative;
          top: -2px;
          margin-left: 15px;
        }
      }
    }
    .ivu-divider {
      margin: 10px 0;
    }
    .ivu-affix {
      .title {
        padding: 0 20px;
        background: #fff;
        box-shadow: 1px 1px 3px #ccc, -1px 1px 3px #ccc;
      }
    }
  }
  .products {
    .title {
      position: relative;
      margin: 15px 0;
      .ivu-checkbox-wrapper {
        position: absolute;
        top: 10px;
        left: 15px;
      }
      .tips {
        width: 100%;
        padding: 10px 40px;
        text-align: center;
        font-size: 14px;
        .attr {
          float: left;
          width: 50%;
          & > span {
            float: left;
            margin-left: 20px;
            &.name {
              width: ~"calc(100% - 40px)";
              min-width: 150px;
            }
          }
        }
        .settlement {
          float: right;
          width: 50%;
          min-width: 350px;
          & > span {
            float: left;
            &.price {
              width: ~"calc(50% - 60px)";
              min-width: 80px;
            }
            &.number {
              width: 80px;
            }
            &.total {
              width: ~"calc(50% - 60px)";
              min-width: 80px;
            }
            &.todo {
              width: 40px;
            }
          }
        }
      }
    }
    .ivu-checkbox-group {
      .ivu-checkbox-wrapper {
        width: 100%;
        height: 120px;
        margin: 0 0 20px;
        border: 1px solid #e7e7e7;
        position: relative;
        padding: 15px 40px;
        background: #fcfcfc;
        .ivu-checkbox {
          position: absolute;
          top: 15px;
          left: 15px;
        }
        .attr {
          float: left;
          width: 45%;
          & > div {
            float: left;
            margin-left: 20px;
            &.img {
              width: 88px;
              height: 88px;
              border: 1px solid #ccc;
              img {
                width: 100%;
                height: 100%;
              }
            }
            &.name {
              width: ~"calc(100% - 130px)";
              min-width: 150px;
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
          & > div {
            float: left;
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
              color: @main-color;
            }
            &.todo {
              width: 40px;
              .ivu-btn {
                display: block;
                margin: 0 auto 10px;
              }
            }
          }
        }
      }
    }
  }
  .all-price {
    float: right;
    font-size: 14px;
    & > span {
      margin-right: 15px;
    }
    .strong {
      color: @main-color;
      font-size: 16px;
      font-weight: bold;
    }
    .ivu-btn {
      position: relative;
      top: -2px;
      margin-left: 15px;
    }
  }
}
</style>