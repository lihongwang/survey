import merge from 'lodash/merge'

export const typesEnum = {
  SingleChoice: {
    label: '单选题',
    value: 'SingleChoice',
    icon: 'mdi:radiobox-marked',
  },
  MultipleChoice: {
    label: '多选题',
    value: 'MultipleChoice',
    icon: 'mdi:checkbox-marked-outline',
  },
  FillBlank: {
    label: '填空题',
    value: 'FillBlank',
    icon: 'mdi:form-textbox',
  },
  // TextArea: {
  //   label: '多行文本',
  //   value: 'TextArea',
  //   icon: 'mdi:text-box-outline',
  // },
  Rating: {
    label: '评分题',
    value: 'Rating',
    icon: 'mdi:star-outline',
  },
  MatrixChoice: {
    label: '矩阵单选题',
    value: 'MatrixChoice',
    icon: 'mdi:table-large',
  },
  TrueFalse: {
    label: '判断题',
    value: 'TrueFalse',
    icon: 'mdi:toggle-switch-outline',
  },
  Ranking: {
    label: '排序题',
    value: 'Ranking',
    icon: 'mdi:sort',
  },
  // DatePicker: {
  //   label: '日期选择题',
  //   value: 'DatePicker',
  //   icon: 'mdi:calendar',
  // },
  FileUpload: {
    label: '上传题',
    value: 'FileUpload',
    icon: 'mdi:file-upload-outline',
  },
  Calculation: {
    label: '计算题',
    value: 'Calculation',
    icon: 'mdi:calculator',
  },
  // Paragraph: {
  //   label: '段落说明',
  //   value: 'Paragraph',
  //   icon: 'mdi:text-long',
  // },
  // Group: {
  //   label: '分组题',
  //   value: 'Group',
  //   icon: 'mdi:group',
  // },
  // StemQuestion: {
  //   label: '题干题',
  //   value: 'StemQuestion',
  //   icon: 'mdi:head-question-outline',
  // },
  SubjectiveQuestion: {
    label: '主观题',
    value: 'SubjectiveQuestion',
    icon: 'mdi:text-box-edit-outline',
  },
}

// 基础问题类型
const BaseQuestion = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      title: '题目标题',
      'x-component': 'Select',
      'x-disabled': true,
      'x-decorator': 'FormItem',
      enum: Object.values(typesEnum),
    },
    title: {
      type: 'string',
      title: '题目标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    score: {
      type: 'number',
      title: '题目分数',
      default: 0,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    required: {
      type: 'boolean',
      title: '是否必填',
      default: false,
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
    },

    description: {
      type: 'string',
      title: '题目描述',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
    },
  },
}

