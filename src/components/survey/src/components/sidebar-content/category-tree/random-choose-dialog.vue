<template>
  <el-dialog v-model="computedVisible" title="随机选题设置" width="30%">
    <div class="random-selection-form">
      <el-form label-position="top">
        <el-form-item label="选择题型">
          <el-checkbox-group v-model="randomSelectionTypes">
            <el-checkbox
              v-for="type in questionTypes"
              :label="type.label"
              :value="type.value"
              :key="type"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择数量">
          <el-input-number v-model="randomSelectionCount" :min="1" :max="50" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="computedVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="applyRandomSelection">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSurveyStore } from '../../../stores'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const surveyStore = useSurveyStore()
const questionTypes = surveyStore.allQuestionTypes
const emit = defineEmits(['update:visible', 'applyRandomSelection'])
const randomSelectionCount = ref(5)
const randomSelectionTypes = ref(['SingleChoice', 'MultipleChoice'])
// 计算属性：用于实现双向绑定
const computedVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})
const applyRandomSelection = () => {
  emit('applyRandomSelection', {
    randomSelectionCount: randomSelectionCount.value,
    randomSelectionTypes: randomSelectionTypes.value,
  })
}
</script>

<style></style>
