<template>
  <FormWrapper
    :properties="formProperties"
    :layout="formLayout"
    :initial-values="initialValues"
    :handle-form-values-change="handleFormChange"
    :change-fields="changeFields"
    :relation-fields="relationFields"
    @submit="handleSubmit"
    ref="formRef"
  >
    <template #default>
      <div class="footer-btns">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </template>
  </FormWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormWrapper from './form-wrapper.vue';

const formRef = ref();
const initialValues = ref({});
const formProperties = ref({});
const formLayout = ref({});

const handleFormChange = (form: any) => {
  console.log('表单值变化:', form.values);
};

const handleSubmit = (form: any) => {
  console.log('表单提交:', form.values);
};

const resetForm = () => {
  formRef.value?.resetForm();
};

const submitForm = () => {
  formRef.value?.submitForm();
};
</script>
