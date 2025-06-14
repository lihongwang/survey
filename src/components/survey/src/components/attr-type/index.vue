<template>
  <div class="attr-type-container px-[10px] flex flex-col h-full">
    <div class="collapse-btn-wrapper h-[50px] border-b flex justify-center items-center">
      <el-tooltip :content="isPanelVisible ? '折叠' : '展开'" placement="left">
        <div
          class="attr-type-item collapse-btn flex justify-center h-8 items-center cursor-pointer hover:bg-gray-200"
          @click="toggleAttrPanel"
        >
          <ToggleIcon class="text-[18px]" :class="{ 'rotate-180': !isPanelVisible }" />
        </div>
      </el-tooltip>
    </div>
    <div class="attr-type-items flex flex-col flex-1 min-h-0 mt-2 gap-2 py-2">
      <div
        v-for="type in availablePanelTypes"
        :key="type.key"
        class="attr-type-item flex justify-center items-center h-8 cursor-pointer"
        :class="{ 'bg-blue-100': activePanelType === type.key }"
        @click="switchPanelType(type.key)"
      >
        <el-tooltip :content="type.label" placement="left">
          <component :is="createIconifyIcon(type.icon)" class="text-lg" />
        </el-tooltip>
      </div>
    </div>
    <!-- GoTop按钮 -->
    <Transition name="fade">
      <div v-if="goTopButtonShown" class="go-top-button pb-2" @click="handleGoTop">
        <div
          class="flex items-center justify-center bg-blue-100 attr-type-item cursor-pointer transition-all duration-500"
        >
          <el-icon><ArrowUp /></el-icon>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { createIconifyIcon } from '@/utils/create-icon'
import { useEditorStore, useSurveyStore } from '../../stores'
import { basePanelTypes, extendedPanelTypes } from '../../attrs'
import { useSurveyEvents } from '../../hooks/useSurveyEvents'
import { ArrowUp } from '@element-plus/icons-vue'
const surveyStore = useSurveyStore()
const surveyEvents = useSurveyEvents()

const ToggleIcon = createIconifyIcon('ic:baseline-join-left')

const emit = defineEmits(['toggle-panel', 'switch-panel-type'])

// Panel visibility state
const isPanelVisible = ref(true)
const availablePanelTypes = ref()
const activePanelType = ref()
// 基础面板类型配置

watch(
  () => surveyStore.selectedQuestion?.selectedAttrPanelType,
  (type) => {
    if (type) {
      const question = surveyStore.selectedQuestion
      activePanelType.value = question.selectedAttrPanelType
      const additionalTypes = extendedPanelTypes[question.type] || []
      availablePanelTypes.value = [...basePanelTypes, ...additionalTypes]
    } else {
      availablePanelTypes.value = [...basePanelTypes]
    }
  },
  { immediate: true, deep: true },
)
// Toggle panel visibility
const toggleAttrPanel = () => {
  isPanelVisible.value = !isPanelVisible.value
  emit('toggle-panel', isPanelVisible.value)
}

// Switch panel type
const switchPanelType = (type) => {
  surveyStore.setSelectedAttrPanelType(type)
}
const goTopButtonShown = ref(false)
const handleGoTop = () => {
  surveyEvents.scrollToTop()
}
// 设置事件监听器
const setupEventListeners = () => {
  // 监听页面切换事件
  surveyEvents.onToggleGoTopButton(({ shown }) => {
    // console.log('Toggle GoTop Button:', shown);
    goTopButtonShown.value = shown
  })
}
// 生命周期
onMounted(() => {
  setupEventListeners()
})
</script>

<style scoped>
.attr-type-container {
  width: 52px;
  transition: all 0.3s ease;
  border-right: 1px solid #e5e7eb;
}

.attr-type-item {
  @apply rounded-md;
  width: 32px;
  height: 32px;
  transition: background-color 0.2s ease;
}

.attr-type-item:hover {
  background-color: #e5e7eb;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