// 答案类型
const AnswerBase = {
  type: 'object',
  properties: {
    // 答案相关
    haveCorrect: {
      type: 'boolean',
      title: '是否有正确答案',
      default: false,
      enum: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      'x-component': 'Radio.Group',
      'x-decorator': 'FormItem',
    },
    answer: {
      type: 'string',
      title: '正确答案',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
      'x-visible': false, // 默认隐藏
      'x-reactions': [
        {
          dependencies: ['.haveCorrect'],
          fulfill: {
            state: {
              visible: '{{$deps[0] === true}}',
            },
          },
        },
      ],
    },
    analysis: {
      type: 'string',
      title: '正确答案解析',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
      'x-visible': false, // 默认隐藏
      'x-reactions': [
        {
          dependencies: ['.haveCorrect'],
          fulfill: {
            state: {
              visible: '{{$deps[0] === true}}',
            },
          },
        },
      ],
    },
  },
}
// 选择题基类
const ChoiceBase = {
  properties: {
    layout: {
      type: 'string',
      title: '布局方式',
      enum: [
        { label: '垂直排列', value: 'vertical' },
        { label: '水平排列', value: 'horizontal' },
      ],
      default: 'vertical',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
    },

    options: {
      type: 'array',
      title: '选项',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'void',
            'x-component': 'ArrayItems.Item',
            properties: {
              grid: {
                type: 'void',
                'x-component-props': {
                  isCenter: true,
                  minColumns: 2,
                  maxColumns: 2,
                  gridSpan: 2,
                  rowGap: 0,
                  columnGap: 100,
                },
                'x-component': 'FormGrid',
                properties: {
                  // 选项值没必要开放给用户
                  // value: {
                  //   type: 'string',
                  //   'x-decorator': 'FormItem',
                  //   'x-component': 'Input',
                  //   'x-component-props': {
                  //     placeholder: '选项值',
                  //   },
                  // },
                  label: {
                    type: 'string',
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: '选项文本',
                    },
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加选项',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
    optionsType: {
      type: 'array',
      title: '选项类别',
      default: 1,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: '数字', value: 1 },
        { label: '英文字母', value: 2 },
        { label: '罗马数字', value: 3 },
      ],
      'x-reactions': [],
    },
  },
}

// 文本输入基类
const TextInputBase = {
  properties: {
    placeholder: {
      type: 'string',
      title: '提示文本',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    minLength: {
      type: 'number',
      title: '最小长度',
      default: 0,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    maxLength: {
      type: 'number',
      title: '最大长度',
      default: 0,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      description: '0表示不限制',
    },
  },
}

// 考试题基类
const ExamQuestionBase = {
  properties: {
    stem: {
      type: 'string',
      title: '题干内容',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
    },
    difficulty: {
      type: 'string',
      title: '难度等级',
      enum: [
        { label: '简单', value: 'easy' },
        { label: '中等', value: 'medium' },
        { label: '困难', value: 'hard' },
      ],
      default: 'medium',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
    },
    score: {
      type: 'number',
      title: '分值',
      default: 1,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    analysis: {
      type: 'string',
      title: '解析',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
    },
    tags: {
      type: 'array',
      title: '标签',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        mode: 'tags',
      },
    },
  },
}

// 数组选项基类
const ArrayItemsBase = {
  properties: {
    items: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'void',
            'x-component': 'ArrayItems.Item',
            properties: {
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}

// 数组表格基类
const ArrayTableBase = {
  properties: {
    array: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      items: {
        type: 'object',
        properties: {
          column1: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 80,
              title: 'Index',
              align: 'center',
            },
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
              },
            },
          },
          column2: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: 'A1' },
            properties: {
              a1: {
                type: 'string',
                'x-decorator': 'Editable',
                'x-component': 'Input',
              },
            },
          },
          column3: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: 'A2' },
            properties: {
              a2: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          column4: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: 'A3' },
            properties: {
              a3: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          column5: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: 'Operations',
              prop: 'operations',
              width: 200,
              fixed: 'right',
            },
            properties: {
              item: {
                type: 'void',
                'x-component': 'FormItem',
                properties: {
                  remove: {
                    type: 'void',
                    'x-component': 'ArrayTable.Remove',
                  },
                  moveDown: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveDown',
                  },
                  moveUp: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveUp',
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayTable.Addition',
          title: '添加条目',
        },
      },
    },
  },
}

// SingleChoice (单选题)
const SingleChoiceSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    ...ChoiceBase.properties,
    // 正确答案(单选)
    answer: {
      type: 'array',
      title: '正确答案(单选)',
      default: [],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [],
      'x-reactions': [
        {
          dependencies: ['.haveCorrect'],
          fulfill: {
            state: {
              visible: '{{$deps[0] === true}}',
            },
          },
        },
      ],
    },
    hasOther: {
      type: 'boolean',
      title: '包含其他选项',
      default: false,
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
    },
    defaultValue: {
      type: 'string',
      title: '默认值',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
  },
}

// MultipleChoice (多选题)
const MultipleChoiceSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    ...ChoiceBase.properties,
    // 正确答案(多选)
    answer: {
      type: 'array',
      title: '正确答案(多选)',
      default: [],
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      enum: [],
      'x-reactions': [
        {
          dependencies: ['.haveCorrect'],
          fulfill: {
            state: {
              visible: '{{$deps[0] === true}}',
            },
          },
        },
      ],
    },
    hasOther: {
      type: 'boolean',
      title: '包含其他选项',
      default: false,
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
    },
    minSelect: {
      type: 'number',
      title: '最少选择数量',
      default: 0,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    maxSelect: {
      type: 'number',
      title: '最多选择数量',
      default: 0,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      description: '0表示不限制',
    },
    defaultValue: {
      type: 'array',
      title: '默认值',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      'x-decorator': 'FormItem',
    },
  },
}

