<template>
  <div class="flex flex-col">
    <div class="pb-2">
      <el-select v-model="selectedLibrary" placeholder="请选择题库" class="w-full">
        <el-option label="默认题库" value="default" />
      </el-select>
    </div>
    <div class="overflow-y-auto flex-1 min-h-0">
      <el-tree
        :data="subjectCategories"
        :expand-on-click-node="false"
        default-expand-all
        node-key="id"
        class="pr-4"
        :props="{ label: 'name', children: 'children' }"
        default-expand-keys="knowledgeCategory"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedLibrary = ref('')

const emit = defineEmits(['choose'])
const subjectCategories = ref([
  {
    id: 'knowledgeCategory',
    name: '知识竞赛类',
    children: [{ id: 'elementaryKnowledge', name: '小学安全知识' }],
  },
  {
    id: 'basicEducation',
    name: '基础教育类',
    children: [],
  },
  {
    id: 'historicalKnowledge',
    name: '历史知识试卷',
    children: [
      { id: 'historicalFigures', name: '历史人物知识' },
      { id: 'historicalEvents', name: '历史时间记载' },
    ],
  },
  {
    id: 'professionalCertification',
    name: '职业证书类',
    children: [
      { id: 'accounting', name: '会计基础模拟考试' },
      { id: 'teacherCertification', name: '教师资格证考试' },
    ],
  },
  {
    id: 'computerProgramming',
    name: '计算机编程类',
    children: [],
  },
])
// Methods
const handleNodeClick = (data) => {
  emit('choose', data)
  // Here you would typically load questions for the selected category
}
</script>

<style></style>
