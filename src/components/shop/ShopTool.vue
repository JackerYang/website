<template>
  <div class="shop-tool">
    <div class="sort">
      <span
        v-for="item in sortList"
        :key="item.value"
        @click="sort(item.value)"
        :class="[sortValue === item.value ? 'active' : '']"
      >{{ item.label }}</span>
    </div>
    <div class="search">
      <span class="price">
        <Input type="number" size="small" :min="0" @on-enter="search" placeholder="￥" v-model="min"></Input>&ensp;-&ensp;
        <Input type="number" size="small" :min="0" @on-enter="search" placeholder="￥" v-model="max"></Input>
      </span>
      <Input size="small" v-model="value" @on-enter="search" placeholder="搜索商品" />
      <Button size="small" type="primary" @click="search">查询</Button>
      <Button size="small" @click="reset">重置</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "shop-tool",
  computed: {
    condition() {
      return this.$store.state.shop.condition;
    },
    productList() {
      return this.$store.state.shop.productList;
    }
  },
  data() {
    return {
      sortList: [
        {
          label: "热度",
          value: "viewNum"
        },
        {
          label: "价格升序",
          value: "asc"
        },
        {
          label: "价格降序",
          value: "desc"
        }
      ],
      sortValue: "viewNum",

      min: null,
      max: null,
      value: null
    };
  },
  watch: {
    "condition.productPrice": {
      deep: true,
      handler(value) {
        if (value === null) {
          this.sortValue = "viewNum";
        } else if (value === "asc") {
          this.sortValue = "asc";
        } else if (value === "desc") {
          this.sortValue = "desc";
        }
      }
    },
    "condition.minProductPrice": {
      deep: true,
      handler(value) {
        this.min = value;
      }
    },
    "condition.maxProductPrice": {
      deep: true,
      handler(value) {
        this.max = value;
      }
    },
    "condition.productName": {
      deep: true,
      handler(value) {
        this.value = value;
      }
    }
  },
  methods: {
    // 排序
    sort(value) {
      if (!this.productList.length) return;
      if (value === "viewNum") {
        this.$store.commit("CHANGE_CONDITION", {
          ...this.condition,
          productPrice: null,
          viewNum: "desc"
        });
      } else if (value === "asc") {
        this.$store.commit("CHANGE_CONDITION", {
          ...this.condition,
          productPrice: "asc",
          viewNum: null
        });
      } else if (value === "desc") {
        this.$store.commit("CHANGE_CONDITION", {
          ...this.condition,
          productPrice: "desc",
          viewNum: null
        });
      }
      this.$store.dispatch("getProductList");
    },

    // 搜索
    search() {
      if (!this.productList.length) return;
      this.min = !this.min && this.min !== 0 ? null : this.min;
      this.max = !this.max && this.max !== 0 ? null : this.max;
      this.$store.commit("CHANGE_CONDITION", {
        ...this.condition,
        productName: this.value,
        minProductPrice: this.min,
        maxProductPrice: this.max
      });
      this.$store.dispatch("getProductList");
    },

    // 搜索重置
    reset() {
      if (!this.productList.length) return;
      this.$store.commit("CHANGE_CONDITION", {
        ...this.condition,
        productName: null,
        minProductPrice: null,
        maxProductPrice: null
      });
      this.$store.dispatch("getProductList");
    }
  },
  created() {
    let {
      minProductPrice,
      maxProductPrice,
      productName,
      productPrice,
      viewNum
    } = this.condition;
    (minProductPrice || minProductPrice === 0) && (this.min = minProductPrice);
    (maxProductPrice || maxProductPrice === 0) && (this.max = maxProductPrice);
    productName && (this.value = productName);
    productPrice && (this.sortValue = productPrice);
    viewNum && (this.sortValue = "viewNum");
  }
};
</script>

<style lang="less"scoped>
@import url("../../assets/less/common.less");
.shop-tool {
  width: 100%;
  height: 42px;
  border: 1px solid #dfdfdf;
  background: #efefef;
  margin: 20px 0;
  .sort {
    float: left;
    font-size: 14px;
    &:first-child {
      border-left: none !important;
    }
    span {
      display: inline-block;
      cursor: pointer;
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      transition: all 0.3s;
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      &.active {
        background: #fff;
        color: @main-color;
        border-left: 1px solid #dfdfdf;
        border-right: 1px solid #dfdfdf;
      }
    }
  }
  .search {
    float: right;
    .price {
      float: left;
      height: 24px;
      margin: 8px 0;
      .ivu-input-wrapper {
        width: 80px;
      }
    }
    & > .ivu-input-wrapper {
      float: left;
      width: 100px;
      height: 24px;
      margin: 7px 20px;
    }
    .ivu-btn {
      margin: 7px 10px 0 0;
    }
  }
}
</style>