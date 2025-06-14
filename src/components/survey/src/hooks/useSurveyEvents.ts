import { nextTick, ref, unref } from 'vue'

import { useEventBus } from './useEventBus'

// 事件常量
export const SURVEY_EVENTS = {
  SCROLL_TO_QUESTION: 'survey:scroll-to-question',
  SCROLL_TO_TOP: 'survey:scroll-to-top',
  QUESTION_SELECTED: 'survey:question-selected',
  QUESTION_ADDED: 'survey:question-added',
  QUESTION_DELETED: 'survey:question-deleted',
  QUESTION_UPDATED: 'survey:question-updated',
  PAGE_CHANGED: 'survey:page-changed',
  TOGGLE_GO_TOP_BUTTON: 'survey:toggle-go-top-button',
}

export function useSurveyEvents() {
  const { emit, on, once } = useEventBus()

  // 滚动相关事件
  const scrollToQuestion = (questionId, options = {}) => {
    emit(SURVEY_EVENTS.SCROLL_TO_QUESTION, {
      questionId,
      highlight: true,
      offset: 20,
      ...options,
    })
  }

  const scrollToTop = () => {
    emit(SURVEY_EVENTS.SCROLL_TO_TOP)
  }

  // 问题相关事件
  const selectQuestion = (questionId, question) => {
    emit(SURVEY_EVENTS.QUESTION_SELECTED, {
      questionId,
      question,
      timestamp: Date.now(),
    })
  }

  const notifyQuestionAdded = (questionId, question, options = {}) => {
    emit(SURVEY_EVENTS.QUESTION_ADDED, {
      questionId,
      question,
      timestamp: Date.now(),
      ...options,
    })
  }

  const notifyQuestionDeleted = (questionId, question) => {
    emit(SURVEY_EVENTS.QUESTION_DELETED, {
      questionId,
      question,
      timestamp: Date.now(),
    })
  }

  const notifyQuestionUpdated = (questionId, question, changes) => {
    emit(SURVEY_EVENTS.QUESTION_UPDATED, {
      questionId,
      question,
      changes,
      timestamp: Date.now(),
    })
  }

  // 页面相关事件
  const notifyPageChanged = (pageId, page) => {
    emit(SURVEY_EVENTS.PAGE_CHANGED, {
      pageId,
      page,
      timestamp: Date.now(),
    })
  }
  const notifyToggleTopButton = (shown) => {
    emit(SURVEY_EVENTS.TOGGLE_GO_TOP_BUTTON, {
      shown,
      timestamp: Date.now(),
    })
  }
  // 事件监听器
  const onScrollToQuestion = (callback) => on(SURVEY_EVENTS.SCROLL_TO_QUESTION, callback)
  const onScrollToTop = (callback) => on(SURVEY_EVENTS.SCROLL_TO_TOP, callback)
  const onQuestionSelected = (callback) => on(SURVEY_EVENTS.QUESTION_SELECTED, callback)
  const onQuestionAdded = (callback) => on(SURVEY_EVENTS.QUESTION_ADDED, callback)
  const onQuestionDeleted = (callback) => on(SURVEY_EVENTS.QUESTION_DELETED, callback)
  const onQuestionUpdated = (callback) => on(SURVEY_EVENTS.QUESTION_UPDATED, callback)
  const onPageChanged = (callback) => on(SURVEY_EVENTS.PAGE_CHANGED, callback)
  const onToggleGoTopButton = (callback) => on(SURVEY_EVENTS.TOGGLE_GO_TOP_BUTTON, callback)

  return {
    // 事件发送
    scrollToQuestion,
    scrollToTop,
    selectQuestion,
    notifyQuestionAdded,
    notifyQuestionDeleted,
    notifyQuestionUpdated,
    notifyPageChanged,
    notifyToggleTopButton,
    // 事件监听
    onScrollToQuestion,
    onScrollToTop,
    onQuestionSelected,
    onQuestionAdded,
    onQuestionDeleted,
    onQuestionUpdated,
    onPageChanged,
    onToggleGoTopButton,
  }
}
