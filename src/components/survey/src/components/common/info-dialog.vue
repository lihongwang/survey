<template>
  <el-dialog
    v-if="computedVisible"
    v-model="computedVisible"
    title="问卷设计统计信息"
    fullscreen
    destroy-on-close
    class="survey-static-info-dialog"
  >
    <Info />
  </el-dialog>
</template>

<script setup>
// 导入所需的组件和函数
import { inject, ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createIconifyIcon } from '@/utils/create-icon'
import Info from './info.vue' // 假设您的项目中已有此组件
import { useEditorStore, useSurveyStore } from '../../stores'
const surveyStore = useSurveyStore()
const editorStore = useEditorStore()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:visible'])
// 计算属性：用于实现双向绑定
const computedVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})
</script>

<style lang="scss">
.survey-static-info-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  .el-dialog__body {
    flex: 1;
    min-height: 0;
  }
}
</style>
