<template>
  <div class="form-wrapper">
    <FormProvider :form="form">
      <SchemaField :schema="schema" :scope="formScope" />
      <slot></slot>
    </FormProvider>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { createForm, IFormProps } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/vue'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useFormComponents } from '@/hooks/useFormComponents'
import { useFormEffects, FormEffectsConfig } from '@/hooks/useFormEffects'
import { useFormSchema, SchemaConfig } from '@/hooks/useFormSchema'

export interface FormWrapperProps extends FormEffectsConfig, SchemaConfig {
  formOpts?: IFormProps
  components?: Record<string, any>
  scope?: Record<string, any>
  initialValues?: Record<string, any>
}

const props = withDefaults(defineProps<FormWrapperProps>(), {
  handleFormValuesChange: () => ({}),
  doLayout: true,
  properties: () => ({}),
  scope: () => ({}),
  formOpts: () => ({}),
  components: () => ({}),
  layout: () => ({}),
  initialValues: () => ({}),
})

// 初始化验证
const { setupValidation } = useFormValidation()
setupValidation()

// 创建组件配置
const { createComponentsConfig, createFormScope } = useFormComponents()
const formScope = computed(() => createFormScope(props.scope))

// 创建表单效果
const { createFormEffects } = useFormEffects(props)

// 响应式创建表单
const form = computed(() => {
  return createForm({
    validateFirst: true,
    initialValues: props.initialValues,
    effects: createFormEffects(form),
    ...props.formOpts,
  })
})

// 创建 Schema
const { schema } = useFormSchema(props, form)

// 创建 SchemaField
const { SchemaField } = createSchemaField({
  components: createComponentsConfig(props.components),
})

// 监听初始值变化，自动同步到表单
watchEffect(() => {
  if (form.value && props.initialValues) {
    // 只在初始值真正改变时才设置，避免不必要的更新
    const currentValues = form.value.getFormState().initialValues
    if (JSON.stringify(currentValues) !== JSON.stringify(props.initialValues)) {
      form.value.setInitialValues(props.initialValues, 'overwrite')
    }
  }
})

// 暴露给父组件的 API
defineExpose({
  form,
  updateValues: (values: Record<string, any>) => {
    form.value?.setValues(values)
  },
  resetForm: () => {
    form.value?.reset()
  },
  validateForm: () => {
    return form.value?.validate()
  },
  submitForm: () => {
    return form.value?.submit()
  },
})
</script>

<style lang="scss">
.le-center-size-form {
  --form-height: 65vh;
  --border-color: rgb(235, 238, 245);
  --padding: 10px;

  height: var(--form-height);
  overflow: auto;
  display: flex;
  flex-direction: column;

  & > div:first-of-type {
    flex: 1;
    min-height: 0;
    overflow: auto;
    display: flex !important;
    flex-direction: column;

    .formily-element-plus-form-default {
      height: 100%;
    }

    .step-form {
      height: 100%;
      display: flex;
      flex-direction: column;

      & > div:last-of-type {
        flex: 1;
        min-height: 0;
        overflow: auto;
      }
    }
  }

  .footer-btns {
    border-top: 1px solid var(--border-color);
    padding-top: var(--padding);
    gap: var(--padding);
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style lang="scss" scoped>
.form-wrapper {
  :deep(.form-layout) {
    height: 100%;
  }

  :deep(.full-height-item) {
    height: 100%;

    .formily-element-plus-form-item-control,
    .formily-element-plus-form-item-control-content,
    .formily-element-plus-form-item-control-content-component {
      height: 100%;
    }
  }
}
</style>
