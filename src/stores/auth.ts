import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)

  // Mock用户数据
  const mockUsers = [
    { id: 1, username: 'admin', password: '123456', name: '管理员' },
    { id: 2, username: 'user', password: '123456', name: '普通用户' }
  ]

  const isAuthenticated = computed(() => !!user.value)

  // 模拟登录
  const login = async (credentials) => {
    isLoading.value = true

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    )

    if (foundUser) {
      user.value = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name
      }
      // 存储到localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      isLoading.value = false
      return { success: true }
    } else {
      isLoading.value = false
      return { success: false, error: '用户名或密码错误' }
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  // 初始化用户状态
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
})