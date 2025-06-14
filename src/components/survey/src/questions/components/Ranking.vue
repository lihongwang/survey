<template>
  <BaseQuestion :question="question">
    <el-alert
      v-if="question.description"
      :title="question.description"
      type="info"
      :closable="false"
      class="mb-4"
    />
    <div class="space-y-2 max-w-md">
      <draggable v-model="rankedItems" item-key="value" ghost-class="bg-gray-100" class="space-y-2">
        <template #item="{ element, index }">
          <div class="flex items-center p-3 bg-white border rounded shadow-sm cursor-move">
            <div class="mr-3 font-bold text-gray-500">{{ index + 1 }}</div>
            <div>{{ element.label }}</div>
          </div>
        </template>
      </draggable>
    </div>
  </BaseQuestion>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import BaseQuestion from './BaseQuestion.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const rankedItems = ref([...props.question.options])
</script>
