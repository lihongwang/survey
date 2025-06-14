export const questions = [
  {
    id: 'mc223456',
    name: 'fruits',
    type: 'MultipleChoice',
    attrs: {
      title: '您喜欢的水果有哪些?',
      required: true,
      description: '可多选',
      layout: 'vertical',
      minSelected: 1,
      maxSelected: 3,
      options: [
        { value: 1, label: '苹果' },
        { value: 2, label: '香蕉' },
        { value: 3, label: '橙子' },
        { value: 4, label: '葡萄' },
        { value: 5, label: '西瓜' },
      ],
    },
  },
  {
    id: 'sc223456',
    name: 'gender',
    type: 'SingleChoice',
    attrs: {
      title: '您的性别是?',
      required: true,
      description: '请选择您的性别',
      layout: 'horizontal',
      options: [
        { value: 1, label: '男' },
        { value: 2, label: '女' },
        { value: 3, label: '其他' },
      ],
    },
  },
  {
    id: 'fb223456',
    name: 'name',
    type: 'FillBlank',
    attrs: {
      title: '请输入您的姓名',
      required: true,
      description: '用于证书发放',
      placeholder: '请输入真实姓名',
      minLength: 2,
      maxLength: 20,
      validation: 'none',
    },
  },
  {
    id: 'rat223456',
    name: 'rating',
    type: 'Rating',
    attrs: {
      title: '您对本次活动的评分',
      required: true,
      description: '请对本次活动进行评价',
      maxScore: 5,
      allowHalf: true,
      iconType: 'star',
    },
  },
  // 单选题
  {
    id: 'sng123456',
    name: 'favoriteColor',
    type: 'SingleChoice',
    attrs: {
      title: '您最喜欢的颜色是?',
      required: true,
      description: '请选择一个您最喜欢的颜色',
      layout: 'vertical',
      options: [
        { value: 1, label: '红色' },
        { value: 2, label: '蓝色' },
        { value: 3, label: '绿色' },
        { value: 4, label: '黄色' },
        { value: 5, label: '紫色' },
      ],
      hasOther: true,
    },
  },

  // 多选题
  {
    id: 'mul123456',
    name: 'fruits',
    type: 'MultipleChoice',
    attrs: {
      title: '您喜欢的水果有哪些?',
      required: true,
      description: '可多选',
      layout: 'vertical',
      minSelected: 1,
      maxSelected: 3,
      options: [
        { value: 1, label: '苹果' },
        { value: 2, label: '香蕉' },
        { value: 3, label: '橙子' },
        { value: 4, label: '葡萄' },
        { value: 5, label: '西瓜' },
      ],
      hasOther: false,
    },
  },

  // 填空题
  {
    id: 'fil123456',
    name: 'userName',
    type: 'FillBlank',
    attrs: {
      title: '请输入您的姓名',
      required: true,
      description: '请使用真实姓名',
      placeholder: '请在此输入您的姓名',
      minLength: 2,
      maxLength: 20,
    },
  },

  // 文本区域
  {
    id: 'txt123456',
    name: 'feedback',
    type: 'TextArea',
    attrs: {
      title: '请提供您对产品的反馈意见',
      required: false,
      description: '您的反馈对我们非常重要',
      placeholder: '请详细描述您的使用体验和建议',
      rows: 5,
      maxLength: 500,
    },
  },

  // 评分题
  {
    id: 'rat123456',
    name: 'serviceRating',
    type: 'Rating',
    attrs: {
      title: '请对我们的服务进行评分',
      required: true,
      description: '1分为非常不满意，5分为非常满意',
      maxRating: 5,
      allowHalf: true,
      defaultValue: 0,
    },
  },

  // 矩阵选择题
  {
    id: 'mat123456',
    name: 'productFeedback',
    type: 'MatrixChoice',
    attrs: {
      title: '请对以下产品特性进行评价',
      required: true,
      description: '请为每个特性选择一个评价',
      type: 'single', // 'single' 或 'multiple'
      rows: [
        { value: 1, label: '用户界面' },
        { value: 2, label: '性能表现' },
        { value: 3, label: '可靠性' },
        { value: 4, label: '功能完整性' },
      ],
      columns: [
        { value: 1, label: '非常差' },
        { value: 2, label: '较差' },
        { value: 3, label: '一般' },
        { value: 4, label: '较好' },
        { value: 5, label: '非常好' },
      ],
    },
  },

  // 判断题
  {
    id: 'trf123456',
    name: 'statement',
    type: 'TrueFalse',
    attrs: {
      title: '地球是圆的',
      required: true,
      description: '请判断以上陈述是否正确',
      trueLabel: '正确',
      falseLabel: '错误',
    },
  },

  // 排序题
  {
    id: 'rnk123456',
    name: 'priorityRanking',
    type: 'Ranking',
    attrs: {
      title: '请对以下功能按重要性进行排序',
      required: true,
      description: '拖动选项调整顺序，最重要的放在最前面',
      options: [
        { value: 1, label: '安全性' },
        { value: 2, label: '易用性' },
        { value: 3, label: '性能' },
        { value: 4, label: '价格' },
        { value: 5, label: '客户支持' },
      ],
    },
  },

  // 日期选择器
  {
    id: 'dat123456',
    name: 'birthDate',
    type: 'DatePicker',
    attrs: {
      title: '请选择您的出生日期',
      required: true,
      description: '用于验证您的年龄',
      type: 'date', // 'date', 'datetime', 'daterange'
      placeholder: '选择日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  },

  // 文件上传
  {
    id: 'fil123456',
    name: 'idCard',
    type: 'FileUpload',
    attrs: {
      title: '请上传您的身份证照片',
      required: true,
      description: '支持JPG、PNG格式，文件大小不超过5MB',
      uploadUrl: '/api/upload',
      multiple: false,
      limit: 1,
      accept: '.jpg,.jpeg,.png',
      tip: '请确保照片清晰可见',
    },
  },

  // 计算题
  {
    id: 'cal123456',
    name: 'bmiCalculator',
    type: 'Calculation',
    attrs: {
      title: 'BMI计算器',
      description: '请输入您的身高和体重，系统会自动计算BMI值',
      fields: [
        {
          label: '身高(cm)',
          min: 100,
          max: 250,
          step: 1,
          default: 170,
        },
        {
          label: '体重(kg)',
          min: 30,
          max: 200,
          step: 0.1,
          default: 60,
        },
      ],
      formula: 'v1 / ((v0/100) * (v0/100))',
      resultLabel: 'BMI指数',
      decimals: 1,
    },
  },

  // 段落
  {
    id: 'par123456',
    name: 'instructions',
    type: 'Paragraph',
    attrs: {
      title: '调查说明',
      content:
        "<p>感谢您参与我们的用户调查。本次调查共有10个问题，预计耗时5分钟。</p><p>您的反馈对我们非常重要，我们将根据调查结果改进产品和服务。</p><p><strong>注意：</strong>所有带 <span style='color: red;'>*</span> 的问题为必答题。</p>",
    },
  },

  // 问题组
  {
    id: 'grp123456',
    name: 'personalInfo',
    type: 'Group',
    attrs: {
      title: '个人基本信息',
      description: '请填写您的基本个人信息，我们将严格保密',
      questions: [
        {
          id: 'name123',
          name: 'fullName',
          type: 'FillBlank',
          attrs: {
            title: '姓名',
            required: true,
            placeholder: '请输入您的姓名',
          },
        },
        {
          id: 'gender123',
          name: 'gender',
          type: 'SingleChoice',
          attrs: {
            title: '性别',
            required: true,
            options: [
              { value: 1, label: '男' },
              { value: 2, label: '女' },
              { value: 3, label: '其他' },
            ],
          },
        },
        {
          id: 'age123',
          name: 'age',
          type: 'SingleChoice',
          attrs: {
            title: '年龄段',
            required: true,
            options: [
              { value: 1, label: '18岁以下' },
              { value: 2, label: '18-25岁' },
              { value: 3, label: '26-35岁' },
              { value: 4, label: '36-45岁' },
              { value: 5, label: '45岁以上' },
            ],
          },
        },
      ],
    },
  },

  // 题干题
  {
    id: 'stm123456',
    name: 'mathProblem',
    type: 'StemQuestion',
    attrs: {
      title: '数学应用题',
      required: true,
      stem: "<p>小明有5个苹果，小红有3个苹果。小明给了小红2个苹果，然后小刚又给了小明4个苹果。</p><img src='/images/apples.jpg' alt='苹果示意图'>",
      attachments: [
        {
          type: 'image',
          url: '/images/apples.jpg',
          name: '苹果示意图',
        },
      ],
      questions: [
        {
          id: 'q1_123',
          name: 'question1',
          type: 'FillBlank',
          attrs: {
            title: '现在小明有多少个苹果？',
            required: true,
          },
        },
        {
          id: 'q2_123',
          name: 'question2',
          type: 'FillBlank',
          attrs: {
            title: '现在小红有多少个苹果？',
            required: true,
          },
        },
        {
          id: 'q3_123',
          name: 'question3',
          type: 'SingleChoice',
          attrs: {
            title: '谁的苹果最多？',
            required: true,
            options: [
              { value: 'xiaoming', label: '小明' },
              { value: 'xiaohong', label: '小红' },
              { value: 'xiaogang', label: '小刚' },
              { value: 'same', label: '一样多' },
            ],
          },
        },
      ],
    },
  },

  // 主观题
  {
    id: 'sub123456',
    name: 'essayQuestion',
    type: 'SubjectiveQuestion',
    attrs: {
      title: '请谈谈您对环境保护的看法',
      required: true,
      description: '字数不少于100字，不超过500字',
      answerType: 'text', // 'text', 'image', 'file'
      rows: 8,
      maxLength: 500,
      placeholder: '请在此输入您的看法...',
    },
  },
]
