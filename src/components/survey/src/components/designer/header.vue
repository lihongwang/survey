<template>
  <Header v-model:header="currentSurvey.title" :editable="true">
    <template #right-content>
      <div class="actions flex items-center gap-2">
        <!-- 撤销/重做/清空 -->
        <!-- <div class="flex items-center bg-gray-100 rounded-lg py-1 px-2">
          <el-button
            size="small"
            @click="handleUndo"
            :class="[
              'flex items-center text-sm font-medium transition-all duration-200',
            ]"
          >
            <el-icon><BackIcon /></el-icon>
            <span>撤销</span>
          </el-button>
          <el-button
            size="small"
            @click="handleRedo"
            :class="[
              'flex items-center text-sm font-medium transition-all duration-200',
            ]"
          >
            <el-icon><BackIcon class="rotate-180" /></el-icon>
            <span>重做</span>
          </el-button>
        </div> -->

        <!-- 中间设备切换按钮组 -->
        <div class="flex items-center bg-gray-100 rounded-lg py-1 px-2">
          <el-button
            size="small"
            v-for="device in devices"
            :key="device.type"
            :type="currentDevice === device.type ? 'primary' : 'default'"
            @click="switchDevice(device.type)"
            :class="['flex items-center transition-all duration-200']"
          >
            <el-icon :size="16">
              <component :is="device.icon" />
            </el-icon>
            <span>{{ device.label }}</span>
          </el-button>
        </div>

        <!-- 导入导出 -->
        <div class="flex items-center bg-gray-100 rounded-lg py-1 px-2">
          <el-dropdown @command="handleExportImport">
            <el-button size="small">
              <span>导入/导出</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="export">导出JSON</el-dropdown-item>
                <el-dropdown-item command="import">导入JSON</el-dropdown-item>
                <el-dropdown-item command="viewJson">查看/编辑JSON</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            size="small"
            type="danger"
            @click="handleClear"
            :class="['flex items-center text-sm font-medium transition-all duration-200 ml-3']"
          >
            <el-icon><DeleteIcon /></el-icon>
            <span>清空</span>
          </el-button>
        </div>
        <!-- 隐藏的文件导入元素 -->
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleFileImport"
        />
      </div>
    </template>
  </Header>

  <!-- JSON编辑器对话框 -->
  <EditorDialog v-model:visible="editorDialogVisible" />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Header from '../common/header.vue'
import { createIconifyIcon } from '@/utils/create-icon'
import { useEditorStore, useSurveyStore } from '../../stores'
import { ElMessageBox, ElMessage } from 'element-plus'
import EditorDialog from '../common/editor-dialog.vue'
// 初始化 store 和图标
const BackIcon = createIconifyIcon('ic:outline-settings-backup-restore')
const DeleteIcon = createIconifyIcon('ep:delete')
const ArrowDown = createIconifyIcon('ep:arrow-down')
const CopyDocument = createIconifyIcon('ep:document-copy')
const Check = createIconifyIcon('ep:check')
const Operation = createIconifyIcon('ep:operation')
const Desktop = createIconifyIcon('ic:round-desktop-windows')
const Mobile = createIconifyIcon('ic:round-smartphone')
const Tablet = createIconifyIcon('ic:round-tablet-mac')

const surveyStore = useSurveyStore()
const editorStore = useEditorStore()
const currentDevice = ref('pc')
const currentSurvey = computed(() => surveyStore.currentSurvey || {})
const canUndo = computed(() => editorStore.history.past.length > 0)
const canRedo = computed(() => editorStore.history.future.length > 0)
const viewMode = ref(editorStore.viewMode)
const devices = [
  {
    type: 'pc',
    label: 'PC',
    icon: Desktop,
    width: '100%',
    breakpoint: 1024,
  },
  {
    type: 'tablet',
    label: '平板',
    icon: Tablet,
    width: '768px',
    breakpoint: 768,
  },
  {
    type: 'mobile',
    label: '移动端',
    icon: Mobile,
    width: '375px',
    breakpoint: 375,
  },
]
// Monaco 编辑器相关
const editorDialogVisible = ref(false)

// 文件导入相关
const fileInput = ref(null)

// 处理撤销操作
const handleUndo = () => {
  editorStore.undo()
}

// 处理重做操作
const handleRedo = () => {
  editorStore.redo()
}

// 处理清空问卷操作
const handleClear = async () => {
  try {
    await ElMessageBox.confirm('确定要清空当前问卷所有内容吗？此操作不可恢复！', '清空问卷', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    editorStore.recordHistory()
    surveyStore.resetCurrentSurvey()
    editorStore.setSaveStatus('unsaved')
  } catch {
    // 用户取消操作
  }
}

onMounted(() => {
  nextTick(() => {
    editorStore.setDeviceType('pc')
  })
})

const switchDevice = (deviceType) => {
  currentDevice.value = deviceType
  editorStore.setDeviceType(deviceType)
}

// 处理导入导出操作
const handleExportImport = (command) => {
  switch (command) {
    case 'export':
      exportJson()
      break
    case 'import':
      fileInput.value.click()
      break
    case 'viewJson':
      showJsonDialog()
      break
  }
}

// 导出JSON文件
const exportJson = () => {
  const surveyData = JSON.stringify(surveyStore.currentSurvey, null, 2)
  const blob = new Blob([surveyData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${currentSurvey.value.title || '未命名问卷'}_${new Date().getTime()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success('问卷导出成功')
}

// 处理文件导入
const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)

      // 确认是否导入
      await ElMessageBox.confirm('导入将覆盖当前问卷内容，确定继续吗？', '导入确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      // 记录历史以便可以撤销
      editorStore.recordHistory()

      // 导入数据
      await surveyStore.createSurveyFromJson(jsonData)

      ElMessage.success('问卷导入成功')
    } catch (err) {
      ElMessage.error('导入失败：无效的问卷JSON格式')
      console.error('导入错误:', err)
    } finally {
      // 重置文件输入，允许再次选择相同文件
      event.target.value = ''
    }
  }

  reader.readAsText(file)
}

// 显示JSON对话框
const showJsonDialog = () => {
  editorDialogVisible.value = true
}
</script>

<style scoped></style>
