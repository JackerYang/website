<template>
  <div class="chat-message" id="message-list">
    <!-- 查看更多消息 -->
    <div class="more" v-if="chat.id">
      <p v-if="showViewMore && !loading" class="msgMore" @click="viewMore">查看更多消息</p>
      <p v-if="!showViewMore && !loading" class="noMsgMore">无更多消息</p>
      <Icon v-if="loading" type="ios-loading" />
    </div>

    <!-- 我的右键菜单 -->
    <v-contextmenu ref="mymsgrightmenu" @contextmenu="contextmenu">
      <v-contextmenu-item @click="recall">撤回</v-contextmenu-item>
      <v-contextmenu-item @click="del">删除</v-contextmenu-item>
      <v-contextmenu-item @click="multiple">多选</v-contextmenu-item>
    </v-contextmenu>
    <!-- 对方的右键菜单 -->
    <v-contextmenu ref="othermsgrightmenu" @contextmenu="contextmenu">
      <v-contextmenu-item @click="del">删除</v-contextmenu-item>
      <v-contextmenu-item @click="multiple">多选</v-contextmenu-item>
    </v-contextmenu>

    <!-- 消息列表 -->
    <div
      class="item"
      v-for="item in msgList"
      v-if="item.sysUserMsgList.filter(i => !i.isDelete).length"
      :key="item.lastMsgDate"
    >
      <div class="time">
        <Divider>
          <span>{{ item.lastMsgDateStr }}</span>
        </Divider>
      </div>
      <!-- 列表 -->
      <div class="message" v-for="msg in item.sysUserMsgList" v-if="!msg.isDelete" :key="msg.id">
        <!-- 撤回消息 -->
        <template v-if="msg.isRecall">
          <div class="tip" v-if="msg.fromUserId !== chat.anotherUserId">
            <span>你撤回了一条消息</span>
          </div>
          <div class="tip" v-else>
            <span>对方撤回了一条消息</span>
          </div>
        </template>

        <!-- 双方消息 -->
        <template v-if="!msg.isRecall">
          <div
            :is="multipleSelect ? 'Checkbox' : 'template'"
            size="large"
            :disabled="!msg.id"
            v-model="msg.select"
          ></div>
          <!-- 左 -->
          <div
            v-if="msg.fromUserId === chat.anotherUserId"
            :class="['others', 'clearfloat', multipleSelect ? 'multiple' : '', msg.select ? 'select' : '']"
          >
            <div class="avatar">
              <img
                data-targetval="view"
                @click="viewInfo($event, chat)"
                :src="chat.imgPath || require('../../assets/img/logo.png')"
              />
            </div>
            <Icon class="arrow" type="md-arrow-dropleft" />
            <div class="msg" :id="JSON.stringify(msg)" v-contextmenu:othermsgrightmenu>
              <!-- 文字、表情 -->
              <div class="msg-text" v-if="msg.msgType === 'text'">
                <p v-html="msg.msg"></p>
              </div>
              <!-- 图片 -->
              <div class="msg-img" v-else-if="msg.msgType.indexOf('image') > -1">
                <img
                  :src="msg.fileUrl"
                  title="点击预览"
                  @click="previewImg(msg.fileUrl)"
                  :draggable="false"
                />
              </div>
              <!-- 文件 -->
              <div v-else class="msg-file">
                <div class="info clearfloat">
                  <img class="icon" :src="getFileSrc(msg.fileName)" />
                  <span class="name" :title="msg.fileName">{{msg.fileName}}</span>
                </div>
                <div class="tool">
                  <Icon
                    title="点击下载"
                    @click="download(msg.fileUrl, msg.fileName)"
                    class="download"
                    type="md-download"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- 右 -->
          <div v-else :class="['myself', 'clearfloat', msg.select ? 'select' : '']">
            <div class="avatar">
              <img
                data-targetval="view"
                @click="viewInfo($event, user)"
                :src="userAvatar || require('../../assets/img/logo.png')"
              />
            </div>
            <Icon class="arrow" type="md-arrow-dropright" />
            <div class="msg" :id="JSON.stringify(msg)" v-contextmenu:mymsgrightmenu>
              <!-- 文字、表情 -->
              <div class="msg-text" v-if="msg.msgType === 'text'">
                <p v-html="msg.msg"></p>
                <Icon
                  v-if="(msg.percent || msg.percent === 0) && msg.percent < 100"
                  class="wait"
                  type="ios-loading"
                />
              </div>
              <!-- 图片 -->
              <div class="msg-img" v-else-if="msg.msgType.indexOf('image') > -1">
                <img
                  :src="msg.fileUrl"
                  title="点击预览"
                  :draggable="false"
                  @click="previewImg(msg.fileUrl)"
                />
                <div class="percent" v-if="(msg.percent || msg.percent === 0) && msg.percent < 100">
                  <Progress :percent="msg.percent" />
                </div>
                <Icon
                  class="close"
                  v-if="msg.uploadState === 'uploading'"
                  title="取消发送"
                  @click="close(msg.sign)"
                  type="md-close"
                />
                <span class="states" v-if="msg.uploadState === 'close'">已取消发送</span>
                <Icon
                  v-if="(msg.percent || msg.percent === 0) && msg.percent < 100 && msg.uploadState === 'uploading'"
                  class="wait"
                  type="ios-loading"
                />
              </div>
              <!-- 文件 -->
              <div v-else class="msg-file">
                <div class="info clearfloat">
                  <img class="icon" :src="getFileSrc(msg.fileName)" />
                  <span class="name" :title="msg.fileName">{{msg.fileName}}</span>
                </div>
                <div class="tool">
                  <Icon
                    title="点击下载"
                    @click="download(msg.fileUrl, msg.fileName)"
                    class="download"
                    type="md-download"
                  />
                </div>
                <div class="percent" v-if="(msg.percent || msg.percent === 0) && msg.percent < 100">
                  <Progress disabled :percent="msg.percent" />
                </div>
                <span class="states">
                  <span class="tip play" v-if="msg.uploadState === 'uploading'">正在发送...</span>
                  <span class="tip pause" v-if="msg.uploadState === 'pause'">暂停发送</span>
                  <span class="tip close" v-if="msg.uploadState === 'close'">已取消发送</span>
                </span>
                <span class="icons" v-if="msg.uploadState && msg.uploadState !== 'close'">
                  <Icon
                    class="play"
                    title="继续发送"
                    @click="play(msg.sign)"
                    v-if="msg.uploadState === 'pause'"
                    type="md-play"
                  />
                  <Icon class="pause" title="暂停发送" @click="pause(msg.sign)" v-else type="md-pause" />
                  <Icon class="close" title="取消发送" @click="close(msg.sign)" type="md-close" />
                </span>
                <Icon
                  v-if="(msg.percent || msg.percent === 0) && msg.percent < 100 && msg.uploadState === 'uploading'"
                  class="wait"
                  type="ios-loading"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadFile } from "../../libs/tools";
