import { doProperties, fillLabelWidth } from '@/utils'

import { computed } from 'vue'

export interface SchemaConfig {
  properties: Record<string, any>
  layout?: Record<string, any>
  doLayout?: boolean
  labelWidth?: string | number
  formatProperties?: (
    properties: Record<string, any>,
    context: { form: any; doProperties: any },
  ) => Record<string, any>
}

export const useFormSchema = (config: SchemaConfig, form: Ref<any>) => {
  // 处理属性
  const processedProperties = computed(() => {
    if (config.formatProperties && form.value) {
      return config.formatProperties(config.properties, {
        form: form.value,
        doProperties,
      })
    }

    if (config.labelWidth) {
      return fillLabelWidth(config.properties, config.labelWidth)
    }

    return config.properties
  })

  // 创建 schema
  const schema = computed(() => {
    const properties = processedProperties.value

    return {
      type: 'object',
      properties: config.doLayout
        ? {
            layout: {
              ...config.layout,
              'x-component-props': {
                labelAlign: 'left',
                ...(config.layout?.['x-component-props'] || {}),
              },
              properties,
            },
          }
        : properties,
    }
  })

  return {
    schema,
    processedProperties,
  }
}
