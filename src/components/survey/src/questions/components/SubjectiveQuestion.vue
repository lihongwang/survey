<template>
  <BaseQuestion :question="question">
    <div class="space-y-4">
      <el-input
        v-if="question.answerType === 'text'"
        v-model="answer"
        type="textarea"
        :rows="question.rows || 5"
        placeholder="请输入您的答案"
        :maxlength="question.maxLength"
        :show-word-limit="!!question.maxLength"
        class="max-w-xl"
      />

      <el-upload
        v-else-if="question.answerType === 'image'"
        :action="question.uploadUrl"
        :multiple="false"
        list-type="picture-card"
        :limit="1"
        :file-list="fileList"
        :on-success="handleUploadSuccess"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-upload
        v-else-if="question.answerType === 'file'"
        :action="question.uploadUrl"
        :multiple="false"
        :file-list="fileList"
        :on-success="handleUploadSuccess"
      >
        <el-button type="primary">上传文件</el-button>
      </el-upload>
    </div>
  </BaseQuestion>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import BaseQuestion from './BaseQuestion.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const answer = ref('')
const fileList = ref([])

const handleUploadSuccess = (response, file) => {
  fileList.value = [{ name: file.name, url: response.url }]
}
</script>
