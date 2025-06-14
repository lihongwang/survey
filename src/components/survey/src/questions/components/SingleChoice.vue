<template>
  <BaseQuestion :question="attrs">
    <el-radio-group
      v-model="selectedOption"
      class="flex"
      :class="attrs.layout === 'vertical' ? 'flex-col items-start' : 'flex-row items-center'"
    >
      <el-radio v-for="(option, index) in question.options" :key="index" :label="option.value">
        {{ optionNameList[index] }}. {{ option.label }}
      </el-radio>
    </el-radio-group>
    <div v-if="attrs.hasOther" class="mt-2 flex items-center">
      <el-radio v-model="selectedOption" label="other" class="mr-2"> 其他: </el-radio>
      <el-input v-model="otherText" :disabled="selectedOption !== 'other'" class="w-64" />
    </div>
  </BaseQuestion>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseQuestion from './BaseQuestion.vue'
import { useEditorStore } from '../../stores/editor'
import { useSurveyStore } from '../../stores/survey'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const attrs = computed(() => {
  return props.question
})

// 初始化store
const editorStore = useEditorStore()
const surveyStore = useSurveyStore()
// 全部选项的前缀名字
const optionNameList = ref([])

const selectedOption = ref('')
const otherText = ref('')
// selectedOptions 变化时更新 optionNameList 和 options
const refreshOptions = (optionsType) => {
  surveyStore.initOptionsValue() // 初始化选项值
  optionNameList.value = props.question.options.map((option, index) =>
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
