<template>
  <div
    class="designer p-4 bg-white min-h-full overflow-hidden flex flex-col min-w-0"
    :class="{
      'device-mobile': currentDevice === 'mobile',
      'device-tablet': currentDevice === 'tablet',
      'device-pc': currentDevice === 'pc',
    }"
    @dragover.prevent
  >
    <!-- 顶部工具栏 -->
    <Header />
    <!-- 问卷顶部tab标签栏 -->
    <Page />
    <!-- 问卷顶部详情 -->
    <div class="px-[24px] flex justify-end mb-2">
      <span>
        <span v-if="totalScore"> 试卷总分: {{ totalScore }} 分 | </span>
        题目总数: {{ currentPage.questions.length || 0 }}
      </span>
    </div>
    <!-- 问题列表 -->
    <div
      ref="questionListRef"
      class="question-list flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="onDropQuestion"
    >
      <transition-group name="flip-list" tag="div">
        <!-- 拖拽接收区域 -->
        <draggable
          v-if="currentPage"
          v-model="currentPage.questions"
          handle=".drag-handle"
          item-key="id"
          @end="onQuestionSortEnd"
          :animation="300"
          ghost-class="ghost-question"
          chosen-class="chosen-question"
          drag-class="dragging-question"
        >
          <template #item="{ element, index }">
            <div class="question-item-wrapper" :data-question-id="element.id">
              <div class="drop-indicator" :class="{ active: dropPosition === index }"></div>
              <div
                :id="`question-${element.id}`"
                class="question-item relative mb-[24px] p-4 pt-[20px] pb-[30px] border rounded-md transition-all duration-300 group"
                :class="{
                  'border-sky-200 shadow-lg': selectedQuestionId === element.id,
                  'border-sky-50 shadow-sm': selectedQuestionId !== element.id,
                  'hover:border-sky-100 hover:shadow': selectedQuestionId !== element.id,
                }"
                @click.stop="selectQuestion(element)"
              >
                <!-- 拖拽手柄 -->
                <div
                  class="w-full flex items-center top-[3px] justify-center drag-handle absolute transform cursor-move"
                  :class="{
                    'opacity-0 group-hover:opacity-100': selectedQuestionId !== element.id,
                    'opacity-100': selectedQuestionId === element.id,
                  }"
                >
                  <el-icon><DragIcon class="rotate-90 opacity-50" /></el-icon>
                </div>
                <!-- 各类型的问题组件 -->
                <Question
                  :questionType="element.type"
                  :question="element.attrs"
                  v-model:value="questionValues[element.name || element.id]"
                />

                <!-- 问题操作按钮 -->
                <div
                  class="absolute right-[15px] bottom-[5px] flex space-x-2 transition-opacity duration-300"
                  :class="{
                    'opacity-0 group-hover:opacity-100': selectedQuestionId !== element.id,
                    'opacity-100': selectedQuestionId === element.id,
                  }"
                >
                  <el-tooltip content="复制">
                    <el-button
                      size="small"
                      link
                      class="le-icon-button"
                      @click.stop="duplicateQuestion(element.id)"
                    >
                      <el-icon size="small"><CopyDocument /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="删除">
                    <el-button
                      type="danger"
                      size="small"
                      link
                      class="le-icon-button"
                      @click.stop="removeQuestion(element.id)"
                    >
                      <el-icon size="small"><Delete /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </transition-group>

      <!-- 最后一个位置的拖放指示器 -->
      <div
        v-if="currentPage && currentPage.questions.length > 0"
        class="drop-indicator"
        :class="{ active: dropPosition === currentPage.questions.length }"
      ></div>

      <!-- 空状态 -->
      <div
        v-if="!currentPage || currentPage.questions.length === 0"
        class="text-center text-gray-400 p-8 border-2 border-dashed rounded-md"
      >
        拖入问题类型或从题型中添加
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { CopyDocument, Delete, ArrowUp } from '@element-plus/icons-vue'
import Header from './header.vue'
import Page from './page.vue'
import Question from '../../questions/question.vue'
import { createIconifyIcon } from '@/utils/create-icon'
import { useEditorStore, useSurveyStore } from '../../stores'
import { useScrollTo } from '../../hooks/useScrollTo'
import { useSurveyEvents } from '../../hooks/useSurveyEvents'

