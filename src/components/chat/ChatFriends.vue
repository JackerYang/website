<template>
  <div class="chat-friends">
    <!-- 最近消息 -->
    <div class="lists" v-if="isLogin && !showSearch && currentTab === '聊天'">
      <div
        :id="f.id+'|'+f.anotherUserId"
        @click="selectFriend(f)"
        v-for="f in chatList"
        :key="f.id"
        :class="['list', f.anotherUserId === chat.anotherUserId ? 'on' : '']"
        v-contextmenu:delchat
      >
        <Badge :count="f.unReadNum" :offset="[5,5]">
          <img :class="{gray: f.status === 0}" :src="f.imgPath" />
        </Badge>
        <div class="right-info">
          <p class="top">
            <span class="name">
              {{ f.userName }}
              <Icon v-if="f.status" title="在线" type="md-desktop" />
            </span>
            <span class="time">{{ f.lastMsgDateStr }}</span>
          </p>
          <p class="msg">
            <span v-html="f.lastMsg"></span>
          </p>
        </div>
      </div>
    </div>

    <!-- 好友列表 -->
    <div class="lists" v-if="isLogin && !showSearch && currentTab === '好友'">
      <div
        v-for="f in friendList"
        :key="f.id"
        :class="['list', f.id === friend.id ? 'on' : '']"
        @click="selectFriendToSend(f.id)"
      >
        <img :class="{gray: f.status === 0}" :src="f.imgPath" />
        <div class="right-info">
          <p class="view">
            <span class="name">
              {{ f.userName }}
              <Icon v-if="f.status" title="在线" type="md-desktop" />
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- 游客列表 -->
    <div class="lists" v-if="isLogin && isCustomerService && !showSearch && currentTab === '游客'">
      <div
        :id="c.id+'|'+c.anotherUserId"
        v-for="c in customerList"
        :key="c.id"
        :class="['list', c.anotherUserId === chat.anotherUserId ? 'on' : '']"
        @click="selectCustomer(c)"
        v-contextmenu:delchat
      >
        <Badge :count="c.unReadNum" :offset="[5,5]">
          <img :src="c.imgPath || require('../../assets/img/logo.png')" />
        </Badge>
        <div class="right-info">
          <p class="top">
            <span class="name">{{ c.userName }}</span>
            <span class="time">{{ c.lastMsgDateStr }}</span>
          </p>
          <p class="msg">
            <span v-html="c.lastMsg"></span>
          </p>
        </div>
      </div>
    </div>

    <!-- 控制器 -->
    <div class="tabs" v-if="isLogin && !showSearch">
      <span
        :class="[currentTab === item.title ? 'on' : '', isCustomerService ? 'three' : '']"
        @click="selectTab($event, item.title)"
        v-for="item in tabs"
        :key="item.title"
        :title="item.tip"
      >
        <Badge
          :count="item.title === '聊天' ? msgCountChat : item.title === '游客' ? msgCountCustomer : 0"
          :offset="[10,-4]"
        >
          <Icon :type="item.icon" />
          {{ item.title }}
        </Badge>
      </span>
    </div>

    <!-- 客服列表 未登录 -->
    <div class="lists customer" v-if="!isLogin && !showSearch">
      <div
        @click="selectCustomer(c)"
        v-for="c in customerList"
        :key="c.anotherUserId"
        :class="['list', c.anotherUserId === chat.anotherUserId ? 'on' : '']"
      >
        <Badge :count="c.unReadNum" :offset="[5,5]">
          <img :class="{gray: c.status === 0}" :src="c.imgPath" />
        </Badge>
        <div class="right-info">
          <p class="top">
            <span class="name">
              {{ c.userName }}
              <Icon v-if="c.status" title="在线" type="md-desktop" />
            </span>
            <span class="time">{{ c.lastMsgDateStr }}</span>
          </p>
          <p class="msg">
            <span v-html="c.lastMsg"></span>
          </p>
        </div>
      </div>
    </div>

    <!-- 搜索列表 -->
    <div class="lists search" v-if="showSearch">
      <div
        v-for="c in chatSearchList"
        :key="c.id"
        :class="['list', c.id === friend.id ? 'on' : '']"
        @mousedown="selectFriendToJump(c)"
      >
        <img :class="{gray: c.status === 0}" :src="c.imgPath" />
        <div class="right-info">
          <p class="view">
            <span class="name">
              {{ c.userName }}
              <Icon v-if="c.status" title="在线" type="md-desktop" />
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <v-contextmenu ref="delchat" @contextmenu="contextmenu">
      <v-contextmenu-item @click="delChat">删除聊天</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import { getToken } from "../../libs/token";
