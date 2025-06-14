import { createEventHook } from '@vueuse/core'

// 创建事件钩子映射
const eventHooks = new Map()

// 获取或创建事件钩子
function getEventHook(eventName) {
  if (!eventHooks.has(eventName)) {
    eventHooks.set(eventName, createEventHook())
  }
  return eventHooks.get(eventName)
}

// 事件总线组合函数
export function useEventBus() {
  // 发送事件
  const emit = (eventName, payload) => {
    const hook = getEventHook(eventName)
    hook.trigger(payload)
  }

  // 监听事件
  const on = (eventName, callback) => {
    const hook = getEventHook(eventName)
    return hook.on(callback)
  }

  // 一次性监听
  const once = (eventName, callback) => {
    const hook = getEventHook(eventName)
    const stop = hook.on((payload) => {
      callback(payload)
      stop() // 执行一次后自动取消监听
    })
    return stop
  }

  // 清理所有事件（谨慎使用）
  const clear = () => {
    eventHooks.clear()
  }

  // 获取所有事件名称（调试用）
  const getEventNames = () => {
    return Array.from(eventHooks.keys())
  }

  return {
    emit,
    on,
    once,
    clear,
    getEventNames,
  }
}
