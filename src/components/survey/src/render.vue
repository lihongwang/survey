<template>
  <div class="survey-container">
    <!-- 问卷标题 -->
    <div class="survey-header flex gap-2 justify-between">
      <div class="title-wrapper">

        <h1 class="survey-title">{{ survey.title }}</h1>
        <p v-if="survey.description" class="survey-description">
          {{ survey.description }}
        </p>
      </div>
      <!-- 页面标题 -->
      <div
        v-if="survey.settings.showPageTitles && currentPage.title"
        class="page-header"
      >
        <h2 class="page-title">{{ currentPage.title }}</h2>
        <p v-if="currentPage.description" class="page-description">
          {{ currentPage.description }}
        </p>
      </div>
    </div>

    <!-- 进度条 -->
    <div v-if="survey.settings.showProgressBar" class="progress-section">
      <el-progress
        :percentage="progressPercentage"
        :show-text="!isMobile"
        :stroke-width="isMobile ? 6 : 8"
        class="progress-bar"
      />
      <p class="progress-text">
        第 {{ currentPageIndex + 1 }} 页，共 {{ survey.pages.length }} 页
      </p>
    </div>

    <!-- 当前页面 -->
    <div v-if="currentPage" class="page-container">
      <!-- 问题列表 -->
      <div class="questions-container">
        <div
          v-for="question in currentPage.questions"
          :key="question.id"
          class="question-card"
        >
          <!-- 问题标题和描述 -->
          <div class="question-header">
            <h3 class="question-title">
              {{ question.title }}
              <span v-if="question.attrs.required" class="required-marker"
                >*</span
              >
            </h3>
            <p
              v-if="question.showDescription && question.description"
              class="question-description"
            >
              {{ question.description }}
            </p>
          </div>

          <!-- 根据问题类型渲染不同组件 -->
          <div class="question-content">
            <!-- 单选题 -->
            <template v-if="question.type === 'SingleChoice'">
              <el-radio-group
                v-model="answers[question.name]"
                class="!items-start"
                :class="getRadioGroupClass(question)"
                :size="getComponentSize"
              >
                <el-radio
                  v-for="option in question.options"
                  :key="option.value"
                  :label="option.value"
                  class="radio-option"
                >
                  {{ option.label }}
                </el-radio>
                <template v-if="question.hasOther">
                  <el-radio :label="'other'" class="other-radio">
                    其他
                  </el-radio>
                  <el-input
                    v-if="answers[question.name] === 'other'"
                    v-model="otherAnswers[question.name]"
                    placeholder="请输入其他选项"
                    class="other-input"
                    :size="getComponentSize"
                  />
                </template>
              </el-radio-group>
            </template>

            <!-- 多选题 -->
            <template v-else-if="question.type === 'MultipleChoice'">
              <el-checkbox-group
                v-model="answers[question.name]"
                :class="getCheckboxGroupClass(question)"
                :size="getComponentSize"
              >
                <el-checkbox
                  v-for="option in question.options"
                  :key="option.value"
                  :label="option.value"
                  class="checkbox-option"
                >
                  {{ option.label }}
                </el-checkbox>
                <div v-if="question.hasOther" class="other-option">
                  <el-checkbox label="other" class="other-checkbox">
                    其他
                  </el-checkbox>
                  <el-input
                    v-if="
                      answers[question.name] &&
                      answers[question.name].includes('other')
                    "
                    v-model="otherAnswers[question.name]"
                    placeholder="请输入其他选项"
                    class="other-input"
                    :size="getComponentSize"
                  />
                </div>
              </el-checkbox-group>
              <div
                v-if="question.minSelected || question.maxSelected"
                class="selection-hint"
              >
                <span v-if="question.minSelected"
                  >最少选择 {{ question.minSelected }} 项</span
                >
                <span v-if="question.maxSelected" class="ml-2"
                  >最多选择 {{ question.maxSelected }} 项</span
                >
              </div>
            </template>

            <!-- 填空题 -->
            <template v-else-if="question.type === 'FillBlank'">
              <el-input
                v-model="answers[question.name]"
                :placeholder="question.placeholder"
                :minlength="question.minLength"
                :maxlength="question.maxLength"
                :show-word-limit="question.maxLength > 0"
                :size="getComponentSize"
                class="fill-blank-input"
              />
            </template>

            <!-- 文本域 -->
            <template v-else-if="question.type === 'TextArea'">
              <el-input
                v-model="answers[question.name]"
                type="textarea"
                :placeholder="question.placeholder"
                :rows="getTextareaRows(question.rows)"
                :maxlength="question.maxLength"
                :show-word-limit="question.maxLength > 0"
                :size="getComponentSize"
                class="textarea-input"
              />
            </template>

            <!-- 评分题 -->
            <template v-else-if="question.type === 'Rating'">
              <div class="rating-container">
                <el-rate
                  v-model="answers[question.name]"
                  :max="question.maxScore || question.maxRating || 5"
                  :allow-half="question.allowHalf"
                  :size="getRatingSize"
                  show-text
                  :texts="['很差', '较差', '一般', '较好', '很好']"
                />
              </div>
            </template>

            <!-- 矩阵选择题 -->
            <template v-else-if="question.type === 'MatrixChoice'">
              <div class="matrix-container">
                <!-- 移动端卡片式布局 -->
                <div v-if="isMobile" class="matrix-mobile">
                  <div
                    v-for="row in question.rows"
                    :key="row.value"
                    class="matrix-row-card"
                  >
                    <h4 class="matrix-row-title">{{ row.label }}</h4>
                    <el-radio-group
                      v-model="answers[question.name + '_' + row.value]"
                      class="matrix-options"
                      :size="getComponentSize"
                    >
                      <el-radio
                        v-for="column in question.columns"
                        :key="column.value"
                        :label="column.value"
                        class="matrix-option"
                      >
                        {{ column.label }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>

                <!-- PC端和平板端表格布局 -->
                <div v-else class="matrix-table-container">
                  <table class="matrix-table">
                    <thead>
                      <tr class="matrix-header">
                        <th class="matrix-cell matrix-corner"></th>
                        <th
                          v-for="column in question.columns"
                          :key="column.value"
                          class="matrix-cell matrix-column-header"
                        >
                          {{ column.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="row in question.rows"
                        :key="row.value"
                        class="matrix-row"
                      >
                        <td class="matrix-cell matrix-row-header">
                          {{ row.label }}
                        </td>
                        <td
                          v-for="column in question.columns"
                          :key="`${row.value}-${column.value}`"
                          class="matrix-cell matrix-option-cell"
                        >
                          <el-radio
                            v-model="answers[question.name + '_' + row.value]"
                            :label="column.value"
                            :size="getComponentSize"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-container">
      <el-button
        v-if="currentPageIndex > 0"
        @click="previousPage"
        type="default"
        :size="getComponentSize"
        class="nav-button"
      >
        <el-icon v-if="!isMobile" class="mr-1"><ArrowLeft /></el-icon>
        上一页
      </el-button>
      <div v-else class="nav-spacer"></div>

      <div class="nav-right">
        <el-button
          v-if="currentPageIndex < survey.pages.length - 1"
          @click="nextPage"
          type="primary"
          :size="getComponentSize"
          class="nav-button"
        >
          下一页
          <el-icon v-if="!isMobile" class="ml-1"><ArrowRight /></el-icon>
        </el-button>
        <el-button
          v-else
          @click="submitSurvey"
          type="success"
          :size="getComponentSize"
          class="nav-button submit-button"
        >
          <el-icon v-if="!isMobile" class="mr-1"><Check /></el-icon>
          提交问卷
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue';

// Props
const props = defineProps({
  surveyData: {
    type: Object,
    required: true,
  },
});

// 响应式数据
const survey = ref(props.surveyData);
const currentPageIndex = ref(0);
const answers = reactive({});
const otherAnswers = reactive({});
const windowWidth = ref(window.innerWidth);

// 响应式断点
const isMobile = computed(() => windowWidth.value < 768);
const isTablet = computed(
  () => windowWidth.value >= 768 && windowWidth.value < 1024
);
const isDesktop = computed(() => windowWidth.value >= 1024);

// 计算属性
const currentPage = computed(() => {
  return survey.value.pages[currentPageIndex.value];
});

const progressPercentage = computed(() => {
  return Math.round(
    ((currentPageIndex.value + 1) / survey.value.pages.length) * 100
  );
});

const getComponentSize = computed(() => {
  if (isMobile.value) return 'small';
  if (isTablet.value) return 'default';
  return 'default';
});

const getRatingSize = computed(() => {
  if (isMobile.value) return 'small';
  return 'default';
});

// 方法
const getRadioGroupClass = (question) => {
  const baseClass = 'radio-group';
  const layoutClass =
    question.layout === 'vertical' || isMobile.value
      ? 'vertical'
      : 'horizontal';
  return `${baseClass} ${layoutClass}`;
};

const getCheckboxGroupClass = (question) => {
  const baseClass = 'checkbox-group';
  const layoutClass =
    question.layout === 'vertical' || isMobile.value
      ? 'vertical'
      : 'horizontal';
  return `${baseClass} ${layoutClass}`;
};

const getTextareaRows = (defaultRows) => {
  if (isMobile.value) return Math.max(3, (defaultRows || 4) - 1);
  return defaultRows || 4;
};

const nextPage = () => {
  if (validateCurrentPage()) {
    if (currentPageIndex.value < survey.value.pages.length - 1) {
      currentPageIndex.value++;
      scrollToTop();
    }
  }
};

const previousPage = () => {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--;
    scrollToTop();
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const validateCurrentPage = () => {
  const page = currentPage.value;
  for (const question of page.questions) {
    if (question.attrs.required) {
      const answer = answers[question.name];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        ElMessage.error(`请回答问题：${question.title}`);
        return false;
      }

      // 验证多选题的最小/最大选择数
      if (question.type === 'MultipleChoice') {
        if (question.minSelected && answer.length < question.minSelected) {
          ElMessage.error(
            `"${question.title}" 至少需要选择 ${question.minSelected} 项`
          );
          return false;
        }
        if (question.maxSelected && answer.length > question.maxSelected) {
          ElMessage.error(
            `"${question.title}" 最多只能选择 ${question.maxSelected} 项`
          );
          return false;
        }
      }

      // 验证矩阵题
      if (question.type === 'MatrixChoice') {
        for (const row of question.rows) {
          if (!answers[question.name + '_' + row.value]) {
            ElMessage.error(`请完成所有评价项目`);
            return false;
          }
        }
      }
    }
  }
  return true;
};

const submitSurvey = () => {
  if (validateCurrentPage()) {
    // 整理提交数据
    const submitData = {
      surveyId: survey.value.id,
      answers: { ...answers },
      otherAnswers: { ...otherAnswers },
      submittedAt: new Date().toISOString(),
      deviceType: isMobile.value
        ? 'mobile'
        : isTablet.value
        ? 'tablet'
        : 'desktop',
    };

    console.log('提交的问卷数据:', submitData);
    ElMessage.success('问卷提交成功！');

    // 这里可以调用API提交数据
    // await submitSurveyData(submitData)
  }
};

// 初始化答案对象
const initializeAnswers = () => {
  survey.value.pages.forEach((page) => {
    page.questions.forEach((question) => {
      if (question.type === 'MultipleChoice') {
        answers[question.name] = [];
      } else if (question.type === 'Rating') {
        answers[question.name] = question.defaultValue || 0;
      } else if (question.type === 'MatrixChoice') {
        question.rows.forEach((row) => {
          answers[question.name + '_' + row.value] = null;
        });
      } else {
        answers[question.name] = '';
      }
    });
  });
};

// 窗口大小监听
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  initializeAnswers();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* 基础容器样式 */
.survey-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background-color: white;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 问卷标题区域 */
.survey-header {
  margin-bottom: 1rem;
  text-align: center;
}

.survey-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.survey-description {
  color: #6b7280;
  font-size: 1rem;
}

/* 进度条区域 */
.progress-section {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.progress-bar {
  margin-bottom: 0.5rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
}

/* 页面容器 */
.page-container {
  margin-bottom: 1rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 1rem;
}

.page-header {
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6b7280;
  margin: 0;
}

/* 问题容器 */
.questions-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.question-card {
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.question-header {
  margin-bottom: 1.5rem;
}

.question-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.required-marker {
  color: #ef4444;
  margin-left: 0.25rem;
}

.question-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* 单选和多选组样式 */
.radio-group,
.checkbox-group {
  display: flex;
  gap: 1rem;
}

.radio-group.vertical,
.checkbox-group.vertical {
  flex-direction: column;
}

.radio-group.horizontal,
.checkbox-group.horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.radio-option,
.checkbox-option {
  margin-bottom: 0.5rem;
}

.other-option {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.other-input {
  max-width: 300px;
}

.selection-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

/* 输入框样式 */
.fill-blank-input {
  max-width: 400px;
}

.textarea-input {
  max-width: 600px;
}

/* 评分组件样式 */
.rating-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* 矩阵题样式 */
.matrix-container {
  width: 100%;
}

/* 移动端矩阵样式 */
.matrix-mobile {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.matrix-row-card {
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.matrix-row-title {
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.matrix-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.matrix-option {
  margin-bottom: 0.5rem;
}

/* 桌面端矩阵表格样式 */
.matrix-table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.matrix-header {
  background-color: #f3f4f6;
}

.matrix-cell {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  text-align: center;
}

.matrix-corner {
  background-color: #f9fafb;
}

.matrix-row-header {
  font-weight: 600;
  text-align: left;
  background-color: #f9fafb;
}

.matrix-column-header {
  font-weight: 600;
  font-size: 0.875rem;
}

.matrix-option-cell {
  padding: 0.5rem;
}

/* 导航按钮样式 */
.navigation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.nav-spacer {
  flex: 1;
}

.nav-right {
  display: flex;
  gap: 1rem;
}

.nav-button {
  min-width: 100px;
}

.submit-button {
  font-weight: 600;
}

/* 响应式样式 */
@media (max-width: 767px) {
  .survey-container {
    padding: 0.75rem;
  }

  .survey-title {
    font-size: 1.5rem;
  }

  .question-card {
    padding: 1rem;
  }

  .question-title {
    font-size: 1rem;
  }

  .navigation-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-right {
    width: 100%;
    justify-content: center;
  }

  .nav-button {
    flex: 1;
    max-width: 200px;
  }

  .radio-group.horizontal,
  .checkbox-group.horizontal {
    flex-direction: column;
  }

  .other-option {
    margin-top: 0.5rem;
  }

  .other-input {
    max-width: 100%;
    margin-top: 0.5rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .survey-container {
    padding: 1.5rem;
  }

  .question-card {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .survey-container {
    padding: 2rem;
  }

  .question-card {
    padding: 2rem;
  }
}

/* Element Plus 组件自定义样式 */
:deep(.el-radio) {
  margin-bottom: 8px;
}

:deep(.el-checkbox) {
  margin-bottom: 8px;
}

:deep(.el-rate) {
  display: flex;
  align-items: center;
}

:deep(.el-rate__text) {
  margin-left: 10px;
}
</style>
