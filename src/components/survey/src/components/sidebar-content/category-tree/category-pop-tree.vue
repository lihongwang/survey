<template>
  <div class="choose-question-container bg-white rounded-md w-full flex flex-col">
    <!-- Content -->
    <div class="content border rounded-md flex h-[500px]">
      <!-- Left sidebar -->
      <CategoryTree class="sidebar w-[300px] border-r p-4" />

      <!-- Right content -->
      <div class="question-area flex-1 flex flex-col">
        <div class="p-4 border-b">
          <span class="text-sm text-gray-600">题目列表</span>
        </div>
        <div class="p-4">
          <el-input v-model="searchQuery" placeholder="请输入题目名称内容" class="w-full">
            <template #suffix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- Question type tabs -->
        <div class="question-types px-4 border-b pb-2">
          <el-radio-group v-model="questionType" size="small">
            <el-radio-button
              v-for="type in questionTypes"
              :label="type.label"
              :value="type.value"
              :key="type"
            />
          </el-radio-group>
        </div>

        <!-- Selected count -->
        <div class="selected-count px-4 border-b py-2 flex justify-between items-center">
          <span class="text-sm"
            >已选择
            <span class="text-blue-500">({{ selectedQuestions.length }})</span>
            题</span
          >
          <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
        </div>

        <!-- Questions list -->
        <div class="questions-list flex-1 overflow-y-auto px-4 pb-1">
          <div
            v-for="(question, index) in displayQuestions"
            :key="index"
            class="question-item py-4"
            :class="{
              'border-t': index,
            }"
          >
            <div class="flex">
              <el-checkbox v-model="question.selected" class="self-start" />
              <div class="ml-2 flex-1">
                <div class="question-text mb-2">{{ question.text }}</div>
                <div class="options">
                  <div
                    v-for="option in question.options"
                    :key="option.key"
                    class="flex items-center mb-2"
                  >
                    <el-radio
                      v-if="questionType === 'SingleChoice'"
                      :model-value="question.answer"
                      :label="option.key"
                      disabled
                      :class="{
                        'text-green-500': option.key === question.answer,
                      }"
                    >
                      {{ option.key }}. {{ option.text }}
                    </el-radio>
                    <el-checkbox
                      v-else-if="questionType === 'MultipleChoice'"
                      :model-value="question.answers?.includes(option.key)"
                      disabled
                      :class="{
                        'text-green-500': question.answers?.includes(option.key),
                      }"
                    >
                      {{ option.key }}. {{ option.text }}
                    </el-checkbox>
                  </div>
                </div>
              </div>
              <span
                v-if="question.difficulty === 'hard'"
                class="difficulty text-red-500 text-sm self-start ml-2"
              >
                困难
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer flex justify-between p-4 pb-0">
      <div>
        <el-button @click="handleRandomSelect">随机选题设置</el-button>
        <el-button @click="handlePreviewSelected">查看已选题目</el-button>
      </div>
      <div>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确定</el-button>
      </div>
    </div>
  </div>
  <!-- Preview Selected Modal -->
  <PreviewSelectedDialog
    v-model:visible="previewDialogVisible"
    :selectedQuestions="selectedQuestions"
  />
  <!-- Random Selection Modal -->
  <RandomChooseDialog
    v-model:visible="randomSelectionDialogVisible"
    @applyRandomSelection="applyRandomSelection"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Close, Search } from '@element-plus/icons-vue'
import CategoryTree from './index.vue'
import { useEditorStore, useSurveyStore } from '../../../stores'
import PreviewSelectedDialog from './preview-selected-dialog.vue'
import RandomChooseDialog from './random-choose-dialog.vue'
const emit = defineEmits(['close'])
// State
const surveyStore = useSurveyStore()
const searchQuery = ref('')
const questionTypes = surveyStore.allQuestionTypes
const questionType = ref('SingleChoice')
const selectedQuestions = ref([])
const selectAll = ref(false)
const previewDialogVisible = ref(false)
const randomSelectionDialogVisible = ref(false)
const randomSelectionTypes = ref(['SingleChoice', 'MultipleChoice'])
const randomSelectionCount = ref(5)

const questions = ref([
  {
    id: 1,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    selected: true,
  },
  {
    id: 2,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    selected: true,
  },
  {
    id: 3,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    difficulty: 'hard',
    selected: false,
  },
  {
    id: 4,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    difficulty: 'hard',
    selected: false,
  },
  {
    id: 5,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    difficulty: 'hard',
    selected: false,
  },
  {
    id: 6,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    difficulty: 'hard',
    selected: false,
  },
  {
    id: 7,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    difficulty: 'hard',
    selected: false,
  },
  {
    id: 8,
    text: '我是题目我是题目我是题目我是题目我是题目我是题目我是题目我是题目',
    type: 'SingleChoice',
    options: [
      { key: 'A', text: '我是选项' },
      { key: 'B', text: '我是选项' },
      { key: 'C', text: '我是选项' },
      { key: 'D', text: '我是选项' },
    ],
    answer: 'A',
    difficulty: 'hard',
    selected: false,
  },
])

// Computed

const displayQuestions = computed(() => {
  return questions.value.filter((q) => q.type === questionType.value)
})

const handleSelectAll = (value) => {
  displayQuestions.value.forEach((q) => (q.selected = value))
  updateSelectedQuestions()
}

const updateSelectedQuestions = () => {
  selectedQuestions.value = questions.value.filter((q) => q.selected)
}

const handleRandomSelect = () => {
  randomSelectionDialogVisible.value = true
}

const applyRandomSelection = ({ randomSelectionCount, randomSelectionTypes }) => {
  // Reset current selections
  questions.value.forEach((q) => (q.selected = false))

  // Filter questions by selected types
  const eligibleQuestions = questions.value.filter((q) => randomSelectionTypes.includes(q.type))

  // Randomly select questions
  let count = Math.min(randomSelectionCount, eligibleQuestions.length)
  const shuffled = [...eligibleQuestions].sort(() => 0.5 - Math.random())

  // Mark selected questions
  shuffled.slice(0, count).forEach((q) => {
    const question = questions.value.find((item) => item.id === q.id)
    if (question) question.selected = true
  })

  updateSelectedQuestions()
  randomSelectionDialogVisible.value = false
}

const handlePreviewSelected = () => {
  updateSelectedQuestions()
  previewDialogVisible.value = true
}

const confirmSelection = () => {
  updateSelectedQuestions()
  // Here you would typically save the selected questions or pass them back to parent
  console.log('Confirmed selection:', selectedQuestions.value)
  closeDialog()
}

const closeDialog = () => {
  emit('close')
}
</script>

<style scoped>
.question-selector-dialog {
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial,
    sans-serif;
}

/* Additional custom styles can be added here */
</style>
