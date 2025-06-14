<template>
  <BaseQuestion :question="question">
    <el-input v-model="answer" :placeholder="question.placeholder || '请输入'" class="max-w-md" />
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
