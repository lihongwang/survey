// 管理试卷、页面、问题的核心数据

import { createIconifyIcon } from '@/utils/create-icon'
import { defineStore } from 'pinia'
import { typesEnum } from '../questions/type-properties'
import { v4 as uuidv4 } from 'uuid'

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    // 当前活动试卷ID
    currentSurveyId: null,

    // 试卷列表
    surveys: [],

    // 问题类型定义
    questionTypes: Object.values(typesEnum).map((type) => {
      return {
        ...type,
        icon: createIconifyIcon(type.icon),
      }
    }),
    // 当前选中的页面ID
    selectedPageId: null,
    // 当前选中的问题ID
    selectedQuestionId: null,
    // 侧边栏当前活动标签
    activeTab: 'outline',
  }),

  getters: {
    // 获取当前试卷
    currentSurvey: (state) => {
      return state.surveys.find((survey) => survey.id === state.currentSurveyId) || null
    },

    // 获取当前试卷的所有页面
    currentPages: (state) => {
      const survey = state.surveys.find((survey) => survey.id === state.currentSurveyId)
      return survey ? survey.pages : []
    },

    // 获取大纲
    outlineData: (state) => {
      const survey = state.surveys.find((survey) => survey.id === state.currentSurveyId)
      return (survey?.pages || []).map((page) => {
        return {
          id: page.id,
          value: page.id,
          label: page.title,
          type: 'page',
          children: (page.questions || []).map((question) => {
            return {
              id: question.id,
              value: question.id,
              label: question.title,
              icon: typesEnum[question.type]?.icon,
              pageId: page.id,
              type: 'question',
            }
          }),
        }
      })
    },
    // 获取当前试卷的所有问题
    allQuestions: (state) => {
      const survey = state.surveys.find((survey) => survey.id === state.currentSurveyId)
      if (!survey) return []

      return survey.pages.flatMap((page) => page.questions)
    },

    // 获取所有问题类型
    allQuestionTypes: (state) => {
      return state.questionTypes
    },
    selectedPage: (state) => {
      const survey = state.surveys.find((survey) => survey.id === state.currentSurveyId)
      if (!survey) return null

      const page = survey.pages.find((p) => p.id === state.selectedPageId)
      if (page) return page
      return null
    },
    selectedPageIndex: (state) => {
      const survey = state.surveys.find((survey) => survey.id === state.currentSurveyId)
      if (!survey) return -1

      const pageIndex = survey.pages.findIndex((p) => p.id === state.selectedPageId)
      return pageIndex
    },
    // 获取选中的问题
    selectedQuestion: (state) => {
      const survey = state.surveys.find((survey) => survey.id === state.currentSurveyId)
      if (!survey) return null

      for (const page of survey.pages) {
        const question = page.questions.find((q) => q.id === state.selectedQuestionId)

        if (question) {
          if (!question.selectedAttrPanelType) {
            question.selectedAttrPanelType = 'basic'
          }
          return question
        }
      }

      return null
    },

    // 获取问题类型详情
    getQuestionTypeInfo: (state) => (typeId) => {
      return state.questionTypes.find((type) => type.id === typeId) || null
    },
  },

  actions: {
    // 创建新试卷
    createSurvey(title = '未命名问卷') {
      const newSurvey = {
        id: uuidv4(),
        title,
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          isPublished: false,
          allowAnonymous: true,
          showProgressBar: true,
          showPageTitles: true,
        },
        pages: [
          {
            id: uuidv4(),
            title: '问卷1',
            description: '',
            questions: [],
          },
        ],
      }

      this.surveys.push(newSurvey)
      this.currentSurveyId = newSurvey.id
      return newSurvey
    },
    updateSurveyByOutlineStructure(draggingNode, dropNode, dropType) {
      const draggingData = draggingNode.data
      const dropData = dropNode.data

      // 获取当前的 survey
      const survey = this.surveys.find((survey) => survey.id === this.currentSurveyId)

      if (!survey) return

      // 创建 survey 的深拷贝，避免直接修改 state
      const updatedSurvey = JSON.parse(JSON.stringify(survey))

      // 如果拖拽的是页面节点
      if (draggingData.type === 'page') {
        // 找到被拖拽的页面索引
        const draggingPageIndex = updatedSurvey.pages.findIndex(
          (page) => page.id === draggingData.id,
        )

        if (draggingPageIndex === -1) return

        // 移除被拖拽的页面
        const draggingPage = updatedSurvey.pages.splice(draggingPageIndex, 1)[0]

        // 如果是放到根级别（页面之间的排序）
        if (dropType === 'before' || dropType === 'after') {
          // 找到目标页面的索引
          const dropPageIndex = updatedSurvey.pages.findIndex((page) => page.id === dropData.id)

          if (dropPageIndex === -1) return

          // 计算新的插入位置
          const newIndex = dropType === 'before' ? dropPageIndex : dropPageIndex + 1

          // 插入页面到新位置
          updatedSurvey.pages.splice(newIndex, 0, draggingPage)
        }
      }
      // 如果拖拽的是问题节点
      else if (draggingData.type === 'question') {
        // 找到问题原来所在的页面
        const sourcePageIndex = updatedSurvey.pages.findIndex(
          (page) => page.id === draggingData.pageId,
        )

        if (sourcePageIndex === -1) return

        // 找到被拖拽的问题在原页面中的索引
        const draggingQuestionIndex = updatedSurvey.pages[sourcePageIndex].questions.findIndex(
          (question) => question.id === draggingData.id,
        )

        if (draggingQuestionIndex === -1) return

        // 移除被拖拽的问题
        const draggingQuestion = updatedSurvey.pages[sourcePageIndex].questions.splice(
          draggingQuestionIndex,
          1,
        )[0]

        // 根据放置类型处理
        if (dropType === 'inner') {
          // 放置到页面内部
          const targetPageIndex = updatedSurvey.pages.findIndex((page) => page.id === dropData.id)

          if (targetPageIndex === -1) return

          // 更新问题的pageId
          draggingQuestion.pageId = dropData.id

          // 添加问题到目标页面
          if (!updatedSurvey.pages[targetPageIndex].questions) {
            updatedSurvey.pages[targetPageIndex].questions = []
          }
          updatedSurvey.pages[targetPageIndex].questions.push(draggingQuestion)
        } else if (dropType === 'before' || dropType === 'after') {
          // 放置到另一个问题的前面或后面

          // 找到目标问题所在的页面
          const targetPageIndex = updatedSurvey.pages.findIndex(
            (page) => page.id === dropData.pageId,
          )

          if (targetPageIndex === -1) return

          // 找到目标问题在页面中的索引
          const targetQuestionIndex = updatedSurvey.pages[targetPageIndex].questions.findIndex(
            (question) => question.id === dropData.id,
          )

          if (targetQuestionIndex === -1) return

          // 更新问题的pageId
          draggingQuestion.pageId = dropData.pageId

          // 计算新的插入位置
          const newIndex = dropType === 'before' ? targetQuestionIndex : targetQuestionIndex + 1

          // 插入问题到新位置
          updatedSurvey.pages[targetPageIndex].questions.splice(newIndex, 0, draggingQuestion)
        }
      }

      // 更新 store 中的 survey
      const surveyIndex = this.surveys.findIndex((s) => s.id === this.currentSurveyId)

      if (surveyIndex !== -1) {
        this.surveys[surveyIndex] = updatedSurvey
      }
    },
    // 更新试卷信息
    updateSurvey(surveyId, data) {
      const index = this.surveys.findIndex((s) => s.id === surveyId)
      if (index === -1) return

      this.surveys[index] = {
        ...this.surveys[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
    },
    resetCurrentSurvey() {
      if (!this.currentSurvey) return

      // 保留问卷ID和创建信息，但重置内容
      const surveyId = this.currentSurvey.id
      const createdAt = this.currentSurvey.createdAt
      const updatedAt = new Date().toISOString()

      // 重置问卷，保留一个空白页
      this.currentSurvey = {
        id: surveyId,
        title: '未命名问卷',
        description: '',
        createdAt,
        updatedAt,
        pages: [
          {
            id: `page-${Date.now()}`,
            title: '问卷1',
            questions: [],
          },
        ],
        settings: {
          theme: 'default',
          allowAnonymous: true,
          showProgressBar: true,
        },
      }
    },
    // 删除试卷
    deleteSurvey(surveyId) {
      const index = this.surveys.findIndex((s) => s.id === surveyId)
      if (index === -1) return

      this.surveys.splice(index, 1)

      if (this.currentSurveyId === surveyId) {
        this.currentSurveyId = this.surveys.length > 0 ? this.surveys[0].id : null
      }
    },

    // 设置当前活动试卷
    setCurrentSurvey(surveyId) {
      this.currentSurveyId = surveyId
    },
    // 设置选中的页面
    setSelectedPage(pageId, questionId) {
      this.selectedPageId = pageId
      // 选中当前页面中的第一个问题
      const page = this.currentPages.find((p) => p.id === pageId)
      if (page)
        this.setSelectedQuestion(
          questionId || page.selectedQuestionId || page.questions[0]?.id || null,
        )
    },
    // 添加新页面
    addPage(title = '') {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      const newPage = {
        id: uuidv4(),
        title: title || `问卷${survey.pages.length + 1}`,
        description: '',
        questions: [],
      }

      survey.pages.push(newPage)
      survey.updatedAt = new Date().toISOString()

      return newPage
    },

    // 更新页面信息
    updatePage(pageId, data) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      const pageIndex = survey.pages.findIndex((p) => p.id === pageId)
      if (pageIndex === -1) return

      survey.pages[pageIndex] = {
        ...survey.pages[pageIndex],
        ...data,
      }

      survey.updatedAt = new Date().toISOString()
    },

    // 删除页面
    deletePage(pageId) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      const pageIndex = survey.pages.findIndex((p) => p.id === pageId)
      if (pageIndex === -1) return

      // 如果只有一页，不允许删除
      if (survey.pages.length === 1) return

      // 查找该页面上是否有选中的问题
      const hasSelectedQuestion = survey.pages[pageIndex].questions.some(
        (q) => q.id === this.selectedQuestionId,
      )

      if (hasSelectedQuestion) {
        this.selectedQuestionId = null
      }

      survey.pages.splice(pageIndex, 1)
      survey.updatedAt = new Date().toISOString()
    },

    // 移动页面顺序
    movePage(fromIndex, toIndex) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      if (
        fromIndex < 0 ||
        fromIndex >= survey.pages.length ||
        toIndex < 0 ||
        toIndex >= survey.pages.length
      ) {
        return
      }

      const [movedPage] = survey.pages.splice(fromIndex, 1)
      survey.pages.splice(toIndex, 0, movedPage)
      survey.updatedAt = new Date().toISOString()
    },

    duplicatePage(pageId) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return
      const pageIndex = survey.pages.findIndex((p) => p.id === pageId)
      if (pageIndex === -1) return
      const newPage = { ...survey.pages[pageIndex] }
      newPage.id = uuidv4()
      newPage.title = `副本-${newPage.title}`
      survey.pages.splice(pageIndex + 1, 0, newPage)
      survey.updatedAt = new Date().toISOString()
      return newPage
    },
    getQuestionById(questionId) {
      console.log(questionId)
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return null
      const page = survey.pages.find((p) => p.id === this.selectedPageId)
      if (!page) return null
      const question = page.questions.find((q) => q.id === questionId)
      return question
    },
    // 添加问题
    addQuestion(type = 'singleChoice') {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      const pageIndex = survey.pages.findIndex((p) => p.id === this.selectedPageId)
      if (pageIndex === -1) return

      const newQuestion = this.createQuestionByType(type)
      survey.pages[pageIndex].questions.push(newQuestion)
      survey.updatedAt = new Date().toISOString()

      // 自动选中新添加的问题
      this.selectedQuestionId = newQuestion.id

      return newQuestion
    },
    addQuestionAtIndex(type, index) {
      const currentPageId = this.selectedPageId
      if (!currentPageId) return null

      const newQuestion = this.createQuestionByType(type)

      // 找到当前页面
      const pageIndex = this.currentSurvey.pages.findIndex((p) => p.id === currentPageId)
      if (pageIndex === -1) return null

      // 在指定索引位置插入问题
      const questions = [...this.currentSurvey.pages[pageIndex].questions]
      questions.splice(index, 0, newQuestion)
      this.currentSurvey.pages[pageIndex].questions = questions

      return newQuestion
    },
    updateSelectedQuestion(question) {
      const page = this.selectedPage
      page.questions = page.questions.map((q) => {
        if (q.id == question.id) {
          return {
            ...q,
            ...question,
          }
        }
        return q
      })
    },
    // 根据类型创建问题基础结构
    createQuestionByType(type) {
      const baseQuestion = {
        id: uuidv4(),
        name: `question_${uuidv4().substring(0, 8)}`,
        type,
        attrs: {
          type,
          title: '请输入问题标题',
          required: false,
          haveCorrect: false,
          description: '',
        },
      }

      // 根据不同问题类型，添加特定属性
      switch (type) {
        case 'SingleChoice':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              layout: 'vertical',
              hasOther: false,
              options: [
                { value: 'option1', label: '选项1' },
                { value: 'option2', label: '选项2' },
              ],
            },
          }

        case 'MultipleChoice':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              layout: 'vertical',
              minSelected: 0,
              maxSelected: 0, // 0表示不限制
              hasOther: false,
              options: [
                { value: 'option1', label: '选项1' },
                { value: 'option2', label: '选项2' },
                { value: 'option3', label: '选项3' },
              ],
            },
          }

        case 'FillBlank':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              placeholder: '请输入...',
              minLength: 0,
              maxLength: 0, // 0表示不限制
              validation: 'none',
            },
          }

        case 'TextArea':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              placeholder: '请输入...',
              rows: 5,
              maxLength: 500,
            },
          }

        case 'Rating':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              maxRating: 5,
              allowHalf: true,
              iconType: 'star',
              defaultValue: 0,
            },
          }

        case 'MatrixChoice':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              type: 'single', // 'single' 或 'multiple'
              rows: [
                { value: 'row1', label: '行1' },
                { value: 'row2', label: '行2' },
              ],
              columns: [
                { value: 'col1', label: '列1' },
                { value: 'col2', label: '列2' },
                { value: 'col3', label: '列3' },
              ],
            },
          }

        case 'TrueFalse':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              trueLabel: '正确',
              falseLabel: '错误',
            },
          }

        case 'Ranking':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              options: [
                { value: 'option1', label: '选项1' },
                { value: 'option2', label: '选项2' },
                { value: 'option3', label: '选项3' },
              ],
            },
          }

        case 'DatePicker':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              type: 'date', // 'date', 'datetime', 'daterange'
              placeholder: '选择日期',
              format: 'YYYY-MM-DD',
              valueFormat: 'YYYY-MM-DD',
            },
          }

        case 'FileUpload':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              uploadUrl: '/api/upload',
              multiple: false,
              limit: 1,
              accept: '.jpg,.jpeg,.png,.pdf',
              tip: '请上传文件',
            },
          }

        case 'Calculation':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              haveCorrect: true,
              fields: [
                {
                  label: '变量1',
                  min: 0,
                  max: 100,
                  step: 1,
                  default: 0,
                },
                {
                  label: '变量2',
                  min: 0,
                  max: 100,
                  step: 1,
                  default: 0,
                },
              ],
              formula: 'v0 + v1',
              resultLabel: '计算结果',
              decimals: 2,
            },
          }

        case 'Paragraph':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              content: '<p>请输入段落内容</p>',
            },
          }

        case 'Group':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              questions: [],
            },
          }

        case 'StemQuestion':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              stem: '<p>请输入题干内容</p>',
              attachments: [],
              questions: [
                {
                  id: uuidv4(),
                  name: 'subquestion_1',
                  type: 'FillBlank',
                  attrs: {
                    title: '子问题1',
                    required: true,
                  },
                },
              ],
            },
          }

        case 'SubjectiveQuestion':
          return {
            ...baseQuestion,
            attrs: {
              ...baseQuestion.attrs,
              answerType: 'text', // 'text', 'image', 'file'
              rows: 8,
              maxLength: 500,
              placeholder: '请在此输入您的答案...',
            },
          }

        default:
          return baseQuestion
      }
    },

    // 更新问题
    updateQuestion(questionId, data) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      for (const page of survey.pages) {
        const questionIndex = page.questions.findIndex((q) => q.id === questionId)
        if (questionIndex !== -1) {
          page.questions[questionIndex] = {
            ...page.questions[questionIndex],
            ...data,
          }
          survey.updatedAt = new Date().toISOString()
          return
        }
      }
    },

    // 删除问题
    deleteQuestion(questionId) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      for (const page of survey.pages) {
        const questionIndex = page.questions.findIndex((q) => q.id === questionId)
        if (questionIndex !== -1) {
          page.questions.splice(questionIndex, 1)
          survey.updatedAt = new Date().toISOString()

          if (this.selectedQuestionId === questionId) {
            this.selectedQuestionId = null
          }

          return
        }
      }
    },

    // 复制问题
    duplicateQuestion(questionId) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      for (const page of survey.pages) {
        const question = page.questions.find((q) => q.id === questionId)
        if (question) {
          const newQuestion = JSON.parse(JSON.stringify(question))
          newQuestion.id = uuidv4()
          newQuestion.title = `${newQuestion.title} (复制)`

          // 为嵌套的选项等生成新ID
          if (newQuestion.options) {
            newQuestion.options = newQuestion.options.map((opt) => ({
              ...opt,
              id: uuidv4(),
            }))
          }

          if (newQuestion.rows) {
            newQuestion.rows = newQuestion.rows.map((row) => ({
              ...row,
              id: uuidv4(),
            }))
          }

          if (newQuestion.columns) {
            newQuestion.columns = newQuestion.columns.map((col) => ({
              ...col,
              id: uuidv4(),
            }))
          }

          // 在原问题后面插入
          const questionIndex = page.questions.findIndex((q) => q.id === questionId)
          page.questions.splice(questionIndex + 1, 0, newQuestion)
          survey.updatedAt = new Date().toISOString()

          // 自动选中新复制的问题
          this.selectedQuestionId = newQuestion.id

          return newQuestion
        }
      }
    },

    // 移动问题在页面内的位置
    moveQuestion(pageId, fromIndex, toIndex) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      const pageIndex = survey.pages.findIndex((p) => p.id === pageId)
      if (pageIndex === -1) return

      const page = survey.pages[pageIndex]

      if (
        fromIndex < 0 ||
        fromIndex >= page.questions.length ||
        toIndex < 0 ||
        toIndex >= page.questions.length
      ) {
        return
      }

      const [movedQuestion] = page.questions.splice(fromIndex, 1)
      page.questions.splice(toIndex, 0, movedQuestion)
      survey.updatedAt = new Date().toISOString()
    },

    // 将问题移动到另一个页面
    moveQuestionToPage(questionId, targetPageId) {
      const survey = this.surveys.find((s) => s.id === this.currentSurveyId)
      if (!survey) return

      let sourceQuestion = null
      let sourcePageIndex = -1
      let sourceQuestionIndex = -1

      // 找到源问题和位置
      for (let i = 0; i < survey.pages.length; i++) {
        const qIndex = survey.pages[i].questions.findIndex((q) => q.id === questionId)
        if (qIndex !== -1) {
          sourcePageIndex = i
          sourceQuestionIndex = qIndex
          sourceQuestion = survey.pages[i].questions[qIndex]
          break
        }
      }

      if (!sourceQuestion) return

      // 找到目标页面
      const targetPageIndex = survey.pages.findIndex((p) => p.id === targetPageId)
      if (targetPageIndex === -1) return

      // 从源页面移除
      survey.pages[sourcePageIndex].questions.splice(sourceQuestionIndex, 1)

      // 添加到目标页面
      survey.pages[targetPageIndex].questions.push(sourceQuestion)
      survey.updatedAt = new Date().toISOString()
    },

    // 设置选中的问题
    setSelectedQuestion(questionId) {
      this.selectedQuestionId = questionId
      this.updatePage(this.selectedPageId, {
        selectedQuestionId: questionId,
      })
    },

    // 设置当前活动标签
    setActiveTab(tabKey) {
      this.activeTab = tabKey
    },

    // 导出试卷为JSON
    exportSurvey(surveyId) {
      const survey = this.surveys.find((s) => s.id === surveyId || s.id === this.currentSurveyId)
      if (!survey) return null

      return JSON.stringify(survey, null, 2)
    },

    // 导入试卷
    createSurveyFromJson(jsonData, surveyTitle = '导入的问卷') {
      try {
        // 验证JSON数据基本结构
        if (!jsonData || !jsonData.pages || !Array.isArray(jsonData.pages)) {
          throw new Error('无效的问卷JSON格式')
        }

        // 创建新问卷
        const newSurvey = {
          id: uuidv4(),
          title: jsonData.title || surveyTitle,
          description: jsonData.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            isPublished: false,
            allowAnonymous: true,
            showProgressBar: true,
            showPageTitles: true,
            ...jsonData.settings,
          },
          pages: [],
        }
        let firstPageId
        // 转换页面和问题
        newSurvey.pages = jsonData.pages.map((page, index) => {
          const newPage = {
            id: uuidv4(),
            title: page.name || '未命名页面',
            description: page.description || '',
            questions: [],
          }
          if (!index) {
            firstPageId = newPage.id
          }

          // 处理页面中的问题元素
          if (page.questions && Array.isArray(page.questions)) {
            newPage.questions = page.questions.map((tmpQuestion) => {
              // 转换问题类型
              const questionType = tmpQuestion.type

              // 创建基础问题结构
              const baseQuestion = this.createQuestionByType(questionType)
              const attrs = tmpQuestion.attrs
              // 设置问题基本属性
              const question = {
                id: uuidv4(),
                ...baseQuestion,
                ...attrs,
                title: attrs.title || tmpQuestion.name || '未命名问题',
                name: tmpQuestion.name || '',
                required: attrs.isRequired || false,
                showDescription: !!attrs.description,
                type: tmpQuestion.type,
                attrs,
              }
              return question
            })
          }

          return newPage
        })

        // 添加到问卷列表并设为当前活动问卷
        this.surveys.push(newSurvey)
        this.currentSurveyId = newSurvey.id
        this.setSelectedPage(firstPageId)

        return newSurvey
      } catch (error) {
        console.error('创建问卷失败:', error)
        return null
      }
    },

    setSelectedAttrPanelType(type) {
      const question = this.selectedQuestion
      if (question) {
        question.selectedAttrPanelType = type
      }
    },

    // 初始化选项值
    initOptionsValue() {
      const question = this.selectedQuestion
      if (question) {
        // 存在选项数组
        if (question.options && Array.isArray(question.options)) {
          // 遍历 如果没有值 则赋值
          question.options.forEach((option, index) => {
            if (!option.value) {
              question.options[index] = {
                value: uuidv4(),
                label: '',
              }
            }
          })
        }
      }
    },
  },
})
