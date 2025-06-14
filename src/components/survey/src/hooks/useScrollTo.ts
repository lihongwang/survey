import { nextTick, ref, unref, watch } from 'vue'

import { useScroll } from '@vueuse/core'
import { useSurveyEvents } from './useSurveyEvents'

export function useScrollTo(containerRef = null, threshold = 200) {
  const surveyEvents = useSurveyEvents()

  const isScrolling = ref(false)
  // 记录scrollY位置

  // 使用 VueUse 的滚动功能
  const {
    arrivedState,
    directions,
    y: scrollY,
  } = useScroll(containerRef, {
    behavior: 'smooth',
  })
  watch(
    () => scrollY.value,
    (newScrollY) => {
      // 当滚动位置超过阈值时，通知顶部按钮显示状态
      // console.log('newScrollY', newScrollY);
      surveyEvents.notifyToggleTopButton(newScrollY > threshold)
    },
    { immediate: true },
  )
  // 滚动到指定元素
  const scrollToElement = async (elementId, options = {}) => {
    const {
      offset = 0,
      behavior = 'smooth',
      container = containerRef,
      highlight = true,
      highlightDuration = 2000,
    } = options

    if (isScrolling.value) return

    isScrolling.value = true

    try {
      await nextTick()

      const targetElement = document.getElementById(elementId)
      if (!targetElement) {
        console.warn(`Element with id "${elementId}" not found`)
        return false
      }

      const scrollContainer = unref(container) || document.documentElement

      if (!scrollContainer) {
        console.warn('Scroll container not found')
        return false
      }

      // 计算滚动位置
      const containerRect = scrollContainer.getBoundingClientRect()
      const targetRect = targetElement.getBoundingClientRect()

      let scrollTop
      if (scrollContainer === document.documentElement) {
        scrollTop = window.pageYOffset + targetRect.top - offset
      } else {
        scrollTop = scrollContainer.scrollTop + targetRect.top - containerRect.top - offset
      }

      // 使用 VueUse 的滚动方法
      if (scrollContainer === document.documentElement) {
        window.scrollTo({
          top: scrollTop,
          behavior,
        })
      } else {
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior,
        })
      }

      // 添加高亮效果
      if (highlight) {
        targetElement.classList.add('scroll-highlight')
        setTimeout(() => {
          targetElement.classList.remove('scroll-highlight')
        }, highlightDuration)
      }

      return true
    } catch (error) {
      console.error('Scroll to element failed:', error)
      return false
    } finally {
      setTimeout(() => {
        isScrolling.value = false
      }, 1000)
    }
  }

  // 滚动到顶部
  const scrollToTop = (container = containerRef, behavior = 'smooth') => {
    const scrollContainer = unref(container) || document.documentElement

    if (scrollContainer === document.documentElement) {
      window.scrollTo({ top: 0, behavior })
    } else if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior })
    }
  }

  // 滚动到底部
  const scrollToBottom = (container = containerRef, behavior = 'smooth') => {
    const scrollContainer = unref(container) || document.documentElement

    if (scrollContainer === document.documentElement) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior,
      })
    } else if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior,
      })
    }
  }

  // 滚动到问题
  const scrollToQuestion = (questionId, options = {}) => {
    return scrollToElement(`question-${questionId}`, {
      offset: 20,
      ...options,
    })
  }

  return {
    isScrolling,
    arrivedState,
    directions,
    scrollToElement,
    scrollToTop,
    scrollToBottom,
    scrollToQuestion,
  }
}
