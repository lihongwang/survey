<template>
  <el-dialog v-model="computedVisible" title="已选题目预览" width="60%">
    <div
      class="question-preview-selected-container flex h-[500px] overflow-y-auto"
      ref="previewRef"
    >
      <!-- Left: Selected questions list -->
      <div class="selected-questions flex-1 pr-4">
        <div
          v-for="(question, index) in selectedQuestions"
          :key="index"
          class="selected-question-item py-2 border-b"
        >
          <div class="question-text mb-2">{{ question.text }}</div>
          <div class="options">
            <div v-for="option in question.options" :key="option.key" class="mb-1">
              {{ option.key }}. {{ option.text }}
            </div>
          </div>
        </div>
      </div>
      <!-- Right: Statistics -->
      <el-affix target=".question-preview-selected-container" :offset="190">
        <div class="statistics w-[200px] border-l px-4">
          <h3 class="text-lg font-medium mb-4">统计信息</h3>

          <div class="total-count mb-4">
            <div class="text-gray-600">总题目数</div>
            <div class="text-xl font-bold">{{ selectedQuestions.length }}</div>
          </div>

          <div class="question-types-stats">
            <div class="text-gray-600 mb-2">题目类型</div>
            <div
              v-for="(count, type) in questionTypeStats"
              :key="type"
              class="flex justify-between items-center py-1"
            >
              <span>{{ getQuestionTypeName(type) }}</span>
              <span class="text-blue-500 font-medium">{{ count }}题</span>
            </div>
          </div>

          <div
            class="difficulty-stats mt-4"
            v-if="difficultyStats.easy || difficultyStats.medium || difficultyStats.hard"
          >
            <div class="text-gray-600 mb-2">难度分布</div>
            <div class="flex justify-between items-center py-1" v-if="difficultyStats.easy">
              <span>简单</span>
              <span class="text-green-500 font-medium">{{ difficultyStats.easy }}题</span>
            </div>
            <div class="flex justify-between items-center py-1" v-if="difficultyStats.medium">
              <span>中等</span>
              <span class="text-orange-500 font-medium">{{ difficultyStats.medium }}题</span>
            </div>
            <div class="flex justify-between items-center py-1" v-if="difficultyStats.hard">
              <span>困难</span>
              <span class="text-red-500 font-medium">{{ difficultyStats.hard }}题</span>
            </div>
          </div>
        </div>
      </el-affix>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  selectedQuestions: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:visible'])
// 计算属性：用于实现双向绑定
const computedVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})
const previewRef = ref(null)
const questionTypeStats = computed(() => {
  const stats = {
    single: 0,
    multiple: 0,
    qa: 0,
    judge: 0,
    blank: 0,
  }

  props.selectedQuestions.forEach((question) => {
    if (stats[question.type] !== undefined) {
      stats[question.type]++
    }
  })

  return stats
})

const difficultyStats = computed(() => {
  const stats = {
    easy: 0,
    medium: 0,
    hard: 0,
  }

  props.selectedQuestions.forEach((question) => {
    const difficulty = question.difficulty || 'medium'
    stats[difficulty]++
  })

  return stats
})

const getQuestionTypeName = (type) => {
  const typeNames = {
    single: '单选题',
    multiple: '多选题',
    qa: '问答题',
    judge: '判断题',
    blank: '填空题',
  }
  return typeNames[type] || type
}
</script>

<style></style>
