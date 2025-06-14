<template>
  <VueMonacoEditor
    v-model:value="modelValue"
    :language="lang"
    :theme="theme"
    :height="height"
    :options="MONACO_EDITOR_OPTIONS"
    @mount="handleMount"
    @change="handleChange"
  />
</template>

<script setup>
import { computed, ref, shallowRef } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
const props = defineProps({
  lang: {
    type: String,
    default: 'javascript',
  },
  theme: {
    type: String,
    default: 'vs',
  },
  context: {
    type: Object,
  },
  value: {
    type: String,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
  },
})
const modelValue = computed(() => props.value)
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  fontSize: 14,
  tabSize: 2,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
}
const emit = defineEmits(['change'])
const editor = shallowRef()
const handleMount = (editorInstance) => (editor.value = editorInstance)

const handleChange = (val) => {
  emit('change', val)
}
</script>

<style lang="scss" scoped>
.monaco-editor-field {
  min-height: 100px;
  width: 100%;
}
</style>