const DragIcon = createIconifyIcon('ic:baseline-drag-indicator')
const emit = defineEmits(['select-question'])

// 初始化 store
const surveyStore = useSurveyStore()
const editorStore = useEditorStore()
// refs
const questionListRef = ref(null)

// 使用自定义组合函数
const { scrollToQuestion, scrollToTop } = useScrollTo(questionListRef, 200)
const surveyEvents = useSurveyEvents()

// 响应式数据
const questionValues = ref({})
const dropPosition = ref(-1)

// 计算属性
const currentDevice = computed(() => editorStore.deviceType)
const currentSurvey = computed(() => surveyStore.currentSurvey || {})
const selectedQuestionId = computed(() => surveyStore.selectedQuestionId)
const currentPage = computed(() => surveyStore.selectedPage)
const totalScore = computed(() => {
  return (
    currentPage.value?.questions?.reduce((acc, cur) => {
      const score = cur.attrs?.score || 0
      return acc + score
    }, 0) || 0
  )
})
// 选中问题的方法
const selectQuestion = (question) => {
  surveyStore.setSelectedQuestion(question.id)
  emit('select-question', question)
  surveyEvents.selectQuestion(question.id, question)
}

// 滚动到指定问题
const scrollToQuestionById = (questionId, options = {}) => {
  return scrollToQuestion(questionId, {
    container: questionListRef.value,
    ...options,
  })
}

// GoTop 处理方法
const handleGoTop = () => {
  scrollToTop(questionListRef.value)
}

// 拖拽相关方法
const handleDragOver = (event) => {
  event.preventDefault()
  dropPosition.value = calculateDropIndex(event)
}

const handleDragLeave = () => {
  dropPosition.value = -1
}

const calculateDropIndex = (event) => {
  if (!currentPage.value || currentPage.value.questions.length === 0) {
    return 0
  }

  const questionItems = document.querySelectorAll('.question-item-wrapper')
  const dropY = event.clientY

  for (let i = 0; i < questionItems.length; i++) {
    const rect = questionItems[i].getBoundingClientRect()
    const itemMiddle = rect.top + rect.height / 2

    if (dropY < itemMiddle) {
      return i
    }
  }

  return currentPage.value.questions.length
}

// 处理拖拽问题类型到设计区域
const onDropQuestion = (event) => {
  try {
    const dragData = event.dataTransfer.getData('le-survey:drag-drop/question-type')
    if (!dragData) return

    const droppedType = JSON.parse(dragData)

    if (!currentSurvey.value.pages || currentSurvey.value.pages.length === 0) {
      const page = surveyStore.addPage('第1页')
      surveyStore.setSelectedPage(page.id)
    }

    const targetIndex = calculateDropIndex(event)
    const newQuestion = surveyStore.addQuestionAtIndex(droppedType.value, targetIndex)

    if (newQuestion) {
      surveyStore.updateQuestion(newQuestion.id, {
        name: droppedType.name || newQuestion.id,
        title: `新的${droppedType.label || '问题'}`,
        // 将基础属性复制到新问题中
        ...newQuestion.attrs,
      })

      if (
        droppedType.options &&
        Array.isArray(droppedType.options) &&
        droppedType.options.length > 0
      ) {
        const formattedOptions = droppedType.options.map((opt) => ({
          text: opt,
          value: opt,
        }))
        surveyStore.updateQuestion(newQuestion.id, {
          options: formattedOptions,
        })
      }

      selectQuestion(newQuestion)

      nextTick(() => {
        scrollToQuestionById(newQuestion.id)
      })

      surveyEvents.notifyQuestionAdded(newQuestion.id, newQuestion, {
        index: targetIndex,
        type: droppedType.value,
      })
    }

    editorStore.recordHistory()
  } catch (error) {
    console.error('添加问题失败:', error)
  } finally {
    dropPosition.value = -1
  }
}

// 删除问题
const removeQuestion = (questionId) => {
  const question = currentPage.value?.questions?.find((q) => q.id === questionId)
  surveyStore.deleteQuestion(questionId)
  editorStore.recordHistory()

  if (question) {
    surveyEvents.notifyQuestionDeleted(questionId, question)
  }
}

