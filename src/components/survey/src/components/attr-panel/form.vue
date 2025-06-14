<template>
  <Form
    class="panel-form"
    ref="formRef"
    v-bind="$attrs"
    :layout="layout"
    :properties="properties"
    :initialValues="initialValues"
    :changeFields="changeFields"
    :handleFormValuesChange="handleFormChange"
  />
</template>

<script setup>
// 导入所需的组件和函数
import { inject, ref, onMounted } from 'vue'
import Form from '../form.vue'
import debounce from 'lodash/debounce'
// 注入上下文
const context = inject('context')
// 创建表单引用
const formRef = ref(null)
const emit = defineEmits(['form-change'])

// 定义组件属性
const props = defineProps({
  // 布局配置
  layout: {
    type: Object,
    default: () => ({
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'vertical',
        style: {
          padding: '0 10px 10px 10px',
        },
      },
    }),
  },
  // 表单属性
  properties: {
    type: Object,
    default: () => ({}),
  },
  // 初始值
  initialValues: {
    type: Object,
  },
  // 变更字段
  changeFields: {
    type: Object,
  },
  // 设置初始值的函数
  setInitialValues: {
    type: Function,
    default: () => (data) => data,
  },
})
const handleFormChange = debounce((form) => {
  // 使用防抖函数
  emit('form-change', form.values)
}, 300) // 300毫秒的防抖时间
// 组件挂载后设置表单初始值
onMounted(async () => {
  const result = (await Promise.resolve(props.setInitialValues(formRef))) || {}
  formRef.value.form.setValues(result, 'overwrite')
})
</script>

<style lang="scss" scoped>
.panel-form {
}
</style>
