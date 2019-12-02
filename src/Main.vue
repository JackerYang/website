<template>
  <div class="Main">
    <!-- 头部 -->
    <div class="the-header">
      <!-- 轮播图 || 背景图 -->
      <main-carousel></main-carousel>
      <!-- logo user nav -->
      <Affix style="width: 100%;" :offset-top="-1" @on-change="isTrigger = $event">
        <div :class="['fixed', isTrigger ? 'top' : '']">
          <div class="wrap">
            <!-- logo -->
            <main-logo></main-logo>
            <!-- user -->
            <main-user></main-user>
            <!-- nav -->
            <main-nav></main-nav>
          </div>
        </div>
      </Affix>
    </div>

    <!-- 内容 -->
    <router-view class="main-content"></router-view>

    <!-- 底部 -->
    <div class="the-footer">
      <div class="top">
        <div class="item">
          <ul>
            <li>111 友情链接 111</li>
            <li>222 友情链接 222</li>
            <li>333 友情链接 333</li>
            <li>444 友情链接 444</li>
            <li>555 友情链接 555</li>
          </ul>
          <p>
            <img :src="code" />
          </p>
        </div>
        <div class="item">
          <p>地址：北京市海淀区中关村大街1号 邮编：000000</p>
          <p>联系我们 | 隐私版权</p>
        </div>
      </div>
      <div class="bottom">
        <div class="item" v-elLtWidth="ltWidthBottom">
          <p v-if="!bottomCollapse">Website test use, do not attack, thank you for your cooperation.</p>
          <p>Site designed by hahaha & powered by hehehe</p>
        </div>
      </div>
    </div>

    <!-- 右侧栏 -->
    <MainShop></MainShop>
    <MainChat></MainChat>
    <BackTop></BackTop>

    <TheChat></TheChat>
  </div>
</template>

<script>
import MainCarousel from "@/components/main/MainCarousel.vue";
import MainLogo from "@/components/main/MainLogo.vue";
import MainUser from "@/components/main/MainUser.vue";
import MainNav from "@/components/main/MainNav.vue";
import MainShop from "@/components/main/MainShop.vue";
import MainChat from "@/components/main/MainChat.vue";
import TheChat from "@/components/chat/TheChat.vue";
export default {
  name: "Main",
  components: {
    MainCarousel,
    MainLogo,
    MainUser,
    MainNav,
    MainShop,
    MainChat,
    TheChat
  },
  data() {
    return {
      // 是否固定在顶部
      isTrigger: false,
      code: require("./assets/img/code.png"),

      collapse: false,
      bottomCollapse: false
    };
  },
  methods: {
    // 控制底部显示方式
    ltWidthBottom(data) {
      let elWidth = parseInt(data.width);
      let needWidth = 1030;
      if (elWidth < needWidth) {
        this.bottomCollapse = true;
      } else {
        this.bottomCollapse = false;
      }
    }
  }
};
</script>

<style lang="less">
@import "./assets/less/common.less";
.Main {
  width: 100%;
  .the-header {
    width: 100%;
    height: 220px;
    position: relative;
    .ivu-affix {
      width: 100% !important;
    }
    .fixed {
      width: 100%;
      margin: 0 auto;
      height: 220px;
      position: relative;
      top: 0;
      left: 0;
      transition: all 0.5s;
      z-index: 2;
      .wrap {
        .content-width;
        margin: 0 auto;
        position: relative;
        top: 0;
        left: 0;
        height: 220px;
      }
      &.top {
        width: 100%;
        height: 64px;
        background: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        .wrap {
          .content-width;
          height: 64px;
          .main-logo {
            top: 4px;
            a {
              h1 {
                color: #333;
              }
            }
          }
          .main-user {
            display: none;
          }
          .main-nav {
            top: 20px;
            color: #333;
            & > li {
              .ivu-dropdown {
                position: relative;
                .ivu-select-dropdown {
                  background: #fff;
                  margin-top: 12px;
                  box-shadow: 1px 1px 3px #dedede, -1px 1px 3px #dedede;
                  .ivu-dropdown-menu {
                    .ivu-dropdown-item {
                      color: #333;
                      &:hover {
                        background: rgba(0, 0, 0, 0.1);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .main-content {
    min-height: ~"calc(100vh - 555px)";
  }
  .the-footer {
    width: 100%;
    margin-top: 100px;
    & > div {
      width: 100%;
      .item {
        .content-width;
        font-size: 14px;
      }
    }
    .top {
      height: 272px;
      background: @bg-color;
      padding: 50px 0 30px;
      .item {
        font-size: 15px;
        color: #fff;
        margin: 20px auto;
        &:first-child {
          height: 110px;
          ul {
            float: left;
          }
          p {
            float: right;
            img {
              height: 100px;
            }
          }
        }
        &:last-child {
          p {
            &:first-child {
              float: left;
            }
            &:last-child {
              float: right;
            }
          }
        }
      }
    }
    .bottom {
      background: @bg-color-dark;
      .item {
        height: 60px;
        line-height: 60px;
        color: #fff;
        margin: 0 auto;
        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:first-child {
            float: left;
          }
          &:last-child {
            float: right;
          }
        }
      }
    }
  }
}
</style>
