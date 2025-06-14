<template>
  <div class="mb-8">
    <div class="mb-4">
      <h3 class="text-base font-medium m-0 mb-2">
        {{ question.title }}
        <span v-if="question.required" class="text-red-500 ml-1">*</span>
      </h3>

      <div class="prose max-w-none" v-html="question.stem"></div>

      <div v-if="question.attachments && question.attachments.length" class="mt-4">
        <div class="flex flex-wrap gap-4">
          <div
            v-for="(attachment, index) in question.attachments"
            :key="index"
            class="border rounded p-2 bg-gray-50"
          >
            <img
              v-if="attachment.type === 'image'"
              :src="attachment.url"
              :alt="attachment.name"
              class="max-h-40 object-contain"
            />
            <div v-else class="flex items-center">
              <el-icon><Document /></el-icon>
              <span class="ml-2">{{ attachment.name }}</span>
            </div>
          </div>
        </div>
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
import { Document } from '@element-plus/icons-vue'
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
