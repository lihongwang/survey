import { types, typesEnum } from '../questions/type-properties'

import { useSurveyStore } from '../stores/survey'

export const getPanelTitle = (panelType) => {
  const titles = {
    basic: '基本属性',
    validation: '验证规则',
    logic: '逻辑规则',
    styling: '样式设置',
    options: '选项设置',
    format: '格式设置',
    matrix: '矩阵设置',
    formula: '公式设置',
    fields: '字段设置',
    content: '内容设置',
    children: '子题目',
    stem: '题干设置',
    attachments: '附件设置',
    answer: '答题设置',
    exam: '考试设置',
    limits: '数量限制',
    items: '排序项目',
    upload: '上传设置',
    labels: '选项标签',
    display: '显示设置',
    correct: '答案设置',
  }

  return titles[panelType] || '属性设置'
}
// 提取基本属性
const extractBasicProperties = (schema) => {
  const basicProps = {}
  // 提取通用基本属性
  const commonBasicProps = ['title', 'description', 'score', 'required']
  commonBasicProps.forEach((prop) => {
    if (schema.properties[prop]) {
      basicProps[prop] = schema.properties[prop]
    }
  })

  return basicProps
}

// 提取答案属性
const extractCorrectProperties = (schema, questionType, questionId) => {
  const surveyStore = useSurveyStore()
  // 提取通用答案属性
  const commonBasicProps = ['haveCorrect', 'answer', 'analysis']
  const correctProps = {}
  const specialQuestionTypes = ['SingleChoice', 'MultipleChoice']
  commonBasicProps.forEach((prop) => {
    if (schema.properties[prop]) {
      // 给选择类型的题目的answer字段做特殊处理
      if (prop === 'answer' && specialQuestionTypes.includes(questionType)) {
        // 从store中取值
        schema.properties[prop].enum = surveyStore.selectedQuestion.options || []
        // 如果有答案
        if (schema.properties[prop].default) {
          schema.properties[prop].enum.answer = schema.properties[prop].default
        }
      }
      correctProps[prop] = schema.properties[prop]
    }
  })
  return correctProps
}

// 提取验证规则属性
const extractValidationProperties = (schema, questionType) => {
  const validationProps = {}

  // 根据不同题型提取验证属性
  switch (questionType) {
    case 'FillBlank':
    case 'TextArea':
      // 提取文本类验证属性
      ;['minLength', 'maxLength', 'regex'].forEach((prop) => {
        if (schema.properties[prop]) {
          validationProps[prop] = schema.properties[prop]
        }
      })
      break

    case 'MultipleChoice':
      // 提取多选验证属性
      ;['minSelect', 'maxSelect'].forEach((prop) => {
        if (schema.properties[prop]) {
          validationProps[prop] = schema.properties[prop]
        }
      })
      break

    // 其他题型的验证属性...
  }

  return validationProps
}

// 提取选项相关属性
const extractOptionsProperties = (schema) => {
  const optionsProps = {}

  // 提取选项相关属性
  ;['optionsType', 'options', 'layout', 'hasOther'].forEach((prop) => {
    if (schema.properties[prop]) {
      optionsProps[prop] = schema.properties[prop]
    }
  })
  return optionsProps
}

// 提取格式相关属性
const extractFormatProperties = (schema, questionType) => {
  const formatProps = {}

  // 根据不同题型提取格式属性
  switch (questionType) {
    case 'FillBlank':
    case 'TextArea':
      // 提取文本格式属性
      ;['placeholder', 'rows'].forEach((prop) => {
        if (schema.properties[prop]) {
          formatProps[prop] = schema.properties[prop]
        }
      })
      break

    case 'DatePicker':
      // 提取日期格式属性
      ;['format', 'valueFormat', 'placeholder'].forEach((prop) => {
        if (schema.properties[prop]) {
          formatProps[prop] = schema.properties[prop]
        }
      })
      break

    // 其他题型的格式属性...
  }

  return formatProps
}

// 提取矩阵相关属性
const extractMatrixProperties = (schema) => {
  const matrixProps = {}

  // 提取矩阵相关属性
  ;['rows', 'columns', 'type'].forEach((prop) => {
    if (schema.properties[prop]) {
      matrixProps[prop] = schema.properties[prop]
    }
  })

  return matrixProps
}

