<template>
  <div class="question-bank">
    <Header header="题库" />
    <CategoryTree @choose="handleChoose" class="w-full" />
    <el-dialog v-model="chooseDialogVisible" title="从题库录入" width="60%">
      <CategoryPopTree :data="currentNode" @close="handleClose" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CategoryPopTree from './category-tree/category-pop-tree.vue'
import CategoryTree from './category-tree/index.vue'
import Header from '../common/header.vue'
// 题库数据
const chooseDialogVisible = ref(false)
const currentNode = ref(null)
const handleChoose = (data) => {
  chooseDialogVisible.value = true
}
const handleClose = () => {
  chooseDialogVisible.value = false
}
</script>

<style></style>
