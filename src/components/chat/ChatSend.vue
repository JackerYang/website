<template>
  <div class="chat-send">
    <div class="tool">
      <!-- 表情包 -->
      <div class="emojis" v-clickOutside="() => {show = false}">
        <Icon type="md-happy" title="表情" :class="[show ? 'on' : '']" @click="show = !show" />
        <div v-if="show" class="con">
          <div class="box">
            <span v-for="img in emoji" :key="img.code" @click="selectEmoji($event, img)">
              <img
                :src="require('../../assets/img/emoji/'+img.file)"
                :draggable="false"
                :alt="img.title"
              />
            </span>
          </div>
        </div>
      </div>
      <!-- 文件 -->
      <div class="pics">
        <Icon type="ios-folder-outline" @click="$refs['upload-none'].click()" title="图片/文件" />
        <input ref="upload-none" multiple @change="uploadFile" class="upload" type="file" />
      </div>
    </div>

    <!-- 输入框 -->
    <div
      ref="input-editor"
      @keyup="handleKeyUp"
      @blur="handleBlur"
      @click="handleFoucs"
      class="input"
      contenteditable="true"
      v-html="msg"
    ></div>

    <Button type="primary" :disabled="instanceState !== 1 || !chat.id" size="small" @click="send">发送</Button>
  </div>
</template>

