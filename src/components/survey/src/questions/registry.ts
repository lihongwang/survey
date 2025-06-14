import merge from 'lodash/merge'
import { types } from './type-properties'

// 问题类型注册表
const questionRegistry = new Map()

// 注册基础题型
Object.entries(types).forEach(([typeName, schema]) => {
  questionRegistry.set(typeName, schema)
})

// 注册新的题型
function registerQuestionType(typeName, schema, baseTypes = []) {
  // 从基类继承
  let mergedSchema = {}

  if (baseTypes.length > 0) {
    baseTypes.forEach((baseType) => {
      const baseSchema = questionRegistry.get(baseType)
      if (baseSchema) {
        mergedSchema = merge({}, mergedSchema, baseSchema)
      } else {
        console.warn(`Base type ${baseType} not found in registry`)
      }
    })
  }

  // 合并自定义属性
  mergedSchema = merge({}, mergedSchema, schema)

  // 注册到注册表
  questionRegistry.set(typeName, mergedSchema)

  return mergedSchema
}

// 获取题型定义
function getQuestionType(typeName) {
  return questionRegistry.get(typeName)
}

export { registerQuestionType, getQuestionType, questionRegistry }

/*
import { registerQuestionType, getQuestionType } from './question/registry';

// 注册一个新的题型
registerQuestionType('AdvancedSingleChoice', {
  "properties": {
    "randomizeOptions": {
      "type": "boolean",
      "title": "随机排序选项",
      "default": false,
      "x-component": "Switch",
      "x-decorator": "FormItem"
    }
  }
}, ['SingleChoice']);

// 获取注册的题型
const advancedSingleChoiceSchema = getQuestionType('AdvancedSingleChoice');
*/
