<template>
  <div class="message-multiple">
    <Icon class="close" type="md-close" title="关闭" @click="close" />
    <div class="btns">
      <div class="btn" v-for="item in items">
        <Button
          size="large"
          shape="circle"
          :disabled="!selectMsgList.length"
          @click="item.fn()"
          :icon="item.icon"
        ></Button>
        <p class="tip">{{ item.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "message-multiple",
  computed: {
    msgList() {
      return this.$store.state.chat.msgList;
    },
    // 选中的消息列表
    selectMsgList() {
      return this.$store.getters.selectMsgList;
    },
    // 当前聊天
    chat() {
      return this.$store.state.chat.chat;
    }
  },
  data() {
    return {
      items: [
        {
          title: "删除",
          icon: "ios-trash-outline",
          fn: this.delete
        }
      ]
    };
  },
  methods: {
    // 关闭
    close() {
      this.msgList.forEach(i => {
        i.sysUserMsgList.forEach(item => {
          item.select = null;
        });
      });

      this.$store.commit("SET_MULTIPLE_SELECT", false);
    },

    // 删除
    delete() {
      let selectIds = this.selectMsgList.map(i => i.id);
      let isLast = false;

      // 没有删除也没有撤销消息的数组
      let showMsg = this.msgList.filter(i => {
        i.sysUserMsgList = i.sysUserMsgList.filter(item => !item.isDelete);
        return i.sysUserMsgList.length;
      });

      // 最后一条没有删除也没有撤销消息的id
      let endIndex = showMsg.length - 1;
      let _endIndex = showMsg[endIndex].sysUserMsgList.length - 1;
      let lastId = showMsg[endIndex].sysUserMsgList[_endIndex].id;

      this.msgList.forEach(i => {
        i.sysUserMsgList.forEach((_item, _index) => {
          if (selectIds.includes(_item.id)) {
            if (_item.id === lastId) {
              isLast = true;
            }
          }
        });
      });

      let sendData = this.selectMsgList.map(item => {
        let { id, msgType, contentMD5 } = item;
        if (msgType !== "text") {
          return {
            id,
            msgType,
            contentMD5
          };
        } else {
          return {
            id
          };
        }
      });

      let obj = {
        type: 13,
        isLast,
        anotherUserId: this.chat.anotherUserId,
        data: sendData
      };
      this.$store.dispatch("send_msg", obj);
      this.close();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/common.less");
.message-multiple {
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 1px 1px 3px #efefef, -1px -1px 3px #efefef;
  position: relative;
  text-align: center;
  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      color: #ed4014;
    }
  }
  .btns {
    padding-top: 45px;
    .btn {
      margin: 0 20px;
      display: inline-block;
      .ivu-btn {
        font-size: 24px;
        color: #666;
        &:hover {
          color: @main-color;
        }
      }
      .tip {
        font-size: 14px;
        text-align: center;
      }
    }
  }
}
</style>