<template>
  <div class="todo-button">
    <Button :style="{ width: width, marginRight: space }" @click="cancel">{{ cancelText }}</Button>
    <Button type="primary" :style="{ width: width }" :loading="loading" :disabled="disabled" @click="save">{{ okText }}</Button>
  </div>
</template>

<script>
export default {
  name: 'TodoButton',
  props: {
    okText: {
      type: String,
      default: '保存'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '100px'
    },
    space: {
      type: String,
      default: '40px'
    }
  },
  data () {
    return {

    }
  },
  methods: {
    // 取消
    cancel () {
      this.$emit('on-cancel')
    },
    // 保存
    save () {
      this.$emit('on-save')
    }
  }
}
</script>

<style lang="less" scoped>
.todo-button {
  height: 32px;
  float: right;
  .ivu-btn {
    float: left;
  }
  height: 32px;
}
</style>