// 提取计算公式相关属性
const extractFormulaProperties = (schema) => {
  const formulaProps = {}

  // 提取公式相关属性
  ;['formula', 'resultLabel', 'decimals'].forEach((prop) => {
    if (schema.properties[prop]) {
      formulaProps[prop] = schema.properties[prop]
    }
  })

  return formulaProps
}

// 提取计算字段相关属性
const extractFieldsProperties = (schema) => {
  const fieldsProps = {}

  if (schema.properties.fields) {
    fieldsProps.fields = schema.properties.fields
  }

  return fieldsProps
}

// 提取内容相关属性
const extractContentProperties = (schema) => {
  const contentProps = {}

  if (schema.properties.content) {
    contentProps.content = schema.properties.content
  }

  return contentProps
}

// 提取子题目相关属性
const extractChildrenProperties = (schema) => {
  const childrenProps = {}

  if (schema.properties.questions) {
    childrenProps.questions = schema.properties.questions
  }

  return childrenProps
}

// 提取题干相关属性
const extractStemProperties = (schema) => {
  const stemProps = {}

  if (schema.properties.stem) {
    stemProps.stem = schema.properties.stem
  }

  return stemProps
}

// 提取附件相关属性
const extractAttachmentsProperties = (schema) => {
  const attachmentsProps = {}

  if (schema.properties.attachments) {
    attachmentsProps.attachments = schema.properties.attachments
  }

  return attachmentsProps
}

// 提取答题相关属性
const extractAnswerProperties = (schema) => {
  const answerProps = {}

  ;['answerType', 'rows', 'maxLength', 'uploadUrl'].forEach((prop) => {
    if (schema.properties[prop]) {
      answerProps[prop] = schema.properties[prop]
    }
  })

  return answerProps
}

// 提取考试相关属性
const extractExamProperties = (schema) => {
  const examProps = {}

  ;['difficulty', 'score', 'analysis', 'tags'].forEach((prop) => {
    if (schema.properties[prop]) {
      examProps[prop] = schema.properties[prop]
    }
  })

  return examProps
}

// 提取数量限制相关属性
const extractLimitsProperties = (schema) => {
  const limitsProps = {}

  ;['minSelect', 'maxSelect'].forEach((prop) => {
    if (schema.properties[prop]) {
      limitsProps[prop] = schema.properties[prop]
    }
  })

  return limitsProps
}

// 提取排序项目相关属性
const extractItemsProperties = (schema) => {
  const itemsProps = {}

  if (schema.properties.options) {
    itemsProps.options = schema.properties.options
  }

  return itemsProps
}

// 提取上传设置相关属性
const extractUploadProperties = (schema) => {
  const uploadProps = {}

  ;['uploadUrl', 'multiple', 'limit', 'accept', 'tip'].forEach((prop) => {
    if (schema.properties[prop]) {
      uploadProps[prop] = schema.properties[prop]
    }
  })

  return uploadProps
}

// 提取选项标签相关属性
const extractLabelsProperties = (schema) => {
  const labelsProps = {}

  ;['trueLabel', 'falseLabel'].forEach((prop) => {
    if (schema.properties[prop]) {
      labelsProps[prop] = schema.properties[prop]
    }
  })

  return labelsProps
}

// 提取显示设置相关属性
const extractDisplayProperties = (schema) => {
  const displayProps = {}

  ;['maxRating', 'allowHalf'].forEach((prop) => {
    if (schema.properties[prop]) {
      displayProps[prop] = schema.properties[prop]
    }
  })

  return displayProps
}

// 提取逻辑规则属性（可能需要从其他地方获取）
const extractLogicProperties = () => {
  // 逻辑规则属性可能需要单独定义
  return {
    logicRules: {
      type: 'array',
      title: '逻辑规则',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        mode: 'AND',
      },
    },
  }
}

