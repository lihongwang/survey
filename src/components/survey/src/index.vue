<template>
  <div class="flex h-full w-full">
    <!-- 最左侧的工具栏 -->
    <Toolbar class="w-16 bg-gray-100" @toolbar-select="handleToolbarSelect" />
    <Loading v-if="!currentSurvey" class="size-full h-auto min-h-full" spinning />
    <div class="flex flex-1 min-w-0" v-else>
      <!-- 左侧边栏 -->
      <SidebarContent ref="sidebarRef" class="w-64 border-r" :active-tab="activeTab" />
      <!-- 中间的问卷设计器 -->
      <Designer ref="designerRef" class="flex-1" :current-survey="currentSurvey" />
      <!-- 右侧边栏 -->
      <AttrPanel
        v-if="isPanelVisible"
        :question="selectedQuestion"
        :panel-type="activePanelType"
        class="w-[480px] border-l transition-all"
      />
      <!-- 最右侧的选择项 -->
      <AttrType
        class="w-16 bg-white border-l"
        @toolbar-select="handleToolbarSelect"
        @toggle-panel="toggleAttrPanel"
        @switch-panel-type="switchPanelType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Loading from '@/components/loading.vue'
import Toolbar from './components/toolbar/index.vue'
import SidebarContent from './components/sidebar-content/index.vue'
import Designer from './components/designer/index.vue'
import AttrPanel from './components/attr-panel/index.vue'
import AttrType from './components/attr-type/index.vue'
import { useSurveyStore } from './stores/survey'
import { useEditorStore } from './stores/editor'

const props = defineProps({
  surveyJson: {
    type: Object,
    default: () => ({}),
  },
  surveyTitle: {
    type: String,
    default: '问卷调查',
  },
})

// 初始化 store
const surveyStore = useSurveyStore()
const editorStore = useEditorStore()

// 组件引用
const sidebarRef = ref(null)
const designerRef = ref(null)
const activeTab = ref('outline')

// 属性面板状态
const isPanelVisible = ref(true)
const activePanelType = ref('basic')

// 从 store 获取数据
const currentSurvey = computed(() => surveyStore.currentSurvey)
const selectedQuestion = computed(() => surveyStore.selectedQuestion)

// 初始化问卷
onMounted(() => {
  // 检查是否有要导入的JSON数据
  if (props.surveyJson && props.surveyJson.pages) {
    surveyStore.createSurveyFromJson(props.surveyJson, props.surveyTitle)
  } else {
    // 如果没有JSON数据，创建一个空问卷
    surveyStore.createSurvey(props.surveyTitle)
  }
  // 记录初始历史状态
  editorStore.recordHistory()
})

const handleToolbarSelect = (tabKey) => {
  activeTab.value = tabKey
  if (sidebarRef.value) {
    sidebarRef.value.updateTab(tabKey)
  }
}

// 切换属性面板显示/隐藏
const toggleAttrPanel = (isVisible) => {
  isPanelVisible.value = isVisible
}

// 切换属性面板类型
const switchPanelType = (type) => {
  activePanelType.value = type
}
defineExpose({
  currentSurvey,
})
</script>
