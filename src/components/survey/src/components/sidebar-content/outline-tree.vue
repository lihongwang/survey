<template>
  <div class="outline-tree">
    <Header header="问卷大纲" />
    <el-tree
      v-if="outlineData"
      :data="outlineData"
      default-expand-all
      node-key="id"
      :expand-on-click-node="false"
      :current-node-key="checkedKey"
      :indent="8"
      draggable
      highlight-current
      :allow-drop="allowDrop"
      @node-drag-end="handleDragEnd"
    >
      <template #default="schema">
        <el-tooltip
          class="tree-label-tooltip"
          effect="dark"
          :content="schema?.data.label"
          placement="right-start"
        >
          <div class="tree-item flex items-center gap-1 truncate">
            <component
              :is="createIconifyIcon(schema?.data.icon || 'ic:outline-insert-drive-file')"
            />
            <span
              class="truncate"
              @click="handleNodeClick(schema?.node, schema?.data)"
              :class="{
                selected: schema?.data.id === checkedKey,
              }"
              >{{ schema?.data.label }}</span
            >
          </div>
        </el-tooltip>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Header from '../common/header.vue'
import { createIconifyIcon } from '@/utils/create-icon'
import { useSurveyStore } from '../../stores'
import { useSurveyEvents } from '../../hooks/useSurveyEvents'
console.log(1234567)
const surveyStore = useSurveyStore()
const outlineData = computed(() => surveyStore.outlineData)

console.log(outlineData)
const surveyEvents = useSurveyEvents()
console.log(outlineData)
// 添加允许放置的验证方法
const allowDrop = (draggingNode, dropNode, type) => {
  // 获取拖拽节点和目标节点的数据
  const draggingData = draggingNode.data
  const dropData = dropNode.data
  console.log(draggingData, dropData, type)
  // 如果拖拽的是问题节点
  if (draggingData.type !== 'page') {
    // 如果放置类型是'inner'，则目标必须是page节点
    if (type === 'inner') {
      return dropData.type === 'page'
    }
    // 如果放置类型是'before'或'after'，则目标的父节点必须是page节点
    else {
      // 检查目标节点的父节点是否为page节点
      const parentNode = dropNode.parent
      const parentData = parentNode.data
      // 如果父节点存在且是page节点，则允许放置
      if (parentData && parentData.type === 'page') {
        return true
      }
      return false
    }
  }

  // 如果拖拽的是page节点，可以自由放置（或根据需要添加其他限制）
  return true
}

// 拖拽结束事件
const handleDragEnd = (draggingNode, dropNode, dropType, event) => {
  if (!dropNode) return // 如果没有有效的放置节点，直接返回
  surveyStore.updateSurveyByOutlineStructure(draggingNode, dropNode, dropType)
}

const checkedKey = computed(() => {
  console.log(surveyStore.selectedQuestionId)
  return surveyStore.selectedQuestionId
})

const handleNodeClick = (node, data) => {
  console.log(node, data)
  if (data.type === 'page') {
    surveyStore.setSelectedPage(data.id)
  } else {
    surveyStore.setSelectedPage(data.pageId, data.id)
  }
  // 通过事件总线发送滚动事件
  surveyEvents.scrollToQuestion(data.id, {
    highlight: true,
    offset: 20,
  })
}
</script>

<style scoped>
.tree-item:hover {
  background-color: #f0f0f0;
  color: #409eff;
}

.tree-item.selected {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

/* Ensure the tree node has proper spacing */
:deep(.el-tree-node__content) {
  height: auto;
  min-height: 32px;
  margin: 2px 0;
}
</style>
