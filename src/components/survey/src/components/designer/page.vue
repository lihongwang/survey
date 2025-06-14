<template>
  <div
    class="survey-pages-container mb-4 flex items-center w-full shadow-sm px-[10px] rounded-md border"
  >
    <div class="pages-navigation relative flex-1 min-w-0 flex items-center">
      <!-- 左侧翻页按钮 -->
      <div
        v-show="showNavButtons && canScrollLeft"
        class="nav-button left-nav-button left-0 z-10 absolute"
        @click="scrollLeft"
      >
        <el-button circle size="small" class="shadow-md">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
      </div>

      <!-- 页面轮播容器 -->
      <div ref="tabsContainer" class="tabs-container flex-1 overflow-hidden">
        <draggable
          v-model="currentSurvey.pages"
          handle=".page-drag-handle"
          item-key="id"
          class="flex space-x-2 overflow-x-auto py-2 scrollbar-hide transition-all"
          @end="onPageSortEnd"
          ref="draggableContainer"
        >
          <template #item="{ element, index }">
            <div
              class="page-tab flex items-center px-3 py-2 rounded-md cursor-pointer transition-all flex-shrink-0"
              :class="{
                'bg-sky-100 font-medium': currentPageIndex === index,
                'bg-gray-50 hover:bg-gray-100': currentPageIndex !== index,
              }"
              @click="switchToPage(element, index)"
            >
              <div class="page-drag-handle flex items-center mr-2 cursor-move">
                <el-icon><DragIcon class="opacity-50" /></el-icon>
              </div>
              <div class="page-title truncate">
                {{ element.title || `问卷${index + 1}` }}
              </div>
              <div class="page-actions ml-2 flex space-x-1">
                <!-- 编辑 -->
                <el-tooltip content="编辑" placement="top">
                  <el-button type="primary" size="small" link @click.stop="editPage(element.id)">
                    <el-icon size="small"><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <!-- 复制 -->
                <el-tooltip content="复制" placement="top">
                  <el-button
                    type="success"
                    size="small"
                    link
                    @click.stop="duplicatePage(element.id)"
                  >
                    <el-icon size="small"><CopyDocument /></el-icon>
                  </el-button>
                </el-tooltip>

                <!-- 删除 -->
                <el-tooltip content="删除" placement="top">
                  <el-button
                    type="danger"
                    size="small"
                    link
                    @click.stop="removePage(element.id)"
                    :disabled="currentSurvey.pages.length <= 1"
                  >
                    <el-icon size="small"><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 右侧翻页按钮 -->
      <div
        v-show="showNavButtons && canScrollRight"
        class="nav-button right-nav-button right-0 z-10 absolute"
        @click="scrollRight"
      >
        <el-button circle size="small" class="shadow-md">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
    <!-- 固定在最右侧的添加页面按钮 -->
    <div class="ml-2 flex-shrink-0 add-button-wrapper">
      <el-button size="small" @click="addNewPage" class="add-button">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>
    <!-- 修改属性弹窗 -->
    <el-dialog v-model="changePageDialogVisible" title="修改属性" width="30%">
      <el-form class="mt-4">
        <el-form-item label="名称">
          <el-input v-model="changePage.title" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-center">
          <el-button @click="changePageDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEditPage(changePage.id, changePage.title)"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import { ElButton, ElIcon, ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight, Plus, CopyDocument, Delete } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useEditorStore, useSurveyStore } from '../../stores'
import { createIconifyIcon } from '@/utils/create-icon'
const DragIcon = createIconifyIcon('ic:baseline-drag-indicator')
const surveyStore = useSurveyStore()
const editorStore = useEditorStore()
const currentSurvey = computed(() => surveyStore.currentSurvey || {})
// 当前页面索引
const currentPageIndex = computed(() => surveyStore.selectedPageIndex)
// 要修改的页面
const changePage = ref({})
// 滚动相关的 ref
const tabsContainer = ref(null)
const draggableContainer = ref(null)

// 控制滚动按钮显示的状态
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showNavButtons = ref(false)

// 修改名字弹窗状态
const changePageDialogVisible = ref(false)

// 获取当前页面
const currentPage = computed(() => {
  if (
    currentSurvey.value &&
    currentSurvey.value.pages &&
    currentSurvey.value.pages.length > 0 &&
    currentPageIndex.value < currentSurvey.value.pages.length
  ) {
    return currentSurvey.value.pages[currentPageIndex.value]
  }
  return null
})

// 检查是否需要显示滚动按钮
const checkScrollButtons = () => {
  nextTick(() => {
    if (!tabsContainer.value || !draggableContainer.value) return

    const container = tabsContainer.value
    const content = draggableContainer.value.$el

    // 检查是否需要显示导航按钮
    showNavButtons.value = content.scrollWidth > container.clientWidth
    canScrollLeft.value = content.scrollLeft > 0
    canScrollRight.value = content.scrollLeft + container.clientWidth < content.scrollWidth
  })
}

// 向左滚动
const scrollLeft = () => {
  if (!draggableContainer.value) return
  const container = draggableContainer.value.$el
  const scrollAmount = container.clientWidth / 2
  container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })

  // 滚动后更新按钮状态
  setTimeout(() => {
    checkScrollButtons()
  }, 300)
}

