<template>
  <div class="sidebar-content p-4">
    <!-- 大纲 -->
    <OutlineTree v-if="currentTab === 'outline'" class="outline-tab" />

    <!-- 题型 -->
    <QuestionType v-if="currentTab === 'question-type'" class="question-type-tab" />

    <!-- 题库 -->
    <QuestionBank v-if="currentTab === 'question-bank'" class="question-bank-tab" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import OutlineTree from './outline-tree.vue'
import QuestionType from './question-type.vue'
import QuestionBank from './question-bank.vue'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'outline',
  },
})

const currentTab = ref(props.activeTab)

// 监听 activeTab 变化
const updateTab = (tab) => {
  currentTab.value = tab
}

defineExpose({
  updateTab,
})
</script>
