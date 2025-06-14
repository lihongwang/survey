<template>
  <div class="question-type flex flex-col h-full">
    <Header header="题型列表" />
    <div class="question-type-list flex-1 min-h-0 overflow-auto pr-2">
      <div
        v-for="(type, index) in questionTypes"
        :key="index"
        class="mb-2 p-2 rounded-md cursor-move flex border items-center bg-gray-50 hover:bg-gray-100"
        draggable="true"
        @dragstart="startDrag($event, type)"
      >
        <el-icon class="mr-2"><Component :is="type.icon" /></el-icon>
        <div class="truncate">{{ type.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore, useSurveyStore } from '../../stores'
import Header from '../common/header.vue'
const surveyStore = useSurveyStore()
const questionTypes = surveyStore.allQuestionTypes

// 拖拽发起函数 可以使得目标接收到拖拽源的数据
const startDrag = (event, type) => {
  event.dataTransfer.setData('le-survey:drag-drop/question-type', JSON.stringify(type))
}
</script>

<style></style>
