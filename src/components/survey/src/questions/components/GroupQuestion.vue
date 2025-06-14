<template>
  <div class="mb-8">
    <div class="mb-4">
      <h2 class="text-lg font-medium m-0 mb-2">{{ question.title }}</h2>
      <div v-if="question.description" class="text-gray-500 text-sm">
        {{ question.description }}
      </div>
    </div>

    <div class="pl-4 border-l-2 border-gray-200">
      <component
        v-for="(subBaseQuestion, index) in question.questions"
        :key="index"
        :is="questionComponents[subBaseQuestion.type]"
        :question="subBaseQuestion"
      />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import BaseQuestion from './BaseQuestion.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

// 注入所有问题组件
const questionComponents = inject('questionComponents')
</script>
