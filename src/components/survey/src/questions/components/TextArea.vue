<template>
  <BaseQuestion :question="question">
    <el-input
      v-model="answer"
      type="textarea"
      :rows="question.rows || 4"
      :placeholder="question.placeholder || '请输入'"
      :maxlength="question.maxLength"
      :show-word-limit="!!question.maxLength"
      class="max-w-xl"
    />
  </BaseQuestion>
</template>

<script setup>
import { ref } from 'vue'
import BaseQuestion from './BaseQuestion.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const answer = ref('')
</script>
