<template>
  <div ref="pay-input" class="pay-input">
    <input
      type="password"
      :maxlength="1"
      @input="changeInput"
      @click="changePwd"
      v-model="pwdList[i]"
      @keyup="keyUp($event)"
      @keydown="oldPwdList = pwdList.length"
      class="shortInput"
      v-for="(v, i) in 6"
      :key="i"
    />
  </div>
</template>

<script>
export default {
  name: "pay-input",
  data() {
    return {
      pwdList: [],
      oldPwdList: [],
      isDelete: false,
      ipt: ""
    };
  },
  methods: {
    keyUp(ev) {
      let index = this.pwdList.length;
      if (!index) return;
      if (ev.keyCode === 8) {
        this.isDelete = true;
        if (this.oldPwdList === this.pwdList.length) {
          if (index === this.pwdList.length) {
            this.pwdList.pop();
          }
          index--;
        } else {
          index > 0 && index--;
        }
        this.ipt[index].focus();
      } else if (
        this.isDelete &&
        index === this.pwdList.length &&
        /^\d$/.test(ev.key)
      ) {
        this.isDelete = false;
        this.pwdList.pop();
        this.pwdList.push(ev.key);
        this.ipt[this.pwdList.length] && this.ipt[this.pwdList.length].focus();
      }
      if (this.pwdList.length === 6) {
        this.ipt[5].blur();
      }
      this.$emit("getPwd", this.pwdList.join(""));
    },
    changePwd() {
      let index = this.pwdList.length;
      index === 6 && index--;
      this.ipt[index].focus();
    },
    changeInput() {
      let index = this.pwdList.length;
      let val = this.pwdList[index - 1];
      if (!/[0-9]/.test(val)) {
        this.pwdList.pop();
        return;
      }
      if (!val) {
        this.pwdList.pop();
        index--;
        if (index > 0) this.ipt[index - 1].focus();
      } else {
        if (index < 6) this.ipt[index].focus();
      }
    }
  },
  mounted() {
    this.ipt = this.$refs["pay-input"].children;
  }
};
</script>

<style lang="less" scoped>
.pay-input {
  display: inline-block;
  border: 2px solid #efefef;
  padding: 4px;
  input {
    text-align: center;
    font-size: 20px;
    float: left;
    width: 40px;
    height: 40px;
    color: #333;
    outline: none;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin: 0 2px;
  }
}
</style>