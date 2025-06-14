<template>
  <BaseQuestion :question="question">
    <el-upload
      :action="question.uploadUrl"
      :multiple="question.multiple"
      :limit="question.limit"
      :accept="question.accept"
      :file-list="fileList"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-error="handleError"
      class="max-w-md"
    >
      <el-button type="primary">上传文件</el-button>
      <template #tip>
        <div class="mt-2 text-xs text-gray-500">
          {{ question.tip || `支持的文件类型: ${question.accept || '*'}` }}
          <span v-if="question.limit"> (最多 {{ question.limit }} 个文件)</span>
        </div>
      </template>
    </el-upload>
  </BaseQuestion>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseQuestion from './BaseQuestion.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const fileList = ref([])

const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.question.limit} 个文件`)
}

const handleSuccess = (response, file, fileList) => {
  ElMessage.success('上传成功')
}

const handleError = () => {
  ElMessage.error('上传失败，请重试')
}
</script>
