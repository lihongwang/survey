<template>
  <div class="mb-6">
    <div class="prose max-w-none" v-html="question.content"></div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    required: true,
  },
})
</script>
