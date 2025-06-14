<template>
  <div class="mb-6">
    <div class="mb-3">
      <div class="title flex gap-2 items-center mb-2">
        <el-tag>
          <div class="flex items-center gap-2">
            <component
              :is="createIconifyIcon(typesEnum[questionType]?.icon || 'ic:outline-question-answer')"
            />
            {{ typesEnum[questionType]?.label || '未知类型' }}
          </div>
        </el-tag>
        <h3 class="text-base font-medium">
          {{ question.title }}
          <span v-if="question.score" class="text-blue-500">({{ question.score }}分)</span>

          <span v-if="question.required" class="text-red-500 ml-1">*</span>
        </h3>
      </div>

      <div v-if="question.description" class="text-gray-500 text-sm">
        {{ question.description }}
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { typesEnum } from '../type-properties'
import { createIconifyIcon } from '@/utils/create-icon'

defineProps({
  questionType: {
    type: String,
  },
  question: {
    type: Object,
    required: true,
  },
})
</script>