// 提取样式属性
const extractStylingProperties = () => {
  // 样式属性可能需要单独定义
  return {
    style: {
      type: 'object',
      title: '样式设置',
      'x-decorator': 'FormItem',
      'x-component': 'StyleEditor',
      properties: {
        width: {
          type: 'string',
          title: '宽度',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        background: {
          type: 'string',
          title: '背景色',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        fontColor: {
          type: 'string',
          title: '文字颜色',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    },
  }
}
// 根据当前面板类型和问题类型获取对应的属性配置
export const getPropertiesForCurrentPanel = (selectedQuestion) => {
  const questionType = selectedQuestion?.type
  if (!questionType || !types[`${questionType}Schema`]) {
    return {}
  }
  // 获取当前问题类型的schema
  const schema = types[`${questionType}Schema`]
  const activePanelType = selectedQuestion.selectedAttrPanelType || 'basic'
  // 根据不同的面板类型提取相应的属性
  switch (activePanelType) {
    case 'basic':
      return extractBasicProperties(schema)

    case 'correct':
      return extractCorrectProperties(schema, questionType, selectedQuestion.id)

    case 'validation':
      return extractValidationProperties(schema, questionType)

    case 'logic':
      return extractLogicProperties()

    case 'styling':
      return extractStylingProperties()

    case 'options':
      return extractOptionsProperties(schema)

    case 'format':
      return extractFormatProperties(schema, questionType)

    case 'matrix':
      return extractMatrixProperties(schema)

    case 'formula':
      return extractFormulaProperties(schema)

    case 'fields':
      return extractFieldsProperties(schema)

    case 'content':
      return extractContentProperties(schema)

    case 'children':
      return extractChildrenProperties(schema)

    case 'stem':
      return extractStemProperties(schema)

    case 'attachments':
      return extractAttachmentsProperties(schema)

    case 'answer':
      return extractAnswerProperties(schema)

    case 'exam':
      return extractExamProperties(schema)

    case 'limits':
      return extractLimitsProperties(schema)

    case 'items':
      return extractItemsProperties(schema)

    case 'upload':
      return extractUploadProperties(schema)

    case 'labels':
      return extractLabelsProperties(schema)

    case 'display':
      return extractDisplayProperties(schema)

    default:
      return {}
  }
}
export const basePanelTypes = [
  { key: 'basic', icon: 'material-symbols:settings', label: '基本属性' },
  { key: 'correct', icon: 'ic:outline-check-circle', label: '答案设置' },
  {
    key: 'validation',
    icon: 'material-symbols:check-circle',
    label: '验证规则',
  },
  { key: 'logic', icon: 'tabler:git-branch', label: '逻辑规则' },
  { key: 'styling', icon: 'material-symbols:palette', label: '样式设置' },
]

// 扩展面板类型配置
export const extendedPanelTypes = {
  SingleChoice: [
    {
      key: 'options',
      icon: 'material-symbols:format-list-bulleted',
      label: '选项设置',
    },
  ],
  MultipleChoice: [
    {
      key: 'options',
      icon: 'material-symbols:format-list-bulleted',
      label: '选项设置',
    },
    { key: 'limits', icon: 'mdi:counter', label: '数量限制' },
  ],
  FillBlank: [{ key: 'format', icon: 'material-symbols:text-format', label: '格式设置' }],
  TextArea: [{ key: 'format', icon: 'material-symbols:text-format', label: '格式设置' }],
  Rating: [
    {
      key: 'display',
      icon: 'material-symbols:star-settings-outline',
      label: '显示设置',
    },
  ],
  MatrixChoice: [{ key: 'matrix', icon: 'mdi:table', label: '矩阵设置' }],
  TrueFalse: [
    {
      key: 'labels',
      icon: 'material-symbols:label-outline',
      label: '选项标签',
    },
  ],
  Ranking: [{ key: 'items', icon: 'material-symbols:sort', label: '排序项目' }],
  DatePicker: [
    {
      key: 'format',
      icon: 'material-symbols:calendar-month',
      label: '日期格式',
    },
  ],
  FileUpload: [
    {
      key: 'upload',
      icon: 'material-symbols:upload-file-outline',
      label: '上传设置',
    },
  ],
  Calculation: [
    { key: 'formula', icon: 'mdi:math-integral-box', label: '公式设置' },
    { key: 'fields', icon: 'material-symbols:text-fields', label: '字段设置' },
  ],
  Paragraph: [{ key: 'content', icon: 'mdi:text-box', label: '内容设置' }],
  Group: [
    {
      key: 'children',
      icon: 'material-symbols:folder-outline',
      label: '子题目',
    },
  ],
  StemQuestion: [
    { key: 'stem', icon: 'material-symbols:help-outline', label: '题干设置' },
    {
      key: 'attachments',
      icon: 'material-symbols:attachment',
      label: '附件设置',
    },
    {
      key: 'children',
      icon: 'material-symbols:folder-outline',
      label: '子题目',
    },
  ],
  SubjectiveQuestion: [
    {
      key: 'answer',
      icon: 'material-symbols:edit-note-outline',
      label: '答题设置',
    },
    { key: 'exam', icon: 'material-symbols:school-outline', label: '考试设置' },
  ],
}
