<template>
  <div class="main-user">
    <span class="login" v-if="!hasLogin" @click="login">登录</span>
    <Dropdown>
      <span class="username" v-if="hasLogin">您好，{{ username }}</span>
      <DropdownMenu slot="list">
        <DropdownItem @click.native="pwdShow = true">修改密码</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <span class="back" v-if="hasLogin && hasPermission" @click="jumpBack">后台管理</span>
    <span class="logout" v-if="hasLogin" @click="logout">退出</span>

    <!-- login -->
    <Modal v-model="show" :closable="false" :mask-closable="false" width="284">
      <div slot="header" style="font-size: 14px;">欢迎登录</div>
      <Form
        v-if="show"
        ref="loginForm"
        :model="form"
        :rules="rules"
        @keydown.enter.native="handleSubmit"
      >
        <FormItem prop="username">
          <Input v-model="form.username" placeholder="请输入账号">
            <span slot="prepend">
              <Icon :size="16" type="ios-person"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="form.password" placeholder="请输入密码">
            <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer" style="height: 32px;">
        <todo-button
          :loading="loading"
          style="float: right;"
          @on-save="handleSubmit"
          okText="登录"
          @on-cancel="cancel"
        ></todo-button>
      </div>
    </Modal>

    <!-- 修改信息 -->
    <Modal v-model="pwdShow" :closable="false" :mask-closable="false" width="500">
      <div slot="header" style="font-size: 14px;">修改密码</div>
      <Form v-if="pwdShow" ref="pwdForm" :model="pwdForm" :rules="pwdRules" :label-width="100">
        <FormItem label="旧密码" prop="oldLoginPwd">
          <Input type="password" v-model="pwdForm.oldLoginPwd" placeholder="请输入旧密码">
            <span slot="prepend">
              <Icon :size="16" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem label="新密码" prop="newLoginPwd">
          <Input type="password" v-model="pwdForm.newLoginPwd" placeholder="请输入新密码">
            <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem label="重复新密码" prop="reNewLoginPwd">
          <Input type="password" v-model="pwdForm.reNewLoginPwd" placeholder="请重复新密码">
            <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer" style="height: 32px;">
        <todo-button
          :loading="loading"
          style="float: right;"
          space="20px"
          @on-save="pwdHandleSubmit"
          @on-cancel="pwdCancel"
        ></todo-button>
      </div>
    </Modal>
  </div>
</template>

