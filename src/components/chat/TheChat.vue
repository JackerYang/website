<template>
  <div class="hole" v-if="show">
    <div :class="['the-chat', big ? 'big' : '']">
      <!-- 头部 -->
      <div class="header">
        <chat-header></chat-header>
      </div>

      <!-- 左侧 -->
      <div class="left">
        <chat-friends></chat-friends>
      </div>

      <!-- 右侧 -->
      <div class="right">
        <!-- 聊天 -->
        <div class="view" v-if="currentTab === '聊天'">
          <chat-empty v-if="!chat.id"></chat-empty>
          <template v-else>
            <div class="msgs">
              <chat-message></chat-message>
            </div>
            <div class="send">
              <chat-send v-if="!multipleSelect"></chat-send>
              <message-multiple v-else></message-multiple>
            </div>
          </template>
        </div>

        <!-- 好友 -->
        <div class="view" v-if="currentTab === '好友'">
          <chat-empty v-if="!friend.id"></chat-empty>
          <chat-info v-else></chat-info>
        </div>

        <!-- 游客 -->
        <div class="view" v-if="currentTab === '游客'">
          <chat-empty v-if="!chat.id"></chat-empty>
          <template v-else>
            <div class="msgs">
              <chat-message></chat-message>
            </div>
            <div class="send">
              <chat-send v-if="!multipleSelect"></chat-send>
              <message-multiple v-else></message-multiple>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 好友信息框 -->
    <div
      class="show-info"
      v-if="infoShow"
      v-clickOutside="closeHandler"
      :style="{
        top: infoPosition.top + 'px',
        left: infoPosition.left + 'px',
      }"
    >
      <div class="container">
        <div class="top clearfloat">
          <span>
            <span class="name">{{ infoMsg.userName }}</span>
            <span class="sex">
              <Icon
                :type="infoMsg.userSex === 0 ? 'md-male' : infoMsg.userSex === 1 ? 'md-female' : ''"
                :class="[infoMsg.userSex === 0 ? 'male' : infoMsg.userSex === 1 ? 'female' : '']"
              />
            </span>
          </span>
          <img :src="infoMsg.imgPath" />
        </div>
        <div class="bottom">
          <p>
            <span class="tip">登&ensp;录&ensp;名</span>
            <span class="val">{{ infoMsg.loginName }}</span>
          </p>
          <p>
            <span class="tip">手&ensp;机&ensp;号</span>
            <span class="val">{{ infoMsg.phone }}</span>
          </p>
          <p>
            <span class="tip">所属机构</span>
            <span class="val">{{ infoMsg.orgName }}</span>
          </p>
          <p>
            <span class="tip">后台权限</span>
            <span class="val">{{ infoMsg.haveAuthority ? "有后台权限" : "无后台权限" }}</span>
          </p>
        </div>
      </div>
    </div>

    <viewer @inited="inited" class="preview-viewer">
      <img
        v-for="img in msgListImgs"
        :key="img.fileUrl"
        :id="img.originUrl || img.fileUrl"
        :src="img.fileUrl"
        title="点击预览"
        :draggable="false"
        style="display: none;"
      />
    </viewer>
  </div>
</template>

