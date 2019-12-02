<template>
  <div class="chat-header">
    <div class="tool">
      <div class="avatar">
        <img
          @click="viewInfo($event, user)"
          data-targetval="view"
          :src="userAvatar || require('../../assets/img/logo.png')"
        />
      </div>
      <div class="search">
        <p class="state">
          <span v-if="instanceState === 0" class="connecting">
            <Icon type="ios-loading" />
            {{ status[0] }}
          </span>
          <span v-if="instanceState === 1" class="open">
            <Icon type="md-checkmark-circle-outline" />
            {{ status[1] }}
          </span>
          <span v-if="instanceState === 2" class="closing">
            <Icon type="ios-loading" />
            {{ status[2] }}
          </span>
          <span v-if="instanceState === 3" class="closed">
            <Icon type="md-close-circle" />
            {{ status[3] }}
          </span>
        </p>
        <Input
          prefix="md-search"
          :value="searchKey"
          @on-change="change"
          @on-focus="$store.commit('SET_SHOW_SEARCH', true)"
          @on-blur="$store.commit('SET_SHOW_SEARCH', false)"
          clearable
          placeholder="搜索"
          size="small"
        />
      </div>
    </div>
    <div class="info">
      <p class="name">
        <span data-targetval="view" @click="viewInfo($event, chat)">{{ chat.userName }}</span>
      </p>
      <div class="btn">
        <Icon
          @click="$store.commit('CHANGE_SIZE', true)"
          v-if="!big"
          class="zoom"
          type="ios-square-outline"
          title="最大化"
        />
        <Icon
          @click="$store.commit('CHANGE_SIZE', false)"
          v-else
          class="zoom"
          type="ios-photos-outline"
          title="向下还原"
        />
        <Icon @click="close" class="close" type="md-close" title="关闭" />
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "../../libs/token";
export default {
  name: "chat-header",
  computed: {
    // 我的头像
    userAvatar() {
      return this.$store.getters.userAvatar;
    },
    // 登录用户
    user() {
      return this.$store.state.common.user;
    },
    // 是否显示
    show() {
      return this.$store.state.chat.show;
    },
    // 当前聊天
    chat() {
      return this.$store.state.chat.chat;
    },
    // 是否最大化
    big() {
      return this.$store.state.chat.big;
    },
    // socket状态
    instanceState() {
      return this.$store.state.chat.instanceState;
    },
    // 搜索关键字
    searchKey() {
      return this.$store.state.chat.searchKey;
    }
  },
  data() {
    return {
      status: {
        0: "正在连接...",
        1: "已连接",
        2: "正在断开...",
        3: "已断开"
      }
    };
  },
  methods: {
    // 关闭聊天窗口
    close() {
      this.$store.commit("SET_MULTIPLE_SELECT", false);
      this.$store.commit("SET_CHAT", {});
      this.$store.commit("SET_FRIEND", {});
      this.$store.commit("CHANGE_SHOW", false);
      if (this.instanceState !== 1) {
        return;
      }
      this.$store.dispatch("send_msg", { type: 10 });
    },
    // 改变搜索条件
    change(e) {
      this.$store.commit("SET_SEARCH_KEY", e.target.value);
    },
    // 详情
    viewInfo(e, data) {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      if (!getToken()) return;
      if (data.userName.indexOf("游客") > -1) return;

      // 数据
      if (data.loginName) {
        this.$store.commit("SET_INFO_MSG", data);
      } else {
        this.$store.dispatch("send_msg", { type: 6, data: data.anotherUserId });
      }
      // 位置
      let isOver = document.body.clientWidth < 300 + e.x;
      this.$store.commit("SET_INFO_POSITION", {
        top: e.y,
        left: isOver ? e.x - 300 : e.x
      });
      // 显示
      this.$store.commit("SET_INFO_SHOW", true);
    }
  }
};
</script>

<style lang="less">
@-webkit-keyframes my-rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes my-rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.chat-header {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #14b8ff, #b420ff);
  .tool {
    width: 250px;
    height: 100%;
    padding: 9px;
    float: left;
    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 3px;
      overflow: hidden;
      float: left;
      background: rgba(255, 255, 255, 0.3);
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
    .search {
      width: 180px;
      float: right;
      .state {
        font-size: 12px;
        position: relative;
        top: -2px;
        .ivu-icon {
          font-size: 14px;
        }
        .connecting {
          color: #fff;
          .ivu-icon {
            -webkit-animation: my-rotate 2s linear infinite;
            animation: my-rotate 2s linear infinite;
          }
        }
        .open {
          color: #19be35;
        }
        .closing {
          color: #ff9900;
          .ivu-icon {
            -webkit-animation: my-rotate 2s linear infinite;
            animation: my-rotate 2s linear infinite;
          }
        }
        .closed {
          color: #ed4014;
        }
      }
      .ivu-input-wrapper {
        .ivu-input-prefix {
          width: 24px;
          .ivu-icon {
            color: #c5c8ce;
          }
        }
        .ivu-input-with-prefix {
          padding: 1px 7px 1px 24px;
          background: rgba(255, 255, 255, 0.2);
          border: 0 none;
          outline: 0 none;
          color: #fff;
        }
        .ivu-input-icon {
          color: #c5c8ce;
          cursor: pointer;
        }
      }
    }
  }
  .info {
    width: ~"calc(100% - 250px)";
    height: 100%;
    float: right;
    position: relative;
    .name {
      width: 100%;
      font-size: 18px;
      color: #fff;
      position: absolute;
      bottom: 10px;
      padding: 0 15px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: center;
      span {
        cursor: pointer;
      }
    }
    .btn {
      position: absolute;
      right: 0;
      top: 0;
      .ivu-icon {
        color: #fff;
        font-size: 16px;
        padding: 5px 8px;
        cursor: pointer;
        &.zoom:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        &.close:hover {
          background: #f45454;
        }
      }
    }
  }
}
</style>