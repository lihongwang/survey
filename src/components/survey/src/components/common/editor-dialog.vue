<template>
  <el-dialog
    v-if="computedVisible"
    v-model="computedVisible"
    title="问卷JSON数据"
    width="80%"
    class="survey-json-dialog"
    :before-close="closeJsonDialog"
    fullscreen
    destroy-on-close
  >
    <div class="json-editor-container">
      <div class="json-editor-actions mb-3">
        <el-button-group>
          <el-button size="small" @click="copyJsonToClipboard">
            <el-icon><CopyDocument /></el-icon> 复制
          </el-button>
          <el-button size="small" type="primary" @click="applyJsonChanges">
            <el-icon><Check /></el-icon> 应用更改
          </el-button>
          <el-button size="small" @click="formatJson">
            <el-icon><Operation /></el-icon> 格式化
          </el-button>
        </el-button-group>
      </div>

      <!-- Monaco 编辑器 -->
      <div class="monaco-editor-container">
        <MonacoEditor
          v-model:value="jsonContent"
          :options="monacoOptions"
          language="json"
          theme="vs"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
// 导入所需的组件和函数
import { inject, ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createIconifyIcon } from '@/utils/create-icon'
import MonacoEditor from './monaco-editor.vue' // 假设您的项目中已有此组件
import { useEditorStore, useSurveyStore } from '../../stores'
const CopyDocument = createIconifyIcon('ic:baseline-content-copy')
const Operation = createIconifyIcon('ic:outline-format-paint')
const Check = createIconifyIcon('ic:outline-settings-suggest')
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
const jsonContent = computed(() => JSON.stringify(surveyStore.currentSurvey, null, 2))
// 复制JSON到剪贴板
const copyJsonToClipboard = () => {
  navigator.clipboard
    .writeText(jsonContent.value)
    .then(() => {
      ElMessage.success('JSON已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}
// 格式化JSON
const formatJson = () => {
  try {
    const parsed = JSON.parse(jsonContent.value)
    jsonContent.value = JSON.stringify(parsed, null, 2)
    ElMessage.success('JSON已格式化')
  } catch (e) {
    ElMessage.error('JSON格式错误，无法格式化')
  }
}

// 应用JSON更改
const applyJsonChanges = async () => {
  try {
    const jsonData = JSON.parse(jsonContent.value)

    // 确认是否应用更改
    await ElMessageBox.confirm('确定要应用JSON更改吗？此操作可能会改变问卷结构。', '应用更改', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 记录历史以便可以撤销
    editorStore.recordHistory()

    // 应用更改
    await surveyStore.createSurveyFromJson(jsonData)

    ElMessage.success('JSON更改已应用')
    computedVisible.value = false
  } catch (err) {
    if (err.message && err.message.includes('JSON')) {
      ElMessage.error('JSON格式错误，请检查语法')
    } else {
      ElMessage.error('应用更改失败')
    }
    console.error('应用JSON更改错误:', err)
  }
}
</script>
<style>
.survey-json-dialog {
  @apply flex flex-col h-screen;
  .el-dialog__body {
    @apply flex-1 min-h-0 flex flex-col;
  }
}
</style>
<style lang="scss" scoped>
.json-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.monaco-editor-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
