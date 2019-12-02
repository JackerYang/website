<template>
  <div class="company-impression">
    <bread-crumbs :data="crumbs" :icon="crumbImg"></bread-crumbs>
    <div class="content">
      <div class="title" v-if="timelines.length">
        <h2>企业发展大事记</h2>
        <p>Development Memorabilia</p>
      </div>

      <div class="all clearfloat">
        <div class="nav">
          <Menu ref="impression-menu" @on-select="selectYear" :active-name="currentYear">
            <MenuItem v-for="year in years" :key="year" :name="year">{{ year }} 年</MenuItem>
          </Menu>
        </div>
        <div class="line" v-if="timelines.length">
          <Timeline>
            <TimelineItem v-for="timeline in timelines" :key="timeline.id">
              <p class="time">{{ timeline.eventDate }}</p>
              <div class="html" title="查看详情" @click="viewDetail(timeline.id)">
                <h3>{{ timeline.title }}</h3>
                <p class="text" v-html="timeline.content"></p>
              </div>
            </TimelineItem>
          </Timeline>
        </div>
        <the-empty v-else></the-empty>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
import TheEmpty from "../../components/common/TheEmpty.vue";
import { getOrgImpression, getOrgImpressionYear } from "@/api/api";
export default {
  name: "company-impression",
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
          name: "企业印象"
        }
      ],

      // 时间轴
      timelines: [],

      years: [],

      currentYear: ""
    };
  },
  methods: {
    // 查看详情
    viewDetail(id) {
      this.$router.push({
        name: "company-impression-detail",
        params: {
          id
        }
      });
    },
    // 获取数据
    getData(year) {
      getOrgImpression(year).then(res => {
        if (res.data.res) {
          this.timelines = res.data.data.map(item => {
            item.content = item.content
              ? item.content
                  .replace(/<[^>]+>/g, "")
                  .replace(/　/g, "")
                  .slice(0, 60) + "..."
              : "";
            return item;
          });
        }
      });
    },
    // 选择年份
    selectYear(name) {
      this.currentYear !== name && this.getData(name);
      this.currentYear = name;
    }
  },
  created() {
    getOrgImpressionYear().then(res => {
      if (res.data.res) {
        this.years = res.data.data;
        this.selectYear(this.years[0]);
        this.$nextTick(() => {
          this.currentYear = this.years[0];
          this.$refs["impression-menu"].updateActiveName();
        });
      }
    });
  }
};
</script>

<style lang="less">
@import "../../assets/less/common.less";
.company-impression {
  width: 100%;
  overflow: hidden;
  .content {
    .content-width;
    margin: 0 auto;
    overflow: auto;
    .title {
      text-align: center;
      margin: 30px 0;
      h2 {
        font-size: 26px;
      }
      p {
        font-size: 14px;
      }
    }
    .all {
      width: 700px;
      margin: 50px auto;
      .nav {
        width: 100px;
        float: left;
        text-align: center;
        position: relative;
        left: 1px;
        .ivu-menu {
          width: 100px !important;
        }
      }
      .line {
        float: right;
        @timeline-width: 580px;
        width: @timeline-width;
        width: ~"calc(@{timeline-width} + 20px)";
        border-left: 1px solid #dcdee2;
        .ivu-timeline {
          width: @timeline-width;
          margin-left: 20px;
          .ivu-timeline-item {
            padding-bottom: 20px;
            &:last-child {
              padding-bottom: 0;
            }
            .time {
              font-size: 16px;
              position: relative;
              top: -3px;
            }
            .html {
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              text-align: left;
              cursor: pointer;
              .text {
                text-align: justify;
              }
            }
          }
          // .ivu-timeline-item {
          //   padding-bottom: 20px;
          //   .ivu-timeline-item-tail {
          //     left: ~"calc(@{timeline-width}/2)";
          //   }
          //   .ivu-timeline-item-head {
          //     left: ~"calc(@{timeline-width}/2 - 6px)";
          //     border-color: @main-color;
          //   }
          //   .ivu-timeline-item-content {
          //     padding: 0;
          //     width: ~"calc(@{timeline-width}/2)";
          //     text-align: justify;
          //     margin-bottom: 20px;
          //     .time {
          //       font-size: 16px;
          //       position: relative;
          //       top: -3px;
          //       padding: 0 15px;
          //     }
          //     .html {
          //       padding: 10px;
          //       width: ~"calc(@{timeline-width}/2 - 20px)";
          //       margin: 0 10px;
          //       border: 1px solid #ccc;
          //       border-radius: 5px;
          //       text-align: left;
          //       cursor: pointer;
          //       .text {
          //         text-align: justify;
          //       }
          //     }
          //   }
          //   &:nth-child(odd) {
          //     .ivu-timeline-item-content {
          //       text-align: right;
          //       .html {
          //         text-align: right;
          //       }
          //     }
          //   }
          //   &:nth-child(even) {
          //     .ivu-timeline-item-content {
          //       margin-left: auto;
          //     }
          //   }
          // }
        }
      }
    }
  }
}
</style>
