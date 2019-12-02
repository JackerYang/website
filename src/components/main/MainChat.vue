<template>
  <div class="main-chat">
    <Affix :offset-bottom="80">
      <div class="demo-affix">
        <Tooltip content="消息" placement="left">
          <Badge :count="msgCount" :offset="[5,5]">
            <span :class="['rel', msgCount ? 'has' : '']" @click="openChat">
              <Icon type="ios-chatbubbles" />
            </span>
          </Badge>
        </Tooltip>
      </div>
    </Affix>
  </div>
</template>

<script>
export default {
  name: "main-chat",
  computed: {
    msgCount() {
      let chatC = this.$store.getters.msgCountChat || 0;
      let customerC = this.$store.getters.msgCountCustomer || 0;
      return chatC + customerC;
    }
  },
  methods: {
    // 打开聊天窗口
    openChat() {
      this.$store.commit("CHANGE_SHOW", true);
    }
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 100;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 100;
  }
  100% {
    opacity: 0;
  }
}

.main-chat {
  .ivu-affix {
    z-index: 999;
    width: 48px !important;
    position: fixed;
    right: 30px;
    left: auto !important;
    .demo-affix {
      .ivu-tooltip {
        display: block;
        margin-top: 10px;
        .ivu-tooltip-rel {
          .rel {
            display: block;
            width: 48px;
            height: 40px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 2px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            color: #fff;
            font-size: 24px;
            text-align: center;
            &.has {
              .ivu-icon {
                animation: blink 1s infinite;
                -webkit-animation: blink 1s infinite;
              }
            }
            &:hover {
              color: @main-color;
            }
          }
        }
      }
    }
  }
}
</style>