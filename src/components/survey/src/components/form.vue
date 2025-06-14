<template>
  <!-- Form 组件包装器 -->
  <Form ref="formRef" :components="initialComponents" :properties="properties" v-bind="$attrs">
    <slot />
  </Form>
</template>

<script setup>
// 导入必要的依赖
import Form from '@/components/form-wrapper.vue'
import { computed, ref } from 'vue'

// 创建一个指向 form 组件的引用
const formRef = ref(null)

// 定义组件的 props
const props = defineProps({
  properties: {
    type: Object,
    default: () => ({}),
  },
  components: {
    type: Object,
    default: () => ({}),
  },
})

const initialComponents = computed(() => {
  return { ...props.components }
})

// 从 form 引用中计算 form 对象
const form = computed(() => formRef.value?.form)

// 向父组件暴露 form 对象
defineExpose({
  form,
})
</script>