// 向右滚动
const scrollRight = () => {
  if (!draggableContainer.value) return
  const container = draggableContainer.value.$el
  const scrollAmount = container.clientWidth / 2
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' })

  // 滚动后更新按钮状态
  setTimeout(() => {
    checkScrollButtons()
  }, 300)
}
// 切换到指定页面
const switchToPage = (element, index) => {
  surveyStore.setSelectedPage(element.id)
}

// 添加新页面
const addNewPage = () => {
  const pageCount = currentSurvey.value.pages.length
  const newPage = surveyStore.addPage(`问卷${pageCount + 1}`)
  surveyStore.setSelectedPage(newPage.id)
  editorStore.recordHistory()
  nextTick(() => {
    checkScrollButtons()
    // 添加新页面后自动滚动到最右侧
    if (draggableContainer.value) {
      const container = draggableContainer.value.$el
      container.scrollLeft = container.scrollWidth
    }
  })
}

// 编辑页面
const editPage = (pageId) => {
  const pageIndex = currentSurvey.value.pages.findIndex((p) => p.id === pageId)
  if (pageIndex !== -1) {
    changePage.value = currentSurvey.value.pages[pageIndex]
    surveyStore.setSelectedPage(pageId)
    changePageDialogVisible.value = true
  }
}

// 确认编辑
const confirmEditPage = (pageId, title) => {
  surveyStore.setSelectedPage(pageId)
  surveyStore.updatePage(pageId, {
    title,
  })
  changePageDialogVisible.value = false
}

// 复制页面
const duplicatePage = (pageId) => {
  const pageIndex = currentSurvey.value.pages.findIndex((p) => p.id === pageId)
  if (pageIndex !== -1) {
    const origPage = currentSurvey.value.pages[pageIndex]
    const newPage = surveyStore.duplicatePage(pageId)
    // 切换到新复制的页面
    surveyStore.setSelectedPage(newPage.id)

    editorStore.recordHistory()
  }
  nextTick(() => {
    checkScrollButtons()
  })
}

// 删除页面
const removePage = (pageId) => {
  // 确保至少保留一个页面
  if (currentSurvey.value.pages.length <= 1) {
    return
  }
  let currentIndex
  const page = currentSurvey.value.pages.find((p, index) => {
    if (p.id === pageId) {
      currentIndex = index
      return true
    }
    return false
  })
  const doRemove = () => {
    // 删除前确定要选择的新页面
    let newSelectedPageId

    // 如果删除的是当前选中的页面
    if (currentPageIndex.value === currentIndex) {
      // 优先选择下一个页面，如果是最后一个则选择前一个页面
      const nextIndex =
        currentIndex < currentSurvey.value.pages.length - 1 ? currentIndex + 1 : currentIndex - 1
      newSelectedPageId = currentSurvey.value.pages[nextIndex].id
    } else {
      // 如果删除的不是当前页面，保持当前选中状态
      newSelectedPageId = currentSurvey.value.pages[currentPageIndex.value].id
    }

    // 执行删除操作
    surveyStore.deletePage(pageId)

    // 设置新的选中页面
    surveyStore.setSelectedPage(newSelectedPageId)

    editorStore.recordHistory()
    nextTick(() => {
      checkScrollButtons()
    })

    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  }
  if (page) {
    if (page.questions.length > 0) {
      ElMessageBox.confirm('选择的页面包含问题，删除后问题将被删除，是否继续？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          doRemove()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        })
    } else {
      doRemove()
    }
  }
}

// 页面排序完成
const onPageSortEnd = () => {
  console.log('Pages sorted')
  editorStore.recordHistory()
  nextTick(() => {
    checkScrollButtons()
  })
}

// 监听页面数量变化
watch(
  () => currentSurvey.value?.pages?.length,
  () => {
    nextTick(() => {
      checkScrollButtons()
    })
  },
)

// 监听元素滚动
const handleScroll = () => {
  if (!draggableContainer.value) return
  const container = draggableContainer.value.$el
  canScrollLeft.value = container.scrollLeft > 0
  canScrollRight.value = container.scrollLeft + container.clientWidth < container.scrollWidth
}

onMounted(() => {
  checkScrollButtons()
  // 监听窗口大小变化
  window.addEventListener('resize', checkScrollButtons)

  // 监听滚动事件
  if (draggableContainer.value && draggableContainer.value.$el) {
    draggableContainer.value.$el.addEventListener('scroll', handleScroll)
  }

  // 使用 MutationObserver 监听内容变化
  nextTick(() => {
    const observer = new MutationObserver(checkScrollButtons)
    if (draggableContainer.value && draggableContainer.value.$el) {
      observer.observe(draggableContainer.value.$el, {
        childList: true,
        subtree: true,
      })
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScrollButtons)
  if (draggableContainer.value && draggableContainer.value.$el) {
    draggableContainer.value.$el.removeEventListener('scroll', handleScroll)
  }
})
</script>
<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.page-drag-handle {
  padding-top: 3px;
}
.page-tab {
  height: 32px;
}
.add-button {
  height: 32px;
  width: 32px;
}
.nav-button {
  transition: opacity 0.3s;
  background: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  &.left-nav-button {
    padding-left: 0;
  }
  &.right-nav-button {
    padding-right: 0;
  }
}
</style>