import { getToken } from "../../libs/token";
const word = require("../../assets/img/file-icon/word.png");
const excel = require("../../assets/img/file-icon/excel.png");
const file = require("../../assets/img/file-icon/file.png");
const pdf = require("../../assets/img/file-icon/pdf.png");
const ppt = require("../../assets/img/file-icon/ppt.png");
const rar = require("../../assets/img/file-icon/rar.png");
const zip = require("../../assets/img/file-icon/zip.png");
const txt = require("../../assets/img/file-icon/txt.png");
export default {
  name: "chat-message",
  computed: {
    // 我的头像
    userAvatar() {
      return this.$store.getters.userAvatar;
    },
    // 登录用户
    user() {
      return this.$store.state.common.user;
    },
    // 消息列表
    msgList() {
      let msgList = this.$store.state.chat.msgList;
      msgList.forEach(item => {
        item.sysUserMsgList.forEach(subItem => {
          // 将表情标识处理为表情展示
          if (subItem.msgType === "text") {
            let codeReg = /emoji_.{3}_emoji/g;
            let code = (subItem.msg && subItem.msg.match(codeReg)) || false;
            if (code) {
              code.forEach(i => {
                let name = i.split("_")[1] + ".png";
                let base64 = require(`../../assets/img/emoji/${name}`);
                let img = `<img src=${base64} class="emoji" draggable="false" />`;
                subItem.msg = subItem.msg.replace(i, img);
              });
            }
          }
        });
      });
      return msgList;
    },
    // 当前聊天
    chat() {
      return this.$store.state.chat.chat;
    },
    // 是否展示查看更多
    showViewMore() {
      return this.$store.state.chat.showViewMore;
    },
    // socket状态
    instanceState() {
      return this.$store.state.chat.instanceState;
    },
    // 是否登录
    isLogin() {
      return this.$store.getters.userName !== undefined;
    },
    // 当前页面 聊天|好友|客服
    currentTab() {
      return this.$store.state.chat.currentTab;
    },
    loading() {
      return this.$store.state.chat.loading;
    },
    // 发送数据的映射
    sendMap() {
      return this.$store.state.chat.sendMap;
    },

    // 预览
    viewer() {
      return this.$store.state.chat.viewer;
    },
    msgListImgs() {
      return this.$store.getters.msgListImgs;
    },
    // 是否多选
    multipleSelect() {
      return this.$store.state.chat.multipleSelect;
    }
  },
  data() {
    return {
      selectedMsg: {}
    };
  },
  methods: {
    // 查看更多消息
    viewMore() {
      if (this.instanceState !== 1) {
        this.$Message.warning("请检查连接状态！");
        return;
      }
      this.$store.commit("SET_LOADING", true);
      this.$store.dispatch("send_msg", {
        type: 2,
        isSysUser: getToken()
          ? this.currentTab === "游客"
            ? false
            : true
          : false,
        data: {
          anotherUserId: this.chat.anotherUserId,
          msgDateBottomLine: this.msgList[0].lastMsgDate
        }
      });
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
    },

    // 预览
    previewImg(fileUrl) {
      this.viewer.update();
      let index = -1;
      this.msgListImgs.forEach((item, _index) => {
        if (item.fileUrl === fileUrl) {
          index = _index;
        }
      });
      let el = document.querySelector(".preview-viewer");
      el.children[index].click();
    },

    // 下载
    download(url, fileName) {
      let _url = url + "&downloadName=" + fileName;
      downloadFile(_url, fileName);
    },

    // 滑轮滚动
    handleScroll(e) {
      let el = document.getElementById("message-list");
      if (
        this.chat.id &&
        this.showViewMore &&
        !this.loading &&
        el &&
        el.scrollTop === 0
      ) {
        if (e.wheelDelta) {
          //判断浏览器IE，谷歌滑轮事件
          if (e.wheelDelta > 0) {
            if (this.instanceState !== 1) {
              this.$Message.warning("请检查连接状态！");
              return;
            }
            this.viewMore();
          }
        } else if (e.detail) {
          //Firefox滑轮事件
          if (e.detail < 0) {
            if (this.instanceState !== 1) {
              this.$Message.warning("请检查连接状态！");
              return;
            }
            this.viewMore();
          }
        }
      }
    },

    // 文件图标
    getFileSrc(name) {
      if (!name) return file;
      let type = name.split(".").reverse()[0];
      let obj = {
        doc: word,
        docx: word,
        xls: excel,
        xlsx: excel,
        ppt: ppt,
        pptx: ppt,
        zip: zip,
        rar: rar,
        txt: txt,
        pdf: pdf
      };
      return obj[type] || file;
    },

    // 开始 || 暂停 || 取消
    play(sign) {
      this.sendMap[sign].uploadState = "uploading";
      this.$store.dispatch("send_msg", {
        type: 203,
        sign
      });
    },
    pause(sign) {
      this.sendMap[sign].uploadState = "pause";
    },
    close(sign) {
      this.sendMap[sign].uploadState = "close";
      this.$store.dispatch("send_msg", {
        type: 204,
        sign
      });
      delete this.sendMap[sign];
    },

    // 获取当前点击消息id
    contextmenu(el) {
      this.selectedMsg = JSON.parse(el.elm.id);
    },
    // 撤回
    recall() {
      if (!this.selectedMsg.id) {
        this.$Message.warning("消息正在发送，不能撤回。");
        return;
      }
      let isLast = false;
      this.msgList.forEach(i => {
        i.sysUserMsgList.forEach((_item, _index) => {
          if (_item.id === this.selectedMsg.id) {
            if (_index === i.sysUserMsgList.length - 1) {
              isLast = true;
            }
          }
        });
      });
      let oldTime = this.selectedMsg.createDate;
      let newTime = new Date().getTime();
      if (newTime - oldTime <= 120000) {
        let textObj = {
          type: 11,
          id: this.selectedMsg.id,
          toUserId: this.chat.anotherUserId,
          isLast
        };
        let fileObj = {
          ...textObj,
          msgType: this.selectedMsg.msgType,
          contentMD5: this.selectedMsg.contentMD5
        };
        if (this.selectedMsg.msgType !== "text") {
          this.$store.dispatch("send_msg", fileObj);
        } else {
          this.$store.dispatch("send_msg", textObj);
        }
      } else {
        this.$Message.warning("消息超过2分钟，不能撤回。");
      }
    },
    // 删除
    del() {
      if (!this.selectedMsg.id) {
        this.$Message.warning("消息正在发送，不能删除。");
        return;
      }

      let isLast = false;

      let showMsg = this.msgList.filter(i => {
        i.sysUserMsgList = i.sysUserMsgList.filter(item => !item.isDelete);
        return i.sysUserMsgList.length;
      });

      let endIndex = showMsg.length - 1;
      let _endIndex = showMsg[endIndex].sysUserMsgList.length - 1;
      let lastId = showMsg[endIndex].sysUserMsgList[_endIndex].id;

      this.msgList.forEach(i => {
        i.sysUserMsgList.forEach((_item, _index) => {
          if (_item.id === this.selectedMsg.id) {
            if (_item.id === lastId) {
              isLast = true;
            }
          }
        });
      });

      let data = () => {
        let { id, msgType, contentMD5 } = this.selectedMsg;
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
      };
      let obj = {
        type: 13,
        isLast,
        anotherUserId: this.chat.anotherUserId,
        data: [data()]
      };
      this.$store.dispatch("send_msg", obj);
    },
    // 多选
    multiple() {
      this.$store.commit("SET_MULTIPLE_SELECT", true);
    }
  },
  mounted() {
    let el = document.getElementById("message-list");
    el && el.addEventListener("mousewheel", this.handleScroll);
    el && el.addEventListener("DOMMouseScroll", this.handleScroll);
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
.chat-message {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow: auto;
  position: relative;
  .more {
    text-align: center;
    .msgMore {
      color: #14b8ff;
      cursor: pointer;
    }
    .noMsgMore {
      color: #ccc;
    }
    .ivu-icon {
      -webkit-animation: my-rotate 2s linear infinite;
      animation: my-rotate 2s linear infinite;
    }
  }
  .item {
    .time {
      text-align: center;
      user-select: none;
      margin: 15px 0;
      padding: 0 30px;
      .ivu-divider {
        .ivu-divider-inner-text {
          span {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
            padding: 3px 5px;
            color: #fff;
            font-size: 14px;
          }
        }
      }
    }
    .message {
      position: relative;
      .ivu-checkbox-wrapper {
        position: absolute;
        top: 17px;
        left: 20px;
      }
      .avatar {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        cursor: pointer;
        background: rgba(255, 255, 255, 1);
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .arrow {
        position: absolute;
        font-size: 24px;
      }
      .msg {
        max-width: 70%;
        .wait {
          font-size: 18px;
          -webkit-animation: my-rotate 2s linear infinite;
          animation: my-rotate 2s linear infinite;
          position: absolute;
          top: 50%;
          margin-top: -9px;
          z-index: 30;
        }
        &-text {
          text-align: justify;
          font-size: 14px;
          color: #444;
          padding: 5px 10px;
          border-radius: 5px;
          word-break: break-all;
          min-height: 35px;
          line-height: 25px;
          position: relative;
          .emoji {
            width: 31px;
            height: 25px;
            vertical-align: middle;
            padding: 0 3px;
          }
          & /deep/ .emoji {
            width: 31px;
            height: 25px;
            vertical-align: middle;
            padding: 0 3px;
          }
        }
        &-img {
          position: relative;
          img {
            width: 100%;
            height: 100%;
            max-width: 150px;
            max-height: 300px;
            min-height: 60px;
            display: block;
            cursor: pointer;
          }
          .percent {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, 0.5);
            .ivu-progress {
              width: 80%;
              margin-left: 10%;
              position: absolute;
              top: 50%;
              margin-top: -9px;
              .ivu-progress-outer {
                padding-right: 30px;
              }
              .ivu-progress-text {
                margin-left: 30px;
                color: #fff;
                .ivu-icon {
                  right: 4px;
                  top: 0;
                }
              }
            }
          }
          .close {
            position: absolute;
            top: 0;
            right: 0;
            color: #ed4014;
            font-size: 18px;
            background: rgba(255, 255, 255, 0.4);
            cursor: pointer;
          }
          .states {
            color: #ed4014;
            font-size: 12px;
            position: absolute;
            left: 10%;
            bottom: 2px;
            display: inline-block;
            text-align: center;
            width: 80%;
          }
        }
        &-file {
          background: #fff;
          width: 200px;
          line-height: 20px;
          position: relative;
          min-height: 60px;
          .percent {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, 0.4);
            .ivu-progress {
              width: 80%;
              margin-left: 10%;
              position: absolute;
              top: 50%;
              margin-top: -9px;
              left: 0;
              .ivu-progress-outer {
                padding-right: 30px;
              }
              .ivu-progress-text {
                margin-left: 30px;
                color: #fff;
                .ivu-icon {
                  right: 4px;
                  top: 0;
                }
              }
            }
          }
          .icons {
            font-size: 16px;
            position: absolute;
            left: 5px;
            bottom: 2px;
            cursor: pointer;
            .play {
              color: #19be6b;
            }
            .pause {
              color: #ff9900;
            }
            .close {
              color: #ed4014;
              margin-left: 5px;
            }
          }
          .states {
            position: absolute;
            left: 10%;
            bottom: 2px;
            display: inline-block;
            text-align: center;
            width: 80%;
            .tip {
              font-size: 14px;
              &.play {
                color: #19be6b;
              }
              &.pause {
                color: #ff9900;
              }
              &.close {
                color: #ed4014;
              }
            }
          }
          .info {
            padding: 7px;
            .icon {
              height: 40px;
              float: left;
              margin-right: 10px;
            }
            .name {
              font-size: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              display: -moz-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
            }
          }
          .tool {
            height: 24px;
            line-height: 24px;
            background: rgb(252, 252, 252);
            border-top: 1px solid #efefef;
            font-size: 18px;
            padding: 0 7px;
            .download {
              margin-top: 3px;
              float: right;
              cursor: pointer;
              &:hover {
                color: #98e165;
              }
            }
          }
        }
      }
      .myself {
        padding: 10px 30px;
        &.select {
          background: rgba(0, 169, 178, 0.1);
        }
        .avatar {
          float: right;
          margin-left: 10px;
        }
        .arrow {
          color: #98e165;
          right: 60px;
          top: 15.5px;
        }
        .msg {
          float: right;
          &-text {
            background: #98e165;
          }
          .wait {
            left: -25px;
          }
        }
      }
      .others {
        padding: 10px 30px;
        &.select {
          background: rgba(0, 169, 178, 0.1);
        }
        &.multiple {
          .avatar {
            margin-left: 20px;
          }
          .arrow {
            left: 80px;
          }
        }
        .avatar {
          float: left;
          margin-right: 10px;
        }
        .arrow {
          color: #fff;
          left: 60px;
          top: 15.5px;
        }
        .msg {
          float: left;
          &-text {
            background: #fff;
          }
          .wait {
            right: -25px;
          }
        }
      }
      .tip {
        text-align: center;
        user-select: none;
        padding: 10px 0;
        span {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          padding: 3px 5px;
          color: #fff;
        }
      }
    }
  }
  &::-webkit-scrollbar-thumb {
    background: #efefef;
    border-radius: 5px;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: #0000001a;
      border-radius: 3px;
    }
    &::-webkit-scrollbar {
      width: 8px;
    }
  }
}
</style>