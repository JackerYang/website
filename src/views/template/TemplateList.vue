<template>
  <div class="template-list">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <div
        class="item"
        v-for="article in articles"
        @click="viewDetail(article.id)"
        :key="article.id"
      >
        <div class="desc">
          <h4>
            <span>●</span>
            {{ article.title }}
          </h4>
          <span class="time">
            <Icon type="ios-time-outline" />
            <span>{{ article.eventDate }}</span>
          </span>
        </div>
      </div>
      <the-empty v-if="!articles.length"></the-empty>
      <div class="control">
        <span class="show">显示第 {{ min }} 条到第 {{ max }} 条，</span>
        <div class="page">
          <Page
            :total="total"
            :current.sync="page"
            :page-size="pageSize"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
            show-sizer
            show-elevator
            show-total
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlateInfo } from "@/api/api";
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import TheEmpty from "../../components/common/TheEmpty.vue";
import { setTimeout } from "timers";
export default {
  name: "template-list",
  components: {
    BreadCrumbs,
    TheEmpty
  },
  computed: {
    plate() {
      let id = this.$route.path.split("/").reverse()[0];
      return this.$store.state.common.plates.filter(item => item.id == id)[0];
    },
    min() {
      let { total, page, pageSize } = this;
      return total === 0 ? 0 : (page - 1) * pageSize + 1;
    },
    max() {
      let { total, page, pageSize } = this;
      return total >= page * pageSize ? page * pageSize : total;
    }
  },
  data() {
    return {
      // 面包屑
      crumbImg: "",
      crumbs: [],

      total: 0,
      page: 1,
      pageSize: 10,

      articles: []
    };
  },
  methods: {
    // 查看详情
    viewDetail(_id) {
      let id = this.$route.path.split("/").reverse()[0];
      this.$router.push({
        name: "template-detail",
        params: { id, _id }
      });
    },

    // 获取数据
    getData() {
      let plate = this.$route.path.split("/").reverse()[0];
      getPlateInfo({
        plate,
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.data.res) {
          this.articles = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
    },

    // 切换 page || pageSize
    pageChange(page) {
      this.page = page;
      this.getData();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getData();
    },

    // 初始化
    init() {
      this.page = 1;
      this.pageSize = 10;
      this.getData();
    }
  },
  watch: {
    $route() {
      this.init();
    },
    plate() {
      this.crumbImg = this.plate.plateIcon;
      this.crumbs = [
        {
          name: this.plate.plateName
        }
      ];
    }
  },
  created() {
    this.init();
    setTimeout(() => {
      if (this.plate) {
        this.crumbImg = this.plate.plateIcon;
        this.crumbs = [
          {
            name: this.plate.plateName
          }
        ];
      }
    });
  }
};
</script>

<style lang="less">
@import "../../assets/less/common.less";
.template-list {
  width: 100%;
  .content {
    .content-width;
    margin: 50px auto 200px;
    .item {
      width: 100%;
      font-size: 14px;
      padding: 8px 15px;
      text-align: justify;
      border-top: 1px solid #eee;
      background: #fff;
      transition: all 0.5s;
      &:after {
        display: block;
        content: "";
        clear: both;
        visibility: hidden;
      }
      cursor: pointer;
      &:first-child {
        border-top: none;
      }
      .desc {
        height: 35px;
        line-height: 35px;
        h4 {
          span {
            color: @main-color;
          }
          float: left;
        }
        .time {
          font-size: 12px;
          color: #999;
          float: right;
          .ivu-icon {
            font-size: 14px;
            margin-right: 5px;
            position: relative;
            top: -1px;
          }
        }
      }
      &:hover {
        background: #f5f5f5;
        img {
          transform: scale(1.1);
        }
        .desc {
          h4 {
            color: @main-color;
          }
        }
      }
    }
    .control {
      font-size: 14px;
      float: right;
      margin: 80px auto 0;
      .show {
        line-height: 32px;
        float: left;
      }
      .page {
        float: left;
        a {
          display: inline;
        }
      }
    }
  }
}
</style>
