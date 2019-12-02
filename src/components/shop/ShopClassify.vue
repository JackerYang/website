<template>
  <div class="shop-classify">
    <div class="title clearfloat">
      <Breadcrumb separator=">">
        <BreadcrumbItem>所有分类</BreadcrumbItem>
        <BreadcrumbItem v-for="item in classify" :key="item.id">
          <Tag color="#00adb5" closable @on-close="closeSort(item)">{{ item.name }}</Tag>
        </BreadcrumbItem>
      </Breadcrumb>
      <div class="control">
        <Button size="small" @click="show = !show" type="primary">
          <span>{{ show ? '收起' : '展开' }}</span>
          <Icon type="ios-arrow-down" :class="[show ? 'on' : '']" />
        </Button>
      </div>
    </div>
    <div :class="['options', show ? 'show' : '']">
      <div class="btn">
        <Button
          v-for="option in select"
          :key="option.id"
          @click="addSort(JSON.stringify(option))"
        >{{ option.typeName }}</Button>
        <Button v-if="!select.length" disabled>暂无分类</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getShopClassify } from "@/api/api";
export default {
  name: "shop-classify",
  computed: {
    condition() {
      return this.$store.state.shop.condition;
    },
    classify() {
      return this.$store.state.shop.classify;
    }
  },
  data() {
    return {
      // 初始数据
      dataArr: [],

      // 可选择数据
      select: [],

      show: true
    };
  },
  methods: {
    // 添加分类
    addSort(item) {
      let obj = JSON.parse(item);
      this.$store.commit("CHANGE_CLASSIFY", [
        ...this.classify,
        {
          id: obj.id,
          name: obj.typeName,
          children: obj.children
        }
      ]);
      this.select = obj.children || [];

      this.$store.commit("CHANGE_CONDITION", {
        ...this.condition,
        productType: obj.id,
        page: 1,
        productName: null,
        minProductPrice: null,
        maxProductPrice: null,
        productPrice: null,
        viewNum: null
      });
      this.$store.dispatch("getProductList");
    },
    // 关闭分类
    closeSort(item) {
      let index = -1;
      this.classify.forEach((_item, _index) => {
        if (item.id === _item.id) {
          index = _index;
        }
      });
      let newClassify = this.classify.splice(0, index);
      this.$store.commit("CHANGE_CLASSIFY", newClassify);
      this.select =
        (this.classify[this.classify.length - 1] &&
          this.classify[this.classify.length - 1].children) ||
        this.dataArr;

      this.$store.commit("CHANGE_CONDITION", {
        ...this.condition,
        productType:
          (this.classify[this.classify.length - 1] &&
            this.classify[this.classify.length - 1].id) ||
          null,
        page: 1,
        productName: null,
        minProductPrice: null,
        maxProductPrice: null,
        productPrice: null,
        viewNum: null
      });
      this.$store.dispatch("getProductList");
    }
  },
  created() {
    getShopClassify().then(res => {
      if (res.data.res) {
        this.dataArr = res.data.data;
        this.select = this.dataArr;
        if (this.classify.length) {
          this.select = this.classify[this.classify.length - 1].children || [];
        }
      }
    });
  }
};
</script>

<style lang="less">
.shop-classify {
  width: 100%;
  .title {
    height: 30px;
    line-height: 30px;
    .ivu-breadcrumb {
      float: left;
      .ivu-tag {
        .ivu-tag-text {
          position: relative;
          top: -1px;
        }
        .ivu-icon {
          position: relative;
          top: -2px;
        }
      }
    }
    .control {
      float: right;
      .ivu-btn {
        & > span {
          & > span {
            margin-right: 5px;
          }
          .ivu-icon {
            transition: all 0.3s;
            position: relative;
            top: -2px;
            &.on {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
  }
  .options {
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s;
    .btn {
      margin: 15px 0 0;
      padding: 20px;
      border: 1px solid #efefef;
      background: #fafafa;
      .ivu-btn {
        margin: 10px;
      }
    }
    &.show {
      max-height: 200px;
    }
  }
}
</style>