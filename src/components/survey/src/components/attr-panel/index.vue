<template>
  <div class="attr-panel p-4 flex flex-col">
    <Header header="题目设置">
      <template #right-content>
        <div class="attr-panel-info flex gap-1 items-center text-gray-400 text-sm">
          <component :is="attrPanel.icon" />
          <span class="">{{ attrPanel.title }}</span>
        </div>
      </template>
    </Header>
    <div class="attr-setting flex-1 min-h-0 overflow-auto" v-if="question">
      <!-- 每个题目的各项设置表单 -->
      <Form
        :properties="properties"
        :setInitialValues="setInitialValues"
        :key="key"
        @formChange="updateQuestion"
      />
    </div>
    <div class="empty" v-else>请选择题目</div>
  </div>
</template>

<script setup>
import { createIconifyIcon } from '@/utils/create-icon'
import { ref, watch } from 'vue'
import Header from '../common/header.vue'
import Form from './form.vue'
import { useSurveyStore } from '../../stores'
import {
  getPanelTitle,
  getPropertiesForCurrentPanel,
  basePanelTypes,
  extendedPanelTypes,
} from '../../attrs'
const surveyStore = useSurveyStore()
defineProps({
  question: Object,
})
const properties = ref()
const initValues = ref({})
const key = ref('')
const attrPanel = ref('')
watch(
  () => surveyStore.selectedQuestion?.selectedAttrPanelType,
  (type) => {
    if (!type) return
    const question = surveyStore.selectedQuestion
    // 这里是值引用，属性变更时会自动同步数据
    initValues.value = question.attrs
    properties.value = getPropertiesForCurrentPanel(question)
    key.value = question.id + question.selectedAttrPanelType
    const additionalTypes = extendedPanelTypes[question.type] || []
    const panelTypes = [...basePanelTypes, ...additionalTypes]
    attrPanel.value = {
      title: getPanelTitle(type),
      icon: createIconifyIcon(panelTypes.find((item) => item.key === type)?.icon),
    }
  },
  { immediate: true, deep: true },
)
const setInitialValues = () => {
  return initValues.value
}
const updateQuestion = (values) => {
  // if (surveyStore.selectedQuestion) {
  //   // 更新 store 中的数据
  //   surveyStore.updateSelectedQuestion({
  //     ...surveyStore.selectedQuestion,
  //     attrs: { ...values },
  //   });
  // }
}
</script>
<style>
.attr-panel {
  /* formily中ArryItem的样式 */
  .array-item {
    margin: 0;
    .array-item-container {
      border-radius: 0;
    }
    .le-grid-form {
      grid-template-columns: none !important;
      width: 150px !important;
    }
    .array-item-top {
      margin: 0px;
    }
    .formily-element-plus-array-base-index {
      margin-left: 10px;
    }
    .recursion-field {
      position: absolute;
      z-index: 0;
      left: 80px;
      top: 12px;
      .formily-element-plus-form-item-feedback-layout-loose {
        margin-bottom: 0px;
      }
    }
  }
  .array-item:not(:first-child) {
    .array-item-container {
      border-top: none;
    }
  }
  .formily-element-plus-array-base-addition {
    margin-top: 20px;
  }
  /* 删除按钮 */
  .formily-element-plus-array-base-remove {
    color: #f56c6c;
    background-color: #fef0f0;
    border-color: #f56c6c;
    &:hover {
      color: #f56c6c;
      background-color: #fde2e2;
      border: #f56c6c;
    }
  }
}
</style>
