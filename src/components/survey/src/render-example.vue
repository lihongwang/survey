<template>
  <SurveyRenderer :survey-data="surveyJson" />
</template>

<script setup>
import SurveyRenderer from './render.vue';
import surveyJson from './mock/survey-data.json';
</script>
