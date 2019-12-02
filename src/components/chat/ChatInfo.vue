<template>
  <div class="chat-info">
    <!-- 好友详情页 -->
    <div class="container" v-if="friend.id">
      <div class="top clearfloat">
        <span>
          <span class="name">{{ friend.userName }}</span>
          <span class="sex">
            <Icon
              :type="friend.userSex === 0 ? 'md-male' : friend.userSex === 1 ? 'md-female' : ''"
              :class="[friend.userSex === 0 ? 'male' : friend.userSex === 1 ? 'female' : '']"
            />
          </span>
        </span>
        <img :src="friend.imgPath" />
      </div>
      <div class="middle">
        <p>
          <span class="tip">登&ensp;录&ensp;名</span>
          <span class="val">{{ friend.loginName }}</span>
        </p>
        <p>
          <span class="tip">手&ensp;机&ensp;号</span>
          <span class="val">{{ friend.phone }}</span>
        </p>
        <p>
          <span class="tip">所属机构</span>
          <span class="val">{{ friend.orgName }}</span>
        </p>
        <p>
          <span class="tip">后台权限</span>
          <span class="val">{{ friend.haveAuthority ? "有后台权限" : "无后台权限" }}</span>
        </p>
      </div>
      <div class="bottom">
        <p @click="sendMsg(friend)">发消息</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat-info",
  computed: {
    // 好友列表
    friendList() {
      return this.$store.state.chat.friendList;
    },
    // 当前朋友（在好友页）
    friend() {
      return this.$store.state.chat.friend;
    },
    // socket状态
    instanceState() {
      return this.$store.state.chat.instanceState;
    }
  },
  methods: {
    sendMsg(friend) {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      this.$store.commit("SET_CHAT", {
        ...friend,
        anotherUserId: friend.id
      });
      this.$store.dispatch("send_msg", {
        type: 2,
        isSysUser: true,
        data: {
          anotherUserId: friend.id
        }
      });
      this.$store.dispatch("send_msg", {
        type: 7,
        data: friend.id
      });
    }
  }
};
</script>

<style lang="less" scoped>
.chat-info {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f5f5f5;
  .container {
    width: 400px;
    height: 400px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .top {
      border-bottom: 1px solid #cfcfcf;
      padding-bottom: 40px;
      & > span {
        float: left;
        font-size: 18px;
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
          top: -10px;
          margin-left: 10px;
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
    .middle {
      padding: 40px 0;
      border-bottom: 1px solid #cfcfcf;
      p {
        font-size: 14px;
        padding: 5px 0;
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
    .bottom {
      text-align: center;
      padding-top: 40px;
      p {
        margin: 0 auto;
        width: 140px;
        height: 40px;
        line-height: 40px;
        background: rgb(100, 100, 255);
        color: #fff;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          background: rgba(100, 100, 255, 0.8);
        }
      }
    }
  }
}
</style>