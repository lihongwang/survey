<template>
  <BaseQuestion :question="question">
    <div class="flex items-center">
      <el-rate
        v-model="rating"
        :max="question.maxRating || 5"
        :colors="colors"
        :allow-half="question.allowHalf"
      />
      <span v-if="rating > 0" class="ml-2 text-sm text-gray-600">{{ rating }} 分</span>
    </div>
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

const rating = ref(0)
const colors = ['#F7BA2A', '#F7BA2A', '#F7BA2A']
</script>