<script>
const { admin_port } = require("../../../config");
import {
  login,
  getLoginUser,
  logout,
  addCartMultiple,
  getCartList,
  changePwd
} from "@/api/api";
import { on, off, isIp } from "@/libs/tools";
import TodoButton from "../common/TodoButton.vue";
import { getToken, setToken } from "../../libs/token";
export default {
  name: "main-user",
  components: {
    TodoButton
  },
  computed: {
    // 是否显示登录框
    show() {
      return this.$store.state.common.loginShow;
    },
    user() {
      return this.$store.state.common.user;
    },
    username() {
      return this.$store.getters.userName;
    },
    hasLogin() {
      return this.$store.state.common.hasLogin;
    },
    instance() {
      return this.$store.state.chat.instance;
    },
    hasPermission() {
      return this.$store.getters.hasPermission;
    }
  },
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("新密码不能为空"));
      } else if (value !== this.pwdForm.newLoginPwd) {
        callback(new Error("两次输入新密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // 是否显示登录框和登录等待
      loading: false,

      // 账号密码验证
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ]
      },

      // 表单信息: 账户密码
      form: {
        username: "",
        password: ""
      },

      // 修改密码
      pwdShow: false,
      pwdRules: {
        oldLoginPwd: [
          {
            required: true,
            message: "旧密码不能为空",
            max: 50,
            min: 1,
            trigger: "change"
          }
        ],
        newLoginPwd: [
          {
            required: true,
            message: "新密码不能为空",
            max: 50,
            min: 1,
            trigger: "change"
          }
        ],
        reNewLoginPwd: [
          {
            required: true,
            validator: validatePassCheck,
            trigger: "change"
          }
        ]
      },
      pwdForm: {
        oldLoginPwd: "",
        newLoginPwd: "",
        reNewLoginPwd: ""
      }
    };
  },
  methods: {
    login() {
      this.$store.commit("CHANGE_LOGIN_SHOW", true);
    },
    // 登录
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          login({
            loginName: this.form.username,
            loginPwd: this.form.password
          }).then(res => {
            if (res.data.res) {
              setToken(res.data.data);
              this.$Message.success("登录成功！");
              this.$store.commit("CHANGE_HAS_LOGIN", true);
              this.getUserInfo();
              this.getUserCart();
              this.getUserOrder();
              this.instance && this.instance.close();
              this.$store.dispatch("set_instance", this);
            } else {
              this.$store.commit("CHANGE_HAS_LOGIN", false);
            }
            this.loading = false;
          });
        }
      });
    },
    // 取消登录 / 初始化
    cancel() {
      this.form.username = "";
      this.form.password = "";
      this.loading = false;
      this.$store.commit("CHANGE_LOGIN_SHOW", false);
    },

    // 保存信息
    pwdHandleSubmit() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.loading = true;
          changePwd({
            oldLoginPwd: this.pwdForm.oldLoginPwd,
            newLoginPwd: this.pwdForm.newLoginPwd
          }).then(res => {
            if (res.data.res) {
              this.$Message.success(res.data.msg);
              this.pwdCancel();
              this.logout();
              this.$Notice.warning({
                title: "登录过期！",
                desc: "密码已修改，请重新登录！"
              });
            }
            this.loading = false;
          });
        }
      });
    },
    pwdCancel() {
      this.pwdForm.oldLoginPwd = "";
      this.pwdForm.newLoginPwd = "";
      this.pwdForm.reNewLoginPwd = "";
      this.loading = false;
      this.pwdShow = false;
    },

    // 登录后获取用户信息
    getUserInfo() {
      this.$store.dispatch("getUserInfo", () => {
        this.cancel();
      });
    },
    // 登录后获取用户购物车
    getUserCart() {
      if (sessionStorage["X-website-cart"]) {
        let obj = JSON.parse(sessionStorage["X-website-cart"]);
        let data = Object.keys(obj).map(key => {
          return {
            productId: Number(key),
            num: obj[key]
          };
        });
        addCartMultiple(data).then(res => {
          if (res.data.res) {
            this.$Message.success(res.data.msg);
            sessionStorage.removeItem("X-website-cart");
            this.$store.dispatch("getCartList");
          }
        });
      } else {
        this.$store.dispatch("getCartList");
      }
    },
    // 登录后获取用户订单
    getUserOrder() {
      this.$store.dispatch("getOrderList");
    },

    // 跳转到后台
    jumpBack() {
      const host = window.location.hostname;
      // 官网后台地址
      let admin_url = "";
      if (host.indexOf("localhost") > -1 || isIp(host)) {
        admin_url = `http://${host}:${admin_port}`;
      } else {
        admin_url = `http://${host}/admin`;
      }
      let admin_url_token = `${admin_url}?token=${getToken()}`;
      window.open(admin_url_token, "website_admin");
    },

    // 登出
    logout() {
      sessionStorage.removeItem("X-website-cart");
      sessionStorage.removeItem("X-website-token");
      sessionStorage.removeItem("X-website-uuid");
      sessionStorage.removeItem("X-website-orderGenerate");
      sessionStorage.removeItem("X-website-order");
      this.instance && this.instance.close();
      this.$store.commit("CHANGE_HAS_LOGIN", false);
      this.$store.commit("CHANGE_USER_INFO", {});
      this.$store.commit("CHANGE_PRODUCTS", []);
      this.$store.commit("CHANGE_ORDERS", { list: [], total: 0 });
      this.$store.dispatch("set_instance", this);
    }
  },
  created() {
    if (getToken()) {
      this.$store.commit("CHANGE_HAS_LOGIN", true);
      this.$store.dispatch("getUserInfo");
    } else {
      this.$store.commit("CHANGE_HAS_LOGIN", false);
      this.$store.commit("CHANGE_USER_INFO", {});
    }
  }
};
</script>

<style lang="less">
@import "../../assets/less/common.less";
.main-user {
  position: absolute;
  top: 15px;
  right: 0;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.2em;
  .login {
    background: rgba(255, 255, 255, 0.3);
    padding: 3px 8px;
    border-radius: 3px;
  }
  .ivu-dropdown {
    .ivu-select-dropdown {
      text-align: center;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: none;
      .ivu-dropdown-menu {
        padding: 0 5px;
        .ivu-dropdown-item {
          color: #fff;
          font-size: 16px !important;
          &:hover {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
  .username {
    background: rgba(255, 255, 255, 0.3);
    padding: 3px 8px;
    border-radius: 3px;
    margin-left: 0;
  }
  .back {
    background: rgba(0, 255, 0, 0.2);
    padding: 3px 8px;
    border-radius: 3px;
  }
  .logout {
    background: rgba(255, 0, 0, 0.2);
    padding: 3px 8px;
    border-radius: 3px;
  }
  span {
    cursor: pointer;
    margin-left: 20px;
  }
}
</style>
