import { registerValidateFormats, registerValidateLocale } from '@formily/core'

// 验证消息配置
export const validationLocale = {
  zh: {
    pattern: '不合法',
    invalid: '该字段不是一个合法的字段',
    required: '必填',
    number: '该字段不是合法的数字',
    integer: '不是整型数字',
    url: '该字段不是合法的url',
    email: '该字段不是合法的邮箱格式',
    ipv6: '该字段不是合法的ipv6格式',
    ipv4: '该字段不是合法的ipv4格式',
    idcard: '该字段不是合法的身份证格式',
    qq: '该字段不符合QQ号格式',
    phone: '手机号格式不对',
    money: '该字段不是有效货币格式',
    zh: '该字段不是合法的中文字符串',
    date: '该字段不是合法的日期格式',
    zip: '该字段不是合法的邮编格式',
    len: '长度或条目数必须为{{len}}',
    min: '长度或条目数不能小于{{min}}',
    minLength: '长度或条目数不能小于{{minLength}}',
    minItems: '长度或条目数不能小于{{minItems}}',
    max: '长度或条目数不能大于{{max}}',
    maxLength: '长度或条目数不能大于{{maxLength}}',
    maxItems: '长度或条目数不能大于{{maxItems}}',
    maximum: '数值不能大于{{maximum}}',
    exclusiveMaximum: '数值必须小于{{exclusiveMaximum}}',
    minimum: '数值不能小于{{minimum}}',
    exclusiveMinimum: '数值必须大于{{exclusiveMinimum}}',
    whitespace: '不能为纯空白字符串',
    enum: '字段值必须为{{enum}}其中一个',
    const: '字段值必须等于{{const}}',
    multipleOf: '字段值不能被{{multipleOf}}整除',
    maxProperties: '字段属性数量不能大于{{maxProperties}}',
    minProperties: '字段属性数量不能小于{{minProperties}}',
    uniqueItems: '数组元素不唯一',
  },
}

// 验证格式配置
export const validationFormats = {
  password: /(?![0-9]+$)(?![a-zA-Z@$!%*#?&]+$)[0-9A-Za-z@$!%*#?&]{6,}/,
  positive: /^\d+$/,
  negative: /^((-\d+)|(0+))$/,
  float1: /^(-?\d+(\.\d{1,1})?|)$/,
  float2: /^(-?\d+(\.\d{1,2})?|)$/,
  float3: /^(-?\d+(\.\d{1,3})?|)$/,
  float4: /^(-?\d+(\.\d{1,4})?|)$/,
  float5: /^(-?\d+(\.\d{1,5})?|)$/,
  float6: /^(-?\d+(\.\d{1,6})?|)$/,
  float7: /^(-?\d+(\.\d{1,7})?|)$/,
  float8: /^(-?\d+(\.\d{1,8})?|)$/,
  float9: /^(-?\d+(\.\d{1,9})?|)$/,
  float10: /^(-?\d+(\.\d{1,10})?|)$/,
  negative3: /^(-\d+(\.\d{1,3})?|)$/,
}

// 创建验证配置的 composable
export const useFormValidation = () => {
  const setupValidation = () => {
    registerValidateLocale(validationLocale)
    registerValidateFormats(validationFormats)
  }

  // 动态添加验证格式
  const addValidationFormat = (name: string, pattern: RegExp) => {
    registerValidateFormats({ [name]: pattern })
  }

  // 动态添加验证消息
  const addValidationLocale = (locale: string, messages: Record<string, string>) => {
    registerValidateLocale({ [locale]: messages })
  }

  return {
    setupValidation,
    addValidationFormat,
    addValidationLocale,
  }
}