export default {
  name: "chat-friends",
  computed: {
    // 聊天列表
    chatList() {
      let msgList = this.$store.state.chat.chatList;
      if (!msgList.length) return;
      msgList.forEach(item => {
        // 表情
        if (!item.lastMsg) return;
        let codeReg = /emoji_.{3}_emoji/g;
        let code = item.lastMsg.match(codeReg) || false;
        if (code) {
          code.forEach(i => {
            let name = i.split("_")[1] + ".png";
            let base64 = require(`../../assets/img/emoji/${name}`);
            let img = `<img src=${base64} draggable="false" width=31 height=25 style="vertical-align: middle; padding: 0 3px;" />`;
            item.lastMsg = item.lastMsg.replace(i, img);
          });
        }
      });
      return msgList;
    },
    // 当前聊天
    chat() {
      return this.$store.state.chat.chat;
    },

    // 朋友列表
    friendList() {
      return this.$store.state.chat.friendList;
    },
    // 当前朋友
    friend() {
      return this.$store.state.chat.friend;
    },

    // 客服|游客列表
    customerList() {
      let msgList = this.$store.state.chat.customerList;
      if (!msgList.length) return;
      msgList.forEach(item => {
        // 表情
        if (!item.lastMsg) return;
        let codeReg = /emoji_.{3}_emoji/g;
        let code = item.lastMsg.match(codeReg) || false;
        if (code) {
          code.forEach(i => {
            let name = i.split("_")[1] + ".png";
            let base64 = require(`../../assets/img/emoji/${name}`);
            let img = `<img src=${base64} draggable="false" width=31 height=25 style="vertical-align: middle; padding: 0 3px;" />`;
            item.lastMsg = item.lastMsg.replace(i, img);
          });
        }
      });
      return msgList;
    },

    // 当前页面 聊天|好友|客服
    currentTab() {
      return this.$store.state.chat.currentTab;
    },

    // 是否登录
    isLogin() {
      return this.$store.getters.userName !== undefined;
    },
    // 当前登录用户是不是客服
    isCustomerService() {
      return this.$store.getters.isCustomerService;
    },

    msgCountChat() {
      return this.$store.getters.msgCountChat;
    },
    msgCountCustomer() {
      return this.$store.getters.msgCountCustomer;
    },

    // 是否展示搜索
    showSearch() {
      return this.$store.getters.showSearch;
    },
    chatSearchList() {
      return this.$store.getters.chatSearchList;
    },

    // socket状态
    instanceState() {
      return this.$store.state.chat.instanceState;
    }
  },
  data() {
    return {
      tabs: [
        {
          title: "聊天",
          tip: "最近联系记录",
          icon: "ios-text"
        },
        {
          title: "好友",
          tip: "查看好友列表",
          icon: "ios-people"
        },
        {
          title: "游客",
          tip: "查看游客列表",
          icon: "md-people"
        }
      ],
      delChatId: 0,
      delChatAnotherUserId: 0
    };
  },
  methods: {
    // 切换聊天|好友|游客
    selectTab(e, title) {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      if (this.chat.anotherUserId) {
        this.$store.dispatch("send_msg", { type: 10 });
      }
      this.$store.commit("SET_MULTIPLE_SELECT", false);
      this.$store.commit("CLEAR_MSG_LIST");
      this.$store.commit("SET_CHAT", {});
      this.$store.commit("SET_FRIEND", {});
      this.$store.commit("SET_TABS", title);
    },

    // 点击切换聊天窗口
    selectFriend(item) {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      this.$store.commit("SET_MULTIPLE_SELECT", false);
      this.$store.commit("CLEAR_MSG_LIST");
      this.$store.commit("SET_CHAT", item);
      this.$store.commit("SET_VIEW_MORE", true);
      this.$store.dispatch("send_msg", {
        type: 2,
        isSysUser: getToken()
          ? this.currentTab === "游客"
            ? false
            : true
          : false,
        data: {
          anotherUserId: item.anotherUserId
        }
      });
    },

    // 点击查看详情，可以发消息
    selectFriendToSend(id) {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      this.$store.dispatch("send_msg", { type: 6, data: id });
    },

    // 点击搜索结果的好友，跳到聊天页面
    selectFriendToJump(item) {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      this.$store.commit("CLEAR_MSG_LIST");
      let id = getToken() ? item.id : item.anotherUserId;
      if (getToken()) {
        this.$store.dispatch("send_msg", {
          type: 7,
          data: id
        });
      }
      this.$store.commit("SET_CHAT", {
        ...item,
        anotherUserId: id
      });
      this.$store.dispatch("send_msg", {
        type: 2,
        isSysUser: getToken()
          ? this.currentTab === "游客"
            ? false
            : true
          : false,
        data: {
          anotherUserId: id
        }
      });
      this.$store.commit("SET_SEARCH_KEY", "");
      this.$store.commit("SET_SHOW_SEARCH", false);
    },

    // 选择客服||游客 查看聊天记录
    selectCustomer(item) {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      this.$store.commit("CLEAR_MSG_LIST");
      this.$store.commit("SET_CHAT", item);
      this.$store.commit("SET_VIEW_MORE", true);
      this.$store.dispatch("send_msg", {
        type: 2,
        isSysUser: getToken()
          ? this.currentTab === "游客"
            ? false
            : true
          : false,
        data: {
          anotherUserId: item.anotherUserId
        }
      });
    },

    // 删除聊天
    contextmenu(el) {
      let [id, delChatAnotherUserId] = el.elm.id.split("|");
      this.delChatId = Number(id);
      this.delChatAnotherUserId = delChatAnotherUserId;
    },
    delChat() {
      this.$store.dispatch("send_msg", {
        type: 12,
        id: this.delChatId,
        anotherUserId: this.delChatAnotherUserId
      });
    }
  }
};
</script>

