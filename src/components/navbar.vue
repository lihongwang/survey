<template>
  <nav class="bg-white shadow border-b mb-1">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-800 hover:text-blue-600">
            Survey
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors"
            :class="{ 'text-blue-600 font-semibold': $route.name === 'Home' }"
          >
            主页
          </router-link>

          <router-link
            v-if="authStore.isAuthenticated"
            to="/design"
            class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors"
            :class="{ 'text-blue-600 font-semibold': $route.name === 'Design' }"
          >
            设计页面
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/survey"
            class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors"
            :class="{ 'text-blue-600 font-semibold': $route.name === 'Survey' }"
          >
            问卷调查
          </router-link>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <span class="text-gray-600">欢迎，{{ authStore.user.name }}</span>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              登出
            </button>
          </div>
          <div v-else>
            <router-link
              to="/login"
              class="btn-primary"
            >
              登录
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            class="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
          >
            主页
          </router-link>

          <router-link
            v-if="authStore.isAuthenticated"
            to="/design"
            @click="mobileMenuOpen = false"
            class="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
          >
            设计页面
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/survey"
            @click="mobileMenuOpen = false"
            class="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
          >
            问卷调查
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  mobileMenuOpen.value = false
}
</script>