<template>
  <BaseQuestion :question="question">
    <el-radio-group v-model="answer" class="flex space-x-4">
      <el-radio label="true">{{ question.trueLabel || '正确' }}</el-radio>
      <el-radio label="false">{{ question.falseLabel || '错误' }}</el-radio>
    </el-radio-group>
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