<script>
import ChatHeader from "./ChatHeader.vue";
import ChatFriends from "./ChatFriends.vue";
import ChatMessage from "./ChatMessage.vue";
import ChatSend from "./ChatSend.vue";
import ChatInfo from "./ChatInfo.vue";
import ChatEmpty from "./ChatEmpty.vue";
import MessageMultiple from "./MessageMultiple.vue";
export default {
  name: "the-chat",
  components: {
    ChatHeader,
    ChatFriends,
    ChatMessage,
    ChatSend,
    ChatInfo,
    ChatEmpty,
    MessageMultiple
  },
  computed: {
    // 是否展示
    show() {
      return this.$store.state.chat.show;
    },
    // 是否最大化
    big() {
      return this.$store.state.chat.big;
    },
    // 当前页面
    currentTab() {
      return this.$store.state.chat.currentTab;
    },
    // 当前朋友（在好友页）
    friend() {
      return this.$store.state.chat.friend;
    },
    // 当前聊天
    chat() {
      return this.$store.state.chat.chat;
    },
    // 详情框
    infoMsg() {
      return this.$store.state.chat.infoMsg;
    },
    infoShow() {
      return this.$store.state.chat.infoShow;
    },
    infoPosition() {
      return this.$store.state.chat.infoPosition;
    },
    // 图片预览
    msgListImgs() {
      return this.$store.getters.msgListImgs;
    },
    // 是否多选
    multipleSelect() {
      return this.$store.state.chat.multipleSelect;
    }
  },
  methods: {
    // 关闭弹窗
    closeHandler() {
      this.$store.commit("SET_INFO_MSG", {});
      this.$store.commit("SET_INFO_POSITION", {});
      this.$store.commit("SET_INFO_SHOW", false);
    },

    inited(viewer) {
      this.$store.commit("SET_VIEWER", viewer);
    }
  },
  mounted() {
    window.onbeforeunload = () => {
      this.$store.dispatch("send_msg", {
        type: 401
      });
    };
  },
  created() {
    this.$store.dispatch("set_instance", this);

    // 断开重连机制
    setInterval(() => {
      let instance = this.$store.state.chat.instance;
      let state = instance ? instance.readyState : 3;
      this.$store.commit("CHANGE_STATE", state);
      if (state === 3) {
        this.$store.dispatch("set_instance", this);
      }
    }, 1000);
  }
};
</script>

<style lang="less">
.hole {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  .the-chat {
    width: 50vw;
    min-width: 800px;
    height: 70vh;
    min-height: 600px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;
    transition: all 0.3s;
    .header {
      width: 100%;
      height: 60px;
    }
    .left {
      width: 250px;
      height: ~"calc(100% - 60px)";
      float: left;
    }
    .right {
      width: ~"calc(100% - 250px)";
      height: ~"calc(100% - 60px)";
      float: right;
      .view {
        width: 100%;
        height: 100%;
        background: #fff;
        .msgs {
          width: 100%;
          height: ~"calc(100% - 150px)";
        }
        .send {
          width: 100%;
          height: 150px;
        }
      }
    }
    &.big {
      width: 100vw;
      height: 100vh;
    }
  }
  .show-info {
    width: 300px;
    background: #fff;
    position: absolute;
    padding: 20px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1), -1px -1px 5px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    .container {
      width: 100%;
      height: 100%;
      .top {
        border-bottom: 1px solid #cfcfcf;
        padding-bottom: 20px;
        & > span {
          float: left;
          font-size: 16px;
          font-weight: bold;
          .name {
            display: inline-block;
            max-width: 320px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .sex {
            display: inline-block;
            position: relative;
            top: -8px;
            margin-left: 5px;
            .ivu-icon {
              &.male {
                color: rgb(70, 180, 239);
              }
              &.female {
                color: #f37d7d;
              }
            }
          }
        }
        img {
          width: 60px;
          height: 60px;
          border-radius: 3px;
          overflow: hidden;
          float: right;
        }
      }
      .bottom {
        padding: 20px 0 0;
        p {
          font-size: 14px;
          padding: 2px 0;
          .tip {
            display: inline-block;
            width: 80px;
            color: #999999;
          }
          .val {
            max-width: 320px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  // .preview {
  //   position: fixed;
  //   width: 520px;
  //   max-height: 80vh;
  //   background: #fff;
  //   z-index: 1000;
  //   border-radius: 5px;
  //   top: 20vh;
  //   left: ~"calc(50% - 260px)";
  //   box-shadow: 1px 1px 3px #eee, -1px -1px 3px #eee;
  //   .title {
  //     height: 50px;
  //     line-height: 50px;
  //     text-align: center;
  //     font-size: 16px;
  //     font-weight: bold;
  //     border-bottom: 1px solid #efefef;
  //   }
  //   .img {
  //     padding: 20px;
  //     text-align: center;
  //     border-bottom: 1px solid #efefef;
  //     img {
  //       max-width: 100%;
  //       max-height: 60vh;
  //       width: auto;
  //       height: auto;
  //     }
  //   }
  //   .footer {
  //     height: 64px;
  //     text-align: right;
  //     padding: 15px 20px;
  //   }
  // }
}
</style>