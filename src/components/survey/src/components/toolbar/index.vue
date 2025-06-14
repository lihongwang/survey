<template>
  <div class="toolbar flex flex-col items-center bg-white border-r">
    <div class="collapse-btn-wrapper h-[50px] border-b flex justify-center items-center">
      <div class="toolbar-item flex justify-center items-center cursor-pointer" @click="handleInfo">
        <InfoIcon class="text-[18px]" />
      </div>
    </div>
    <div
      v-for="(item, index) in toolbarItems"
      :key="index"
      class="toolbar-item py-2 mt-2"
      :class="{ selected: selectedItem === index }"
      @click="selectToolbarItem(index)"
    >
      <el-icon>
        <Component :is="item.icon" />
      </el-icon>
      <div class="text-xs mt-1">{{ item.label }}</div>
    </div>
    <InfoDialog v-model:visible="infoDialogVisible" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createIconifyIcon } from '@/utils/create-icon'
import InfoDialog from '../common/info-dialog.vue'
const InfoIcon = createIconifyIcon('ic:outline-info')
const emit = defineEmits(['toolbar-select'])
const infoDialogVisible = ref(false)
const toolbarItems = [
  {
    label: '大纲',
    key: 'outline',
    icon: createIconifyIcon('ic:outline-library-books'),
  },
  {
    label: '题型',
    key: 'question-type',
    icon: createIconifyIcon('ic:round-list-alt'),
  },
  {
    label: '题库',
    key: 'question-bank',
    icon: createIconifyIcon('ic:outline-local-library'),
  },
]

const selectedItem = ref(0)

const selectToolbarItem = (index) => {
  selectedItem.value = index
  emit('toolbar-select', toolbarItems[index].key)
}
const handleInfo = () => {
  infoDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.toolbar-item {
  @apply cursor-pointer py-2 px-3 rounded flex flex-col items-center justify-center;
  &.selected {
    @apply font-bold;
  }
  &.selected,
  &:hover {
    background-color: #ecf5ff;
    color: #409eff;
    @apply shadow-sm;
  }
}
</style>