// 复制问题
const duplicateQuestion = (questionId) => {
  const newQuestion = surveyStore.duplicateQuestion(questionId)
  editorStore.recordHistory()

  if (newQuestion) {
    surveyEvents.notifyQuestionAdded(newQuestion.id, newQuestion, {
      isDuplicate: true,
      originalQuestionId: questionId,
    })
  }
}

// 处理问题排序完成
const onQuestionSortEnd = (event) => {
  const targetIndex = event.newIndex
  if (currentPage.value && currentPage.value.questions[targetIndex]) {
    const targetId = currentPage.value.questions[targetIndex].id

    nextTick(() => {
      const targetElement = document.querySelector(`[data-question-id="${targetId}"]`)
      if (targetElement) {
        targetElement.classList.add('highlight-dropped')
        setTimeout(() => {
          targetElement.classList.remove('highlight-dropped')
        }, 1000)
      }
    })
  }

  editorStore.recordHistory()
}

// 设置事件监听器
const setupEventListeners = () => {
  // 监听滚动到问题事件
  surveyEvents.onScrollToQuestion((data) => {
    const { questionId, highlight = true } = data
    scrollToQuestionById(questionId, { highlight })

    if (highlight) {
      const question = currentPage.value?.questions?.find((q) => q.id === questionId)
      if (question) {
        selectQuestion(question)
      }
    }
  })

  // 监听滚动到顶部事件
  surveyEvents.onScrollToTop(() => {
    handleGoTop()
  })

  // 监听页面切换事件
  surveyEvents.onPageChanged(() => {
    nextTick(() => {
      handleGoTop()
    })
  })
}

// 生命周期
onMounted(() => {
  setupEventListeners()
})
</script>

<style scoped>
/* 设备特定样式 */
.question-list {
  transition: all 0.3s ease;
}

/* PC 视图样式 */
.device-pc .question-list {
  max-width: none;
  margin: 0;
}

/* 平板视图样式 */
.device-tablet .question-list {
  max-width: 768px;
  width: 768px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 移动端视图样式 */
.device-mobile .question-list {
  max-width: 375px;
  width: 375px;
  margin: 0 auto;
  padding: 0 16px;
}

.device-mobile .question-item {
  font-size: 14px;
}

.device-mobile .question-item .el-button {
  font-size: 12px;
  padding: 4px 8px;
}

/* 平板和移动端下的问题项间距调整 */
.device-tablet .question-item,
.device-mobile .question-item {
  margin-bottom: 16px;
  padding: 16px;
}

/* 移动端下的拖拽手柄和操作按钮调整 */
.device-mobile .drag-handle {
  top: 2px;
}

.device-mobile .question-item .absolute.right-\[15px\].bottom-\[5px\] {
  right: 8px;
  bottom: 2px;
}

.nav-button {
  transition: opacity 0.3s;
}

.drop-indicator {
  height: 2px;
  background-color: transparent;
  /* margin: 8px 0; */
  transition: all 0.2s;
}

.drop-indicator.active {
  height: 4px;
  background-color: #60a5fa; /* 使用蓝色指示当前拖放位置 */
  display: block;
}

.question-item-wrapper {
  position: relative;
  /* 关键：添加重要的过渡属性 */
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  will-change: transform, opacity;
}

/* 问题项本身 */
.question-item {
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease,
    opacity 0.3s ease;
  will-change: transform, opacity, box-shadow;
}

/* 拖拽时的占位符 */
.ghost-question {
  opacity: 0.3;
  background: #f0f8ff;
  border: 2px dashed #60a5fa !important;
  transition: all 0.3s ease;
}

/* 被选中的元素 */
.chosen-question {
  opacity: 0.8;
  box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
  z-index: 9;
}

/* 正在拖动的元素 */
.dragging-question {
  cursor: grabbing;
  z-index: 10;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* 其他元素的移动过渡 */
.sortable-drag,
.sortable-ghost {
  transition: transform 0.2s ease-in-out;
}

/* 拖拽结束后的元素高亮效果 */
@keyframes highlightItem {
  0% {
    background-color: rgba(96, 165, 250, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

.highlight-dropped {
  animation: highlightItem 1s ease-out;
}

.sortable-ghost {
  opacity: 0.5;
  background: #f0f0f0;
}

.pages-navigation {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.page-tab {
  border: 1px solid #e5e7eb;
  min-width: 120px;
}

.page-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.page-tab:hover .page-actions {
  opacity: 1;
}
</style>
