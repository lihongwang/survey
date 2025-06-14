// 管理编辑器相关的状态和交互

import { defineStore } from 'pinia'
import { useSurveyStore } from './survey'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    // 拖拽相关状态
    dragging: {
      isDragging: false,
      type: null, // 'question', 'page', 'questionType'
      sourceId: null,
      sourceIndex: null,
    },

    // 设计器视图模式
    deviceType: 'edit', // 'edit', 'preview', 'mobile'

    // 历史记录 (撤销/重做功能)
    history: {
      past: [],
      future: [],
    },

    // 当前保存状态
    saveStatus: 'saved', // 'saved', 'saving', 'unsaved'

    // GoTop 按钮显示状态
    showGoTopButton: false,
  }),
  getters: {},
  actions: {
    // 设置 GoTop 按钮显示状态
    setShowGoTopButton(show) {
      this.showGoTopButton = show
    },
    // 设置拖拽状态
    setDragging(isDragging, type = null, sourceId = null, sourceIndex = null) {
      this.dragging.isDragging = isDragging
      this.dragging.type = type
      this.dragging.sourceId = sourceId
      this.dragging.sourceIndex = sourceIndex
    },

    // 处理问题类型拖拽到设计区
    handleQuestionTypeDrop(pageId, questionType, index) {
      const surveyStore = useSurveyStore()

      // 添加新问题到指定位置
      const newQuestion = surveyStore.addQuestion(pageId, questionType)

      if (newQuestion && typeof index === 'number') {
        // 找到新问题的当前位置，然后移动到目标位置
        const survey = surveyStore.currentSurvey
        const page = survey.pages.find((p) => p.id === pageId)
        if (page) {
          const currentIndex = page.questions.length - 1 // 刚添加的问题在末尾
          if (currentIndex !== index) {
            surveyStore.moveQuestion(pageId, currentIndex, index)
          }
        }
      }

      this.resetDragging()
      this.recordHistory()
    },

    // 处理页面内问题拖拽
    handleQuestionDrop(pageId, fromIndex, toIndex) {
      if (fromIndex === toIndex) return

      const surveyStore = useSurveyStore()
      surveyStore.moveQuestion(pageId, fromIndex, toIndex)
      this.resetDragging()
      this.recordHistory()
    },

    // 处理跨页面问题拖拽
    handleCrossPageQuestionDrop(questionId, targetPageId, targetIndex) {
      const surveyStore = useSurveyStore()
      surveyStore.moveQuestionToPage(questionId, targetPageId)
      this.resetDragging()
      this.recordHistory()
    },

    // 重置拖拽状态
    resetDragging() {
      this.dragging.isDragging = false
      this.dragging.type = null
      this.dragging.sourceId = null
      this.dragging.sourceIndex = null
    },
    // 设置视图模式
    setDeviceType(mode) {
      this.deviceType = mode
    },

    // 记录历史状态（用于撤销/重做）
    recordHistory() {
      const surveyStore = useSurveyStore()
      const currentState = JSON.stringify(surveyStore.$state)

      this.history.past.push(currentState)
      this.history.future = []

      // 限制历史记录数量，防止内存溢出
      if (this.history.past.length > 50) {
        this.history.past.shift()
      }

      // 标记为未保存
      this.saveStatus = 'unsaved'
    },

    // 撤销操作
    undo() {
      if (this.history.past.length === 0) return

      const surveyStore = useSurveyStore()
      const currentState = JSON.stringify(surveyStore.$state)

      // 将当前状态添加到future队列
      this.history.future.unshift(currentState)

      // 获取上一个状态
      const previousState = this.history.past.pop()

      // 恢复上一个状态
      surveyStore.$state = JSON.parse(previousState)

      // 标记为未保存
      this.saveStatus = 'unsaved'
    },

    // 重做操作
    redo() {
      if (this.history.future.length === 0) return

      const surveyStore = useSurveyStore()
      const currentState = JSON.stringify(surveyStore.$state)

      // 将当前状态添加到past队列
      this.history.past.push(currentState)

      // 获取下一个状态
      const nextState = this.history.future.shift()

      // 恢复下一个状态
      surveyStore.$state = JSON.parse(nextState)

      // 标记为未保存
      this.saveStatus = 'unsaved'
    },

    // 标记保存状态
    setSaveStatus(status) {
      this.saveStatus = status
    },

    // 保存当前问卷
    async saveSurvey() {
      this.saveStatus = 'saving'

      try {
        // 这里应该是实际的保存操作，例如API请求
        // 模拟异步保存操作
        await new Promise((resolve) => setTimeout(resolve, 800))

        this.saveStatus = 'saved'
        return true
      } catch (error) {
        console.error('保存问卷失败:', error)
        this.saveStatus = 'unsaved'
        return false
      }
    },

    // 选项显示变更(单选/多选)
    changeOptionName(index, optionType) {
      const type = optionType || 1

      // 英文字母生成，支持无限延长（如 Excel 列命名）
      const numberToLetters = (n) => {
        let result = ''
        n++ // 从 0 起始转为从 1 起始
        while (n > 0) {
          n-- // 调整偏移
          result = String.fromCharCode(65 + (n % 26)) + result
          n = Math.floor(n / 26)
        }
        return result
      }

      // 阿拉伯数字转罗马数字（无限支持）
      const numberToRoman = (num) => {
        const romanMap = [
          [1000, 'M'],
          [900, 'CM'],
          [500, 'D'],
          [400, 'CD'],
          [100, 'C'],
          [90, 'XC'],
          [50, 'L'],
          [40, 'XL'],
          [10, 'X'],
          [9, 'IX'],
          [5, 'V'],
          [4, 'IV'],
          [1, 'I'],
        ]
        let result = ''
        for (const [value, numeral] of romanMap) {
          while (num >= value) {
            result += numeral
            num -= value
          }
        }
        return result
      }

      if (type === 1) {
        return (index + 1).toString() // 数字
      } else if (type === 2) {
        return numberToLetters(index) // 字母
      } else if (type === 3) {
        return numberToRoman(index + 1) // 罗马数字
      } else {
        return (index + 1).toString() // 默认返回数字
      }
    },
  },
})
