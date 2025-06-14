<template>
  <BaseQuestion :question="question">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2 bg-gray-50"></th>
            <th
              v-for="(column, colIndex) in question.columns"
              :key="colIndex"
              class="border p-2 bg-gray-50 text-center"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in question.rows" :key="rowIndex">
            <td class="border p-2">{{ row.label }}</td>
            <td
              v-for="(column, colIndex) in question.columns"
              :key="colIndex"
              class="border p-2 text-center"
            >
              <el-radio
                v-if="question.type === 'single'"
                v-model="matrixValues[rowIndex]"
                :label="column.value"
              />
              <el-checkbox v-else v-model="matrixValues[rowIndex][colIndex]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseQuestion>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseQuestion from './BaseQuestion.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

// 初始化矩阵选择的值
const matrixValues = ref(
  props.question.type === 'single'
    ? Array(props.question.rows.length).fill('')
    : Array(props.question.rows.length)
        .fill(null)
        .map(() => Array(props.question.columns.length).fill(false)),
)
</script>
