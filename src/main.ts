import './style.scss'
import 'element-plus/dist/index.css'

import App from './App.vue'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { loader } from '@guolao/vue-monaco-editor'
import router from './router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

loader.config({
  paths: {
    vs: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.52.2/min/vs',
    // vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs',
  },
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: { ...zhCn },
})
app.mount('#app')
