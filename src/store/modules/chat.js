const { api } = require("../../../config");
import { stringToArrayBuffer } from "../../libs/tools";
import { getToken } from "../../libs/token";

export default {
  state: {
    // 是否展示
    show: false,
    // 是否最大化
    big: false,

    // websocket实例
    instance: null,
    // 实例状态
    instanceState: 3,

    // 游客|客服列表
    customerList: [],

    // 最近 聊天 列表
    chatList: [],

    // 好友列表
    friendList: [],
    // 当前选中的好友
    friend: {},

    // 当前选中的 聊天|游客|客服
    chat: {},

    // 消息列表
    msgList: [],

    // 是否展示查看更多
    showViewMore: true,

    // 聊天页面|好友页面|游客页面
    currentTab: "聊天",

    // 展示搜索页面
    showSearch: false,
    searchKey: "",

    // 点击查看详情
    infoMsg: {},
    infoShow: false,
    infoPosition: {},

    // 等待状态
    loading: false,

    // 预览图片
    viewer: null,

    // 发送数据的映射
    sendMap: {},

    // 分割文件大小
    separateSize: 500,

    // 开启多选
    multipleSelect: false
  },

  getters: {
    // 聊天未读消息总数
    msgCountChat: state => {
      let count = state.chatList.reduce((res, i) => {
        return res + i.unReadNum;
      }, 0);

      return count;
    },
    // 游客|客服未读消息总数
    msgCountCustomer: state => {
      let count = state.customerList.reduce((res, i) => {
        return res + i.unReadNum;
      }, 0);

      return count;
    },

    showSearch: state => {
      return state.searchKey || state.showSearch;
    },

    // 搜索结果列表
    chatSearchList: state => {
      if (getToken()) {
        return state.friendList.filter(
          f => f.userName.indexOf(state.searchKey) > -1
        );
      } else {
        return state.customerList.filter(
          f => f.userName.indexOf(state.searchKey) > -1
        );
      }
    },

    // 图片消息
    msgListImgs: state => {
      if (!state.msgList.length) return [];
      let arr = [];
      state.msgList.forEach(msg => {
        if (!msg.sysUserMsgList.length) return;
        msg.sysUserMsgList.forEach(item => {
          if (item.msgType && item.msgType.indexOf("image") > -1) {
            arr.push(item);
          }
        });
      });
      return arr;
    },

    // 选中的消息
    selectMsgList: state => {
      let arr = [];
      state.msgList.forEach(i => {
        i.sysUserMsgList.forEach(item => {
          arr.push(item);
        });
      });
      return arr.filter(i => i.select);
    }
  },

  mutations: {
    // 隐藏/显示
    CHANGE_SHOW: (state, status) => {
      let style = document.body.style;
      if (status) {
        style.overflow = "hidden";
        style.paddingRight = "17px";
      } else {
        style.overflow = "";
        style.paddingRight = "";
      }
      state.show = status;
    },

    // 修改状态
    CHANGE_STATE: (state, instanceState) => {
      state.instanceState = instanceState;
    },

    // 最大化
    CHANGE_SIZE: (state, status) => {
      state.big = status;
    },

    // 创建实例
    SET_INSTANCE: (state, instance) => {
      state.instance = instance;
    },

    // 填充客服|游客列表
    SET_CUSTOMER_LIST: (state, data) => {
      state.customerList = data;
    },

    // 填充最近聊天列表
    SET_CHAT_LIST: (state, data) => {
      state.chatList = data;
    },

    // 选择当前聊天朋友
    SET_CHAT: (state, data) => {
      state.chat = data;
    },

    // 填充朋友列表
    SET_FRIEND_LIST: (state, data) => {
      state.friendList = data;
    },
    // 选择当前选中的朋友
    SET_FRIEND: (state, data) => {
      state.friend = data;
    },

    // 聊天数据
    SET_MSG_LIST: (state, data) => {
      state.msgList.unshift(data);
    },
    SET_MSG_LIST_PUSH: (state, data) => {
      if (!state.msgList.length) {
        state.msgList.push({
          sysUserMsgList: [data],
          lastMsgDateStr: "刚刚"
        });
      } else {
        state.msgList[state.msgList.length - 1].sysUserMsgList.push(data);
      }
    },

    // 清空聊天数据
    CLEAR_MSG_LIST: state => {
      state.msgList = [];
    },

    // 查看更多
    SET_VIEW_MORE: (state, status) => {
      state.showViewMore = status;
    },

    // 切换页面
    SET_TABS: (state, str) => {
      state.currentTab = str;
    },

    // 搜索展示
    SET_SHOW_SEARCH: (state, data) => {
      state.showSearch = data;
    },
    // 搜索展示
    SET_SEARCH_KEY: (state, data) => {
      state.searchKey = data;
    },

    // 信息详情
    SET_INFO_MSG: (state, data) => {
      state.infoMsg = data;
    },
    // 是否展示
    SET_INFO_SHOW: (state, data) => {
      state.infoShow = data;
    },
    // 位置
    SET_INFO_POSITION: (state, data) => {
      state.infoPosition = data;
    },

    // 等待状态
    SET_LOADING: (state, data) => {
      state.loading = data;
    },

    // 图片预览
    SET_VIEWER: (state, data) => {
      state.viewer = data;
    },

    // 多选
    SET_MULTIPLE_SELECT: (state, data) => {
      state.multipleSelect = data;
    }
  },

  actions: {
    /**
     * @params type 标识码
     * @param {Number} 1 获取聊天列表
     * @param {Number} 2 分组查询历史消息
     * @param {Number} 3 发送消息
     * @param {Number} 4 接收消息
     * @param {Number} 5 获取朋友列表
     * @param {Number} 6 获取朋友详情
     * @param {Number} 7 与朋友建立连接
     * @param {Number} 8 获取自己的信息
     * @param {Number} 9 有人上线或有人下线
     * @param {Number} 10 解除当前聊天对象
     * @param {Number} 11 撤回2分钟内的消息
     * @param {Number} 12 删除聊天
     * @param {Number} 13 删除消息
     *
     * @param {Number} 201 开始发送图片
     * @param {Number} 202 发送图片回馈
     *
     * @param {Number} 301 游客获取UUID
     *
     * @param {Number} 401 清空当前用户所有的数据
     */

    // 创建实例 开启通信 链接成功的回调函数 错误函数 关闭函数
    set_instance: ({ state, commit, dispatch }, vue) => {
      let host = api.replace("http", "ws");
      let baseUrl = `${host}/webSocket`;
      let currentChatId = state.chat.anotherUserId || 0;
      let uuid = sessionStorage["X-website-uuid"];
      let token = getToken();

      let url = "";

      if (!token) {
        // 未登录
        if (uuid) {
          // 已获取uuid的游客
          url = `${baseUrl}?tourist=${uuid}&anotherUserId=${currentChatId}`;
        } else {
          // 未获取uuid的游客
          url = baseUrl;
        }
      } else {
        // 已登录 有token
        url = `${baseUrl}?token=${token}&anotherUserId=${currentChatId}`;
      }

      // 建立实例
      commit("SET_INSTANCE", new WebSocket(url));

      // 连接建立
      state.instance.onopen = () => {
        // 初始化
        commit("SET_LOADING", false);

        // 接收消息
        dispatch("receive_msg", vue);
        if (!token) {
          if (uuid) {
            dispatch("send_msg", {
              type: 1,
              isSysUser: false
            });
          }
        } else {
          dispatch("send_msg", {
            type: 1,
            isSysUser: true
          });
          dispatch("send_msg", { type: 5 });
          dispatch("send_msg", {
            type: 1,
            isSysUser: false
          });
        }
      };

      // 连接出错
      state.instance.onerror = e => {
        // console.log(e);
      };

      // 连接关闭
      state.instance.onclose = e => {
        let { reason, code } = e;

        // 账号在别处登录
        if (code === 4001) {
          vue.$Notice.warning({
            title: "账号已退出",
            desc: reason
          });
          sessionStorage.removeItem("X-website-cart");
          sessionStorage.removeItem("X-website-token");
          sessionStorage.removeItem("X-website-uuid");
          sessionStorage.removeItem("X-website-orderGenerate");
          sessionStorage.removeItem("X-website-order");
          commit("CHANGE_HAS_LOGIN", false);
          commit("CHANGE_USER_INFO", {});
          commit("CHANGE_PRODUCTS", []);
          commit("CHANGE_ORDERS", { list: [], total: 0 });
          dispatch("set_instance", this);
        }
      };
    },

    // 发送消息
    send_msg: ({ state }, data) => {
      state.instance.send(JSON.stringify(data));
    },

    // 接收消息
    receive_msg: ({ state, commit, dispatch, rootState }, vue) => {
      state.instance.onmessage = evt => {
        let tip = ["连接成功", "发送成功"];
        if (tip.includes(evt.data)) return;

        let res = JSON.parse(evt.data);

        const map = {
          // 获取最近聊天列表
          1: () => {
            if (res.isSysUser) {
              commit("SET_CHAT_LIST", res.data);
            } else {
              commit("SET_CUSTOMER_LIST", res.data);
              if (state.currentTab === "游客") {
                !res.data.filter(
                  r => r.anotherUserId === state.chat.anotherUserId
                ).length && commit("SET_CHAT", {});
              }
            }
          },

          // 朋友聊天记录
          2: () => {
            if (JSON.stringify(res.data) === "{}") {
              commit("SET_VIEW_MORE", false);
              if (JSON.stringify(state.sendMap) !== "{}") {
                for (let key in state.sendMap) {
                  if (
                    state.sendMap[key].toUserId === state.chat.anotherUserId
                  ) {
                    commit("SET_MSG_LIST_PUSH", state.sendMap[key]);
                    dispatch("to_bottom_fn", vue);
                  }
                }
              }
            } else {
              commit("SET_MSG_LIST", res.data);
              if (state.msgList.length === 1) {
                if (JSON.stringify(state.sendMap) !== "{}") {
                  for (let key in state.sendMap) {
                    if (
                      state.sendMap[key].toUserId === state.chat.anotherUserId
                    ) {
                      commit("SET_MSG_LIST_PUSH", state.sendMap[key]);
                    }
                  }
                }
                dispatch("to_bottom_fn", vue);
              } else {
                dispatch("to_hold_fn", vue);
              }
            }
            commit("SET_LOADING", false);
            dispatch("send_msg", {
              type: 1,
              isSysUser: getToken()
                ? state.currentTab === "游客"
                  ? false
                  : true
                : false
            });
          },

          // 自己发送的消息
          3: () => {
            let { sign, isSysUser, id, createDate } = res;
            state.sendMap[sign].percent = 100;
            state.sendMap[sign].id = id;
            state.sendMap[sign].createDate = createDate;
            dispatch("send_msg", {
              type: 1,
              isSysUser
            });
            delete state.sendMap[sign];
          },

          // 收到的消息
          4: () => {
            let { fromUserId, isSysUser } = res.data;
            if (fromUserId === state.chat.anotherUserId) {
              commit("SET_MSG_LIST_PUSH", res.data);
              dispatch("to_bottom_fn", vue);
            }
            dispatch("send_msg", {
              type: 1,
              isSysUser
            });
          },

          // 获取朋友列表
          5: () => {
            commit("SET_FRIEND_LIST", res.data);
          },

          // 获取朋友详情
          6: () => {
            commit("SET_INFO_MSG", res.data);
            commit("SET_FRIEND", res.data);
          },

          // 好友发消息建立连接
          7: () => {
            dispatch("send_msg", {
              type: 1,
              isSysUser: getToken()
                ? state.currentTab === "游客"
                  ? false
                  : true
                : false
            });
            commit("SET_TABS", "聊天");
          },

          // 获取自己的信息
          8: () => {
            commit("CHANGE_USER_INFO", {
              ...rootState.common.user,
              ...res.data
            });
          },

          // 有人上线或有人下线
          9: () => {
            let { id, status } = res.data;
            if (getToken()) {
              // 已登录，更新聊天列表和通讯录
              let chat = state.chatList.filter(c => c.anotherUserId === id)[0];
              chat && (chat.status = status);
              let friend = state.friendList.filter(f => f.id === id)[0];
              friend && (friend.status = status);
            } else {
              // 未登录，更新客服列表
              let customer = state.customerList.filter(
                c => c.anotherUserId == id
              )[0];
              customer && (customer.status = status);
            }
          },

          // 撤回消息
          11: () => {
            let { id } = res;
            let groupIndex = -1;
            let msgIndex = -1;
            state.msgList.forEach((i, _groupIndex) => {
              i.sysUserMsgList.forEach((item, _msgIndex) => {
                if (item.id === id) {
                  groupIndex = _groupIndex;
                  msgIndex = _msgIndex;
                }
              });
            });
            vue.$set(
              state.msgList[groupIndex].sysUserMsgList[msgIndex],
              "isRecall",
              1
            );
          },

          // 删除聊天
          12: () => {
            let { anotherUserId } = res;
            if (state.chat.anotherUserId == anotherUserId) {
              commit("SET_CHAT", {});
            }
          },

          // 删除消息
          13: () => {
            let ids = res.data.map(i => i.id);
            state.msgList.forEach((i, _groupIndex) => {
              i.sysUserMsgList.forEach((item, _msgIndex) => {
                if (ids.includes(item.id)) {
                  vue.$set(
                    state.msgList[_groupIndex].sysUserMsgList[_msgIndex],
                    "isDelete",
                    1
                  );
                }
              });
            });
          },

          // 上传图片和文件
          201: () => {
            let { sign } = res;
            let { file, separateSize } = state.sendMap[sign];

            let blob = file.slice(0, separateSize * 1024);
            let reader = new FileReader();
            reader.onload = e => {
              let _sign = stringToArrayBuffer(sign);
              let _res = e.target.result;
              let newBlob = new Blob([_sign, _res]);
              state.instance.send(newBlob);
            };
            reader.readAsArrayBuffer(blob);
          },

          // 图片文件回馈
          202: () => {
            let { sign, percent } = res.data;
            let item = state.sendMap[sign];
            if (!item) return;
            item.percent = percent;

            if (percent === 100) {
              // 已上传完
              let {
                fileUrl,
                originUrl,
                id,
                contentMD5,
                createDate,
                fileType
              } = res.data;
              item.fileUrl = fileUrl;
              originUrl && (item.originUrl = originUrl);
              dispatch("send_msg", {
                type: 1,
                isSysUser: res.isSysUser
              });
              state.sendMap[sign].uploadState = null;
              state.sendMap[sign].id = id;
              state.sendMap[sign].createDate = createDate;
              state.sendMap[sign].contentMD5 = contentMD5;
              state.sendMap[sign].msgType = fileType;
              delete state.sendMap[sign];
            } else {
              // 未上传完
              // 判断状态是否暂停
              if (state.sendMap[sign].uploadState !== "uploading") return;
              let { indexStart, indexEnd } = res.data;
              let blob = item.file.slice(indexStart, indexEnd);
              let reader = new FileReader();
              reader.onload = e => {
                let _sign = stringToArrayBuffer(sign);
                let _res = e.target.result;
                let newBlob = new Blob([_sign, _res]);
                state.instance.send(newBlob);
              };
              reader.readAsArrayBuffer(blob);
            }
          },

          // 获取uuid
          301: () => {
            state.instance.close();
            sessionStorage["X-website-uuid"] = res.data;
            dispatch("set_instance");
          }
        };

        map[res.type] && map[res.type]();
      };
    },

    // 消息回到底部
    to_bottom_fn: (ctx, vue) => {
      vue.$nextTick(() => {
        let el = document.getElementById("message-list");
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    },
    // 消息保持不动
    to_hold_fn: (ctx, vue) => {
      let el = document.getElementById("message-list");
      let old = el.scrollHeight;
      vue.$nextTick(() => {
        let el = document.getElementById("message-list");
        el.scrollTop = el.scrollHeight - old;
      });
    }
  }
};
