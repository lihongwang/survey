import {
  onFieldInputValueChange,
  onFieldValueChange,
  onFormInit,
  onFormInputChange,
  onFormMount,
  onFormSubmit,
  onFormSubmitEnd,
  onFormSubmitStart,
} from '@formily/core'

import { debounce } from 'lodash-es'
import { onUnmounted } from 'vue'

export interface FormEffectsConfig {
  handleFormValuesChange?: (form: any) => void
  onSubmit?: (form: any) => void
  onSubmitStart?: (form: any) => void
  onSubmitEnd?: (form: any) => void
  onInit?: (form: any) => void
  handleFormMount?: (form: any) => void
  changeFields?: Record<string, { onChange: (field: any, form: any) => void }>
  relationFields?: Record<string, { effects: any }>
  changeValueFields?: Record<string, { onChange: (field: any, form: any) => void }>
  relationValueFields?: Record<string, { effects: any }>
}

export const useFormEffects = (config: FormEffectsConfig) => {
  // 防抖处理器管理
  const debouncedHandlers = new Map<string, any>()

  const createDebouncedHandler = (key: string, handler: any, delay = 300) => {
    // 清理旧的处理器
    if (debouncedHandlers.has(key)) {
      debouncedHandlers.get(key).cancel()
    }

    const debouncedFn = debounce(handler, delay)
    debouncedHandlers.set(key, debouncedFn)
    return debouncedFn
  }

  // 设置表单输入变化效果
  const setupFormInputEffects = () => {
    if (config.handleFormValuesChange) {
      const debouncedFormChange = createDebouncedHandler(
        'formChange',
        config.handleFormValuesChange,
      )
      onFormInputChange(debouncedFormChange)
    }
  }

  // 设置字段输入变化效果
  const setupFieldInputEffects = () => {
    Object.entries(config.changeFields || {}).forEach(([key, fieldConfig]) => {
      const debouncedHandler = createDebouncedHandler(`fieldInput-${key}`, fieldConfig.onChange)
      onFieldInputValueChange(key, debouncedHandler)
    })
  }

  // 设置字段值变化效果
  const setupFieldValueEffects = () => {
    Object.entries(config.changeValueFields || {}).forEach(([key, fieldConfig]) => {
      const debouncedHandler = createDebouncedHandler(`fieldValue-${key}`, fieldConfig.onChange)
      onFieldValueChange(key, debouncedHandler)
    })
  }

  // 设置关联字段效果（输入变化）
  const setupRelationInputEffects = (form: Ref<any>) => {
    Object.entries(config.relationFields || {}).forEach(([key, relationConfig]) => {
      const debouncedHandler = createDebouncedHandler(`relationInput-${key}`, () => {
        if (form.value) {
          form.value.setValues(relationConfig.effects)
        }
      })
      onFieldInputValueChange(key, debouncedHandler)
    })
  }

  // 设置关联字段效果（值变化）
  const setupRelationValueEffects = (form: Ref<any>) => {
    Object.entries(config.relationValueFields || {}).forEach(([key, relationConfig]) => {
      const debouncedHandler = createDebouncedHandler(`relationValue-${key}`, () => {
        if (form.value) {
          form.value.setValues(relationConfig.effects)
        }
      })
      onFieldValueChange(key, debouncedHandler)
    })
  }

  // 设置生命周期效果
  const setupLifecycleEffects = () => {
    if (config.onInit) {
      onFormInit(config.onInit)
    }
    if (config.handleFormMount) {
      onFormMount(config.handleFormMount)
    }
    if (config.onSubmitStart) {
      onFormSubmitStart(config.onSubmitStart)
    }
    if (config.onSubmit) {
      onFormSubmit(config.onSubmit)
    }
    if (config.onSubmitEnd) {
      onFormSubmitEnd(config.onSubmitEnd)
    }
  }

  // 创建表单效果函数
  const createFormEffects = (form: Ref<any>) => {
    return () => {
      setupFormInputEffects()
      setupFieldInputEffects()
      setupFieldValueEffects()
      setupRelationInputEffects(form)
      setupRelationValueEffects(form)
      setupLifecycleEffects()
    }
  }

  // 清理资源
  const cleanup = () => {
    debouncedHandlers.forEach((handler) => {
      if (handler.cancel) {
        handler.cancel()
      }
    })
    debouncedHandlers.clear()
  }

  // 组件卸载时清理
  onUnmounted(cleanup)

  return {
    createFormEffects,
    cleanup,
  }
}
