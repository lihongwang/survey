<template>
  <div class="common-header flex gap-2 items-center justify-between h-[36px] border-b mb-3">
    <slot name="left-content"></slot>
    <div class="content flex-1 flex items-center gap-2">
      <h2 class="font-bold">{{ isEditing ? '' : header }}</h2>
      <div class="flex items-center" v-if="editable">
        <template v-if="isEditing">
          <el-input
            size="small"
            v-model="editableHeader"
            clearable
            @keyup.enter="saveEdit"
            style="width: 300px; padding-right: 10px"
          />
          <el-button link @click="cancelEdit" class="text-gray-500 text-sm"> 取消 </el-button>
          <el-button link @click="saveEdit" type="primary" class="text-blue-500 text-sm mr-2">
            保存
          </el-button>
        </template>

        <el-button v-else link @click="startEdit" class="text-gray-500 hover:text-gray-700">
          <EditIcon />
        </el-button>
      </div>
    </div>

    <slot name="right-content"></slot>
  </div>
</template>

<script setup lang="ts">
import { createIconifyIcon } from '@/utils/create-icon'
import { ref } from 'vue'
const EditIcon = createIconifyIcon('ic:outline-mode-edit')
const props = defineProps({
  header: {
    type: String,
    default: '标题',
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:header'])

const isEditing = ref(false)
const editableHeader = ref(props.header)

function startEdit() {
  editableHeader.value = props.header
  isEditing.value = true
}

function saveEdit() {
  emit('update:header', editableHeader.value)
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<style></style>