// FillBlank (填空题)
const FillBlankSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    ...TextInputBase.properties,

    regex: {
      type: 'string',
      title: '校验正则',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    defaultValue: {
      type: 'string',
      title: '默认值',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
  },
}

// TextArea (多行文本)
const TextAreaSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    ...TextInputBase.properties,
    rows: {
      type: 'number',
      title: '行数',
      default: 4,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    defaultValue: {
      type: 'string',
      title: '默认值',
      'x-component': 'Input.Textarea',
      'x-decorator': 'FormItem',
    },
  },
}

// Rating (评分题)
const RatingSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    maxRating: {
      type: 'number',
      title: '最大分值',
      default: 5,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    allowHalf: {
      type: 'boolean',
      title: '允许半星',
      default: false,
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
    },
    defaultValue: {
      type: 'number',
      title: '默认值',
      default: 0,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
  },
}

// MatrixChoice (矩阵选择题)
const MatrixChoiceSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    type: {
      type: 'string',
      title: '矩阵类型',
      enum: [
        { label: '单选', value: 'single' },
        { label: '多选', value: 'multiple' },
      ],
      default: 'single',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
    },
    rows: {
      type: 'array',
      title: '行标题',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'void',
            'x-component': 'ArrayItems.Item',
            properties: {
              value: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '行值',
                },
              },
              label: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '行标题',
                },
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加行',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
    columns: {
      type: 'array',
      title: '列选项',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'void',
            'x-component': 'ArrayItems.Item',
            properties: {
              value: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '列值',
                },
              },
              label: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '列标题',
                },
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加列',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}

// TrueFalse (判断题)
const TrueFalseSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    answer: {
      type: 'array',
      title: '正确答案',
      default: [],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: '正确', value: 1 },
        { label: '错误', value: 2 },
      ],
      'x-reactions': [
        {
          dependencies: ['.haveCorrect'],
          fulfill: {
            state: {
              visible: '{{$deps[0] === true}}',
            },
          },
        },
      ],
    },
    trueLabel: {
      type: 'string',
      title: '正确选项文本',
      default: '正确',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    falseLabel: {
      type: 'string',
      title: '错误选项文本',
      default: '错误',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    defaultValue: {
      type: 'string',
      title: '默认值',
      enum: [
        { label: '正确', value: 'true' },
        { label: '错误', value: 'false' },
      ],
      'x-component': 'Select',
      'x-decorator': 'FormItem',
    },
  },
}

// Ranking (排序题)
const RankingSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    options: {
      type: 'array',
      title: '排序选项',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'void',
            'x-component': 'ArrayItems.Item',
            properties: {
              // value: {
              //   type: 'string',
              //   'x-decorator': 'FormItem',
              //   'x-component': 'Input',
              //   'x-component-props': {
              //     placeholder: '选项值',
              //   },
              // },
              label: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '选项文本',
                },
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加选项',
          'x-component': 'ArrayItems.Addition',
          'x-component-props': {
            children: '添加选项',
            type: 'primary', // 可选：设置按钮类型
          },
        },
      },
    },
  },
}

// DatePicker (日期选择题)
const DatePickerSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    type: {
      type: 'string',
      title: '日期类型',
      enum: [
        { label: '日期', value: 'date' },
        { label: '日期时间', value: 'datetime' },
        { label: '日期范围', value: 'daterange' },
        { label: '日期时间范围', value: 'datetimerange' },
      ],
      default: 'date',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
    },
    placeholder: {
      type: 'string',
      title: '提示文本',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    format: {
      type: 'string',
      title: '显示格式',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      description: '例如：YYYY-MM-DD',
    },
    valueFormat: {
      type: 'string',
      title: '值格式',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      description: '例如：YYYY-MM-DD',
    },
    defaultValue: {
      type: 'string',
      title: '默认值',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
    },
  },
}

// FileUpload (文件上传题)
const FileUploadSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    uploadUrl: {
      type: 'string',
      title: '上传地址',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      required: true,
    },
    multiple: {
      type: 'boolean',
      title: '多文件上传',
      default: false,
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
    },
    limit: {
      type: 'number',
      title: '最大文件数',
      default: 1,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    accept: {
      type: 'string',
      title: '接受的文件类型',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      description: '例如：.jpg,.png,.pdf',
    },
    tip: {
      type: 'string',
      title: '提示文本',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
    },
  },
}