<style lang="less" scoped>
.chat-friends {
  width: 100%;
  height: 100%;
  .lists {
    width: 100%;
    height: ~"calc(100% - 40px)";
    overflow: auto;
    background: #efefef;
    &::-webkit-scrollbar-thumb {
      background: #efefef;
      border-radius: 3px;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
      }
      &::-webkit-scrollbar {
        width: 6px;
      }
    }
    .list {
      width: 100%;
      height: 60px;
      padding: 10px;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
        border-radius: 3px;
        float: left;
        &.gray {
          -webkit-filter: grayscale(100%);
          -moz-filter: grayscale(100%);
          -ms-filter: grayscale(100%);
          -o-filter: grayscale(100%);
          filter: grayscale(100%);
          filter: #444;
        }
      }
      .right-info {
        width: 180px;
        float: right;
        .top {
          width: 100%;
          .name {
            max-width: 125px;
            font-size: 14px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            float: left;
          }
          .time {
            color: #999;
            float: right;
          }
        }
        .ivu-icon {
          position: relative;
          top: -2px;
        }
        .view {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
        }
        .msg {
          width: 100%;
          max-height: 25px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999;
        }
      }
      &:hover {
        background: #e5e5e5;
      }
      &.on {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .tabs {
    width: 100%;
    height: 40px;
    background: #fff;
    & > span {
      width: 50%;
      height: 40px;
      line-height: 40px;
      float: left;
      background: #fafafa;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      .ivu-icon {
        font-size: 24px;
      }
      &.on {
        background: #6464ff;
        color: #fff;
      }
      &.three {
        width: 33.33%;
      }
    }
  }
  .lists.customer {
    height: 100%;
  }
  .lists.search {
    height: 100%;
    z-index: 9;
  }
}
</style>