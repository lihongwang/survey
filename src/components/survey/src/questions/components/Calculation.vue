<template>
  <BaseQuestion :question="question">
    <div class="space-y-4 max-w-lg">
      <div class="flex flex-wrap gap-4">
        <template v-for="(field, index) in question.fields" :key="index">
          <div class="flex flex-col">
            <label class="mb-1 text-sm">{{ field.label }}</label>
            <el-input-number
              v-model="fieldValues[index]"
              :min="field.min"
              :max="field.max"
              :step="field.step || 1"
              @change="calculate"
            />
          </div>
        </template>
      </div>

      <div class="p-3 bg-gray-50 rounded-md">
        <div class="flex justify-between">
          <span class="font-medium">{{ question.resultLabel || '计算结果' }}:</span>
          <span class="font-bold">{{ calculationResult }}</span>
        </div>
      </div>
    </div>
  </BaseQuestion>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseQuestion from './BaseQuestion.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

const fieldValues = ref(Array(props.question.fields.length).fill(0))
const calculationResult = ref(0)

const calculate = () => {
  try {
    // 使用 Function 构造函数创建动态计算函数
    const paramNames = props.question.fields.map((_, i) => `v${i}`)
    const calcFunction = new Function(...paramNames, `return ${props.question.formula}`)

    calculationResult.value = calcFunction(...fieldValues.value)

    // 格式化结果
    if (props.question.decimals !== undefined) {
      calculationResult.value = Number(calculationResult.value.toFixed(props.question.decimals))
    }
  } catch (e) {
    console.error('计算错误:', e)
    calculationResult.value = 'Error'
  }
}

onMounted(() => {
  // 初始化默认值
  props.question.fields.forEach((field, index) => {
    fieldValues.value[index] = field.default || 0
  })
  calculate()
})
</script>
