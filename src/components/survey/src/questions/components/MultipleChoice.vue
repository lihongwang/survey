<template>
  <BaseQuestion :question="question">
    <el-checkbox-group
      v-model="selectedOptions"
      class="flex"
      :class="question.layout === 'vertical' ? 'flex-col items-start' : 'flex-row items-center'"
    >
      <el-checkbox v-for="(option, index) in question.options" :key="index" :label="option.value">
        {{ optionNameList[index] }}. {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>
    <div v-if="question.hasOther" class="mt-2 flex items-center">
      <el-checkbox v-model="hasOther" class="mr-2">其他:</el-checkbox>
      <el-input v-model="otherText" :disabled="!hasOther" class="w-64" />
    </div>
  </BaseQuestion>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseQuestion from './BaseQuestion.vue'
import { useEditorStore } from '../../stores/editor'
import { useSurveyStore } from '../../stores/survey'
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})
// 初始化store
const editorStore = useEditorStore()
const surveyStore = useSurveyStore()
// 全部选项的前缀名字
const optionNameList = ref([])

const selectedOptions = ref([])
const hasOther = ref(false)
const otherText = ref('')
// selectedOptions 变化时更新 optionNameList 和 options
const refreshOptions = (optionsType) => {
  surveyStore.initOptionsValue() // 初始化选项值
  console.log('props.question', props.question)
  optionNameList.value = props.question?.options?.map((option, index) =>
    editorStore.changeOptionName(index, optionsType),
  )
}
// 选项前缀变化时更新
watch(
  () => props.question.optionsType,
  (optionsType) => {
    refreshOptions(optionsType)
  },
  {
    immediate: true,
  },
)
// 选项变化时更新
watch(
  () => props.question.options.length,
  (val) => {
    if (val) {
      // 更新options
      refreshOptions(props.question.optionsType)
    }
  },
  {
    immediate: true,
  },
)
</script>