<script>
import { insertHtmlAfterRange, base64ToBlob, toFourString } from "@/libs/tools";
import emoji from "@/libs/emoji";
export default {
  name: "chat-send",
  computed: {
    // 当前聊天
    chat() {
      return this.$store.state.chat.chat;
    },
    // socket实例
    instance() {
      return this.$store.state.chat.instance;
    },
    // socket状态
    instanceState() {
      return this.$store.state.chat.instanceState;
    },
    // 当前页面 聊天|好友|客服
    currentTab() {
      return this.$store.state.chat.currentTab;
    },
    // 发送数据的映射
    sendMap() {
      return this.$store.state.chat.sendMap;
    },
    // 分割文件大小
    separateSize() {
      return this.$store.state.chat.separateSize;
    }
  },
  watch: {
    "chat.anotherUserId": {
      deep: true,
      handler() {
        let el = this.$refs["input-editor"];
        el.innerHTML = "<br>";
        this.msg = "";
        el.focus();
      }
    }
  },
  data() {
    return {
      msg: "",
      emoji: emoji,

      show: false,

      range: {},
      selection: {},

      // 临时存储文件
      fileObj: {}
    };
  },
  methods: {
    // 选择表情
    selectEmoji(e, img) {
      let base64 = require(`../../assets/img/emoji/${img.file}`);
      let el = e.target.tagName === "IMG" ? e.target : e.target.children[0];
      let node = el.cloneNode(true);
      node.setAttribute("class", "emoji");
      node.setAttribute("draggable", "false");
      node.setAttribute("code", img.code);
      this.range.insertNode(node);
      this.setCursor(node, false);
      this.show = false;
    },

    // 选择文件
    uploadFile(e) {
      let files = [...e.target.files];
      files.forEach((file, index) => {
        let signFile = new Date().getTime() + index;
        if (file.type.indexOf("image") > -1) {
          // 创建图片 加上base64，便于本地展示
          this.fileObj[signFile] = file;
          let reader = new FileReader();
          reader.onload = evt => {
            file.base64Src = evt.target.result;
            let node = document.createElement("img");
            node.setAttribute("src", file.base64Src);
            node.setAttribute("draggable", "false");
            node.setAttribute("class", "img");
            node.setAttribute("sign", signFile);
            // 将文件或图片放置光标位置
            this.range.insertNode(node);
            this.setCursor(node, false);
          };
          reader.readAsDataURL(file);
        } else {
          // 创建文件
          this.fileObj[signFile] = file;
          let node = document.createElement("input");
          node.setAttribute("class", "file");
          node.setAttribute("disabled", true);
          node.setAttribute("title", file.name);
          node.setAttribute("value", file.name);
          node.setAttribute("sign", signFile);
          // 将文件或图片放置光标位置
          this.range.insertNode(node);
          this.setCursor(node, false);
        }
      });
      // 清空input
      let ele = this.$refs["upload-none"];
      ele.setAttribute("type", "text");
      ele.value = "";
      ele.setAttribute("type", "file");
    },

    // 发送
    send() {
      if (this.instanceState !== 1 || !this.chat.anotherUserId) {
        return;
      }

      let el = this.$refs["input-editor"];
      let html = el.innerHTML.replace(/<br>/gi, "");

      if (html === "") {
        this.$Message.warning("发送不能为空！");
        return;
      }

      // 匹配文件的正则
      let fileReg = /<input.*?(?:>|\/>)/gi;
      // 匹配文件sign的正则
      let signReg = /sign=[\'\"]?([^\'\"]*)[\'\"]?/i;
      // 匹配图片的正则
      let imgReg = /<img.*?(?:>|\/>)/gi;
      // 匹配图片src的正则
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      // 匹配表情code的正则
      let codeReg = /code=[\'\"]?([^\'\"]*)[\'\"]?/i;

      // 找到所有图片,表情
      let imgArr = html.match(imgReg) || [];
      if (imgArr.length) {
        imgArr.forEach(item => {
          if (item.indexOf("http://") > -1 || item.indexOf("https://") > -1)
            return;
          if (item.indexOf(`class="emoji"`) > -1) {
            // 将表情处理为文字
            let code = item.match(codeReg)[1];
            html = html.replace(item, code);
          } else {
            // 将图片或文件标签前后增加标识，便于分割
            html = html.replace(item, `_separation_${item}_separation_`);
          }
        });
      }

      // 找到所有文件
      let fileArr = html.match(fileReg) || [];
      if (fileArr.length) {
        fileArr.forEach(item => {
          html = html.replace(item, `_separation_${item}_separation_`);
        });
      }

      // 过滤掉空项
      let items = html.split("_separation_").filter(i => i !== "");

      let timeStamp = new Date().getTime();

      // 要发送的所有项
      items.forEach((item, index) => {
        let sign = timeStamp + "_" + toFourString(index);
        // 发送的数据
        let sendObj = {};
        // 缓存的数据
        let saveObj = {};
        if (item.match(imgReg)) {
          // 图片
          let fileSign = item.match(signReg)[1];
          let img = this.fileObj[fileSign];
          let base64 = item.match(srcReg)[1];
          sendObj = {
            type: 3,
            msgType: img.type,
            toUserId: this.chat.anotherUserId,
            sign,
            fileSize: img.size,
            fileName: img.name,
            separateSize: this.separateSize
          };
          saveObj = {
            ...sendObj,
            fileUrl: base64,
            originUrl: "",
            file: img,
            percent: 0,
            uploadState: "uploading"
          };
        } else if (item.match(fileReg)) {
          // 文件
          let fileSign = item.match(signReg)[1];
          let file = this.fileObj[fileSign];
          sendObj = {
            type: 3,
            msgType: file.type,
            toUserId: this.chat.anotherUserId,
            sign,
            fileSize: file.size,
            fileName: file.name,
            separateSize: this.separateSize
          };
          saveObj = {
            ...sendObj,
            fileUrl: "",
            file: file,
            percent: 0,
            uploadState: "uploading"
          };
        } else {
          // 文字和表情
          sendObj = {
            type: 3,
            msgType: "text",
            toUserId: this.chat.anotherUserId,
            sign,
            msg: item
          };
          saveObj = {
            ...sendObj,
            percent: 0
          };
        }
        // 缓存、渲染、发送
        this.sendMap[sign] = saveObj;
        this.$store.commit("SET_MSG_LIST_PUSH", saveObj);
        this.$store.dispatch("send_msg", sendObj);
      });
      this.$store.dispatch("to_bottom_fn", this);

      this.fileObj = {};
      this.msg = "";
      el.innerHTML = "<br>";
    },

    // 获取光标定位
    handleBlur() {
      if (!document.selection && window.getSelection) {
        this.selection = window.getSelection();
        if (this.selection.focusNode.className !== "input") {
          let el = this.$refs["input-editor"];
          el.focus();
          el.blur();
          return;
        }
        let hasRange = this.selection.getRangeAt && this.selection.rangeCount;
        if (hasRange) {
          this.range = this.selection.getRangeAt(0);
          this.range.deleteContents();
        }
      }
    },
    //ie获取光标定位
    handleKeyUp() {
      if (document.selection) {
        this.range = document.selection.createRange();
      }
    },

    /**
     * range更新到点击的位置
     * 点到图片就根据点击位置和图片大小设置一个合理的位置(前或后)
     */
    handleFoucs(e) {
      let node = e ? e.target : {};
      this.selection = window.getSelection();
      this.range = this.selection.getRangeAt(0);
      if (node.tagName === "IMG") {
        this.setCursor(node, e.offsetX < node.width / 2);
      }
    },

    /**
     * node 为传入的节点，不传则foucs到之前保存的位置
     * before 控制折叠方向
     */
    setCursor(node, before) {
      if (node) {
        // 需要新建一个range来添加内容
        let range = document.createRange();
        range.selectNode(node);
        range.collapse(!!before);
        this.selection.removeAllRanges();
        this.selection.addRange(range);
        // 更新 range
        this.range = range;
      } else {
        this.selection.removeAllRanges();
        // 使用之前的
        this.selection.addRange(this.range);
      }
    }
  },
  mounted() {
    let el = this.$refs["input-editor"];
    el.onkeydown = e => {
      if (e.ctrlKey && e.keyCode === 13) {
        insertHtmlAfterRange("<div><br></div>");
      }
      if (!e.ctrlKey && e.keyCode === 13) {
        e.preventDefault();
        e.returnValue = false;
        this.send();
      }
    };
    el.innerHTML = "<br>";
    el.focus();
  }
};
</script>

<style lang="less">
.chat-send {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 0 30px;
  box-shadow: 1px 1px 3px #efefef, -1px -1px 3px #efefef;
  .tool {
    width: 80px;
    height: 36px;
    font-size: 22px;
    .ivu-icon {
      cursor: pointer;
      position: relative;
      top: -3px;
      &:hover {
        color: #3296ff;
      }
      &.on {
        color: #3296ff;
      }
    }
    .emojis {
      width: 22px;
      height: 22px;
      line-height: 22px;
      position: relative;
      float: left;
      margin-top: 12px;
      margin-right: 15px;
      .con {
        position: absolute;
        top: -200px;
        left: -30px;
        width: 400px;
        height: 200px;
        background: #fff;
        box-shadow: 1px 1px 3px #efefef, -1px -1px 3px #efefef;
        padding: 10px;
        user-select: none;
        .box {
          width: 100%;
          height: 100%;
          overflow: auto;
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
          span {
            float: left;
            width: 30px;
            height: 30px;
            text-align: center;
            cursor: pointer;
            &:hover {
              background: #e7e7e7;
            }
            img {
              width: 26px;
              height: 26px;
              margin-top: 2px;
            }
          }
        }
      }
    }
    .pics {
      width: 22px;
      height: 22px;
      float: left;
      margin-top: 12px;
      .ivu-icon {
        top: -9px;
      }
      .upload {
        display: none;
      }
    }
  }
  .input {
    height: 75px;
    line-height: 25px;
    overflow: auto;
    font-size: 14px;
    outline: none;
    user-select: text;
    text-align: left;
    &:empty:before {
      content: "\200B";
      display: inline;
    }
    &[contenteditable="true"] {
      -webkit-user-modify: read-write-plaintext-only;
      -moz-user-modify: read-write-plaintext-only;
      &:empty:before {
        content: attr(placeholder);
        display: block;
        color: #ccc;
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
    .img {
      vertical-align: bottom;
      padding: 3px;
      width: 150px;
      height: auto;
    }
    & /deep/ .img {
      vertical-align: bottom;
      padding: 3px;
      width: 150px;
      height: auto;
    }
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
    .file {
      text-align: center;
      background: #fafafa;
      border: 1px solid #eee;
      vertical-align: bottom;
      padding: 0 3px;
      width: 200px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0 5px;
      user-select: none;
    }
    & /deep/ .file {
      text-align: center;
      background: #fafafa;
      border: 1px solid #eee;
      vertical-align: bottom;
      padding: 0 3px;
      width: 200px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 2px 5px;
      user-select: none;
    }
  }
  .ivu-btn {
    width: 60px;
    float: right;
    margin-top: 5px;
  }
}
</style>