// Calculation (计算题)
const CalculationSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    formula: {
      type: 'string',
      title: '计算公式',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      description: '使用v0, v1, v2等代表各字段值',
      required: true,
    },
    resultLabel: {
      type: 'string',
      title: '结果标签',
      default: '计算结果',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    decimals: {
      type: 'number',
      title: '小数位数',
      default: 2,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
    },
    fields: {
      type: 'array',
      title: '计算字段',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'void',
            'x-component': 'ArrayItems.Item',
            properties: {
              label: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '字段标签',
                },
              },
              min: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: '最小值',
                },
              },
              max: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: '最大值',
                },
              },
              step: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: '步长',
                },
                default: 1,
              },
              default: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  placeholder: '默认值',
                },
                default: 0,
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加字段',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}

// Paragraph (段落说明)
const ParagraphSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    content: {
      type: 'string',
      title: '段落内容',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
      required: true,
    },
  },
}

// GroupQuestion (分组题)
const GroupQuestionSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '分组标题',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      required: true,
    },
    description: {
      type: 'string',
      title: '分组描述',
      'x-component': 'Input.TextArea',
      'x-decorator': 'FormItem',
    },
    questions: {
      type: 'array',
      title: '子题目',
      'x-decorator': 'FormItem',
      'x-component': 'QuestionItems',
      items: {
        type: 'object',
        'x-component': 'QuestionSelector',
      },
      properties: {
        add: {
          type: 'void',
          title: '添加题目',
          'x-component': 'QuestionItems.Addition',
        },
      },
    },
  },
}

// StemQuestion (题干题目)
const StemQuestionSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    ...ExamQuestionBase.properties,
    attachments: {
      type: 'array',
      title: '附件',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'void',
            'x-component': 'ArrayItems.Item',
            properties: {
              type: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: [
                  { label: '图片', value: 'image' },
                  { label: '文件', value: 'file' },
                ],
                'x-component-props': {
                  placeholder: '附件类型',
                },
              },
              name: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '附件名称',
                },
              },
              url: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '附件URL',
                },
              },
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加附件',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
    questions: {
      type: 'array',
      title: '子题目',
      'x-decorator': 'FormItem',
      'x-component': 'QuestionItems',
      items: {
        type: 'object',
        'x-component': 'QuestionSelector',
      },
      properties: {
        add: {
          type: 'void',
          title: '添加题目',
          'x-component': 'QuestionItems.Addition',
        },
      },
    },
  },
}

// SubjectiveQuestion (主观题)
const SubjectiveQuestionSchema = {
  type: 'object',
  properties: {
    ...BaseQuestion.properties,
    ...AnswerBase.properties,
    ...ExamQuestionBase.properties,
    answerType: {
      type: 'string',
      title: '答题方式',
      enum: [
        { label: '文本', value: 'text' },
        { label: '图片', value: 'image' },
        { label: '文件', value: 'file' },
      ],
      default: 'text',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
    },
    rows: {
      type: 'number',
      title: '文本行数',
      default: 5,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      'x-reactions': {
        dependencies: ['answerType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "text"}}',
          },
        },
      },
    },
    maxLength: {
      type: 'number',
      title: '最大长度',
      default: 0,
      'x-component': 'InputNumber',
      'x-decorator': 'FormItem',
      description: '0表示不限制',
      'x-reactions': {
        dependencies: ['answerType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "text"}}',
          },
        },
      },
    },
    uploadUrl: {
      type: 'string',
      title: '上传地址',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      'x-reactions': {
        dependencies: ['answerType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "image" || $deps[0] === "file"}}',
          },
        },
      },
    },
  },
}

// 导出所有问题类型
export const types = {
  BaseQuestion,
  ChoiceBase,
  TextInputBase,
  ExamQuestionBase,
  ArrayItemsBase,
  SingleChoiceSchema,
  MultipleChoiceSchema,
  FillBlankSchema,
  TextAreaSchema,
  RatingSchema,
  MatrixChoiceSchema,
  TrueFalseSchema,
  RankingSchema,
  DatePickerSchema,
  FileUploadSchema,
  CalculationSchema,
  ParagraphSchema,
  GroupQuestionSchema,
  StemQuestionSchema,
  SubjectiveQuestionSchema,
}
