<template>
  <div :class="className" class="d2-error-log-list__expand">
    <p class="d2-error-log-list__expand-title">{{ title }}</p>
    <p class="d2-error-log-list__expand-value">{{ value === '' ? '无数据' : value }}</p>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'log'
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    className () {
      return this.type === 'log' ? 'd2-error-log-list__expand--log' : 'd2-error-log-list__expand--error'
    }
  }
}
</script>
