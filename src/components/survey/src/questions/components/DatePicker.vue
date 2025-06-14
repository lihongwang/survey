<template>
  <BaseQuestion :question="question">
    <el-date-picker
      v-model="selectedDate"
      :type="question.type || 'date'"
      :placeholder="question.placeholder || '选择日期'"
      :format="question.format"
      :value-format="question.valueFormat"
      class="w-full max-w-md"
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

const selectedDate = ref('')
</script>
