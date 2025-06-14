<template>
  <div class="question-preview">
    <component
      :is="questionComponents[questionType]"
      v-if="questionComponents[questionType]"
      :question="question"
      :questionType="questionType"
      @update:value="handleValueUpdate"
    />
    <div v-else class="question-not-found">未知题型: {{ questionType }}</div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, provide } from 'vue'
// 各类题型
import SingleChoice from './components/SingleChoice.vue'
import MultipleChoice from './components/MultipleChoice.vue'
import FillBlank from './components/FillBlank.vue'
import TextArea from './components/TextArea.vue'
import Rating from './components/Rating.vue'
import MatrixChoice from './components/MatrixChoice.vue'
import TrueFalse from './components/TrueFalse.vue'
import Ranking from './components/Ranking.vue'
import DatePicker from './components/DatePicker.vue'
import FileUpload from './components/FileUpload.vue'
import Calculation from './components/Calculation.vue'
import Paragraph from './components/Paragraph.vue'
import GroupQuestion from './components/GroupQuestion.vue'
import StemQuestion from './components/StemQuestion.vue'
import SubjectiveQuestion from './components/SubjectiveQuestion.vue'

const props = defineProps({
  questionType: {
    type: String,
    required: true,
  },
  question: {
    type: Object,
    required: true,
  },
  value: {
    type: [String, Number, Boolean, Array, Object],
    default: null,
  },
})
console.log(props)
const emit = defineEmits(['update:value'])

// 注册各类题型组件
const questionComponents = {
  SingleChoice: SingleChoice,
  MultipleChoice: MultipleChoice,
  FillBlank: FillBlank,
  TextArea: TextArea,
  Rating: Rating,
  MatrixChoice: MatrixChoice,
  TrueFalse: TrueFalse,
  Ranking: Ranking,
  DatePicker: DatePicker,
  FileUpload: FileUpload,
  Calculation: Calculation,
  Paragraph: Paragraph,
  Group: GroupQuestion,
  StemQuestion: StemQuestion,
  SubjectiveQuestion: SubjectiveQuestion,
}
provide('questionComponents', questionComponents)

const currentValue = ref(props.value)

const handleValueUpdate = (newValue) => {
  currentValue.value = newValue
  emit('update:value', newValue)
}
</script>

<style scoped>
.question-preview {
  border: 1px solid #ebedf0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 10px;
  background-color: #fff;
}

.question-not-found {
  color: #ff4d4f;
  font-size: 14px;
}
</style>
