<template>
  <div class="product-list">
    <template v-if="items.length">
      <shop-classify></shop-classify>
      <shop-tool></shop-tool>
      <div class="items clearfloat">
        <div class="item" v-for="item in items" :key="item.id">
          <img @click="viewDetail(item.id)" :src="item.firstProductImgPath" />
          <div class="detail">
            <p class="price">
              <span class="num">￥{{ item.productPrice }}</span>
              <span class="see">{{ item.viewNum }}人查看</span>
            </p>
            <p class="desc" @click="viewDetail(item.id)">{{ item.productName }}</p>
          </div>
        </div>
      </div>
      <Page
        :total="total"
        :page-size="condition.pageSize"
        show-total
        show-elevator
        @on-change="pageChange"
      />
    </template>
    <the-empty v-else></the-empty>
  </div>
</template>

<script>
import TheEmpty from "../../components/common/TheEmpty.vue";
import ShopClassify from "../../components/shop/ShopClassify.vue";
import ShopTool from "../../components/shop/ShopTool.vue";
import { getProductList } from "@/api/api";
export default {
  name: "product-list",
  components: {
    TheEmpty,
    ShopClassify,
    ShopTool
  },
  computed: {
    condition() {
      return this.$store.state.shop.condition;
    },
    total() {
      return this.$store.state.shop.productListTotal;
    },
    items() {
      return this.$store.state.shop.productList;
    }
  },
  methods: {
    // 换页码
    pageChange(page) {
      this.$store.commit("CHANGE_CONDITION", {
        ...this.condition,
        page
      });
      this.$store.dispatch("getProductList");
    },
    // 查看详情
    viewDetail(id) {
      this.$router.push({
        name: "product-detail",
        params: {
          id
        }
      });
    }
  },
  created() {
    this.$store.dispatch("getProductList");
    this.$emit("set-bread", [
      {
        name: "商城"
      }
    ]);
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");
.product-list {
  .items {
    width: 100%;
    .item {
      min-width: 250px;
      width: ~"calc(25% - 20px)";
      height: 392px;
      margin: 10px;
      float: left;
      img {
        width: 100%;
        height: 280px;
        display: block;
        cursor: pointer;
        border: 1px solid #ededed;
        border-bottom: none;
        transition: all 0.3s;
      }
      .detail {
        padding-bottom: 10px;
        border: 1px solid #ededed;
        border-top: none;
        transition: all 0.3s;
        height: 112px;
        .price {
          padding: 10px;
          height: 47px;
          .num {
            font-size: 18px;
            font-weight: bolder;
            color: @main-color;
          }
          .see {
            float: right;
            color: #999;
            margin: 3px 0;
          }
        }
        .desc {
          padding: 0 10px;
          cursor: pointer;
          &:hover {
            color: @main-color;
            text-decoration: underline;
          }
        }
      }
      &:hover {
        img {
          border-color: @main-color;
        }
        .detail {
          border-color: @main-color;
        }
      }
    }
  }
  .ivu-page {
    text-align: center;
    margin: 50px;
    li {
      a {
        display: inline;
      }
    }
  }
}
</style>