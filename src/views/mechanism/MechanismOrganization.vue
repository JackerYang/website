<template>
  <div class="mechanism-organization">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <div class="tree" v-if="data">
        <vue2-org-tree
          name="organization"
          :data="data"
          :props="props"
          :horizontal="horizontal"
          :collapsable="collapsable"
          :label-class-name="labelClassName"
          @on-node-click="onNodeClick"
        />
      </div>
      <the-empty v-else></the-empty>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import { getSysOrg } from "@/api/api";
import TheEmpty from "../../components/common/TheEmpty.vue";
export default {
  name: "mechanism-organization",
  components: {
    BreadCrumbs,
    TheEmpty
  },
  data() {
    return {
      // 面包屑
      crumbImg: require("../../assets/img/icon.png"),
      crumbs: [
        {
          name: "机构设置"
        },
        {
          name: "组织结构"
        }
      ],

      props: {
        label: "orgName",
        children: "children",
        expand: "expand"
      },

      // 数据
      data: {},
      horizontal: false,
      collapsable: false,
      labelClassName: "bg-white"
    };
  },
  methods: {
    onNodeClick(e, data) {
      this.$Modal.info({
        title: data.orgName,
        content: data.remark
      });
    }
  },
  created() {
    getSysOrg().then(res => {
      if (res.data.res) {
        this.data = res.data.data ? res.data.data[0] : null;
      }
    });
  }
};
</script>

<style lang="less">
@import "../../assets/less/common.less";
.mechanism-organization {
  width: 100%;
  .content {
    .content-width;
    height: 100%;
    margin: 0 auto;
    .tree {
      margin: 50px 0;
      width: 100%;
      min-height: 300px;
      text-align: center;
      .bg-white {
        cursor: pointer;
        font-size: 14px;
      }
    }
    .the-empty {
      margin-top: 60px;
    }
  }
}
</style>
