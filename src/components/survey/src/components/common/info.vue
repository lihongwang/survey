<template>
  <Loading v-if="loading" class="size-full h-auto min-h-full" spinning />
  <div class="survey-analysis-container" v-else>
    <el-card class="survey-header">
      <template #header>
        <div class="header-content">
          <h1>{{ survey.title }} - 问卷设计分析</h1>
          <div class="flex gap-2">
            <p v-if="survey.description">{{ survey.description }}</p>
            <div class="survey-settings">
              <el-tag v-if="survey.settings.isPublished" type="success"> 已发布 </el-tag>
              <el-tag v-else type="info">未发布</el-tag>
              <el-tag v-if="survey.settings.allowAnonymous" type="primary"> 允许匿名 </el-tag>
              <el-tag v-if="survey.settings.showProgressBar" type="primary"> 显示进度条 </el-tag>
              <el-tag v-if="survey.settings.showPageTitles" type="primary"> 显示页面标题 </el-tag>
            </div>
            <div class="survey-meta">
              <p>创建时间: {{ formatDate(survey.createdAt) }}</p>
              <p>上次更新: {{ formatDate(survey.updatedAt) }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- 问卷总体统计 -->
      <div class="mt-2">
        <el-row :gutter="20" class="summary-row">
          <el-col :span="6">
            <div class="w-full h-full flex items-center justify-center">
              <el-statistic title="页面数量" :value="survey.pages.length">
                <template #suffix>
                  <el-icon><Document /></el-icon>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="w-full h-full flex items-center justify-center">
              <el-statistic title="问题总数" :value="totalQuestions">
                <template #suffix>
                  <el-icon><QuestionFilled /></el-icon>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="w-full h-full flex items-center justify-center">
              <el-statistic title="必填问题" :value="requiredQuestions">
                <template #suffix>
                  <el-icon><Star /></el-icon>
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="w-full h-full flex items-center justify-center">
              <el-statistic title="选填问题" :value="totalQuestions - requiredQuestions">
                <template #suffix>
                  <el-icon><StarFilled /></el-icon>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 问题类型分布 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h3>问题类型分布</h3>
            </div>
          </template>
          <div ref="questionTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h3>问题类型明细</h3>
            </div>
          </template>
          <el-table :data="questionTypeStats" stripe style="width: 100%">
            <el-table-column prop="type" label="问题类型">
              <template #default="scope">
                <el-tag :type="getQuestionTypeTag(scope.row.type)">{{
                  getQuestionTypeName(scope.row.type)
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="数量" width="120" />
            <el-table-column prop="percentage" label="占比" width="150">
              <template #default="scope">
                <div class="percentage-bar">
                  <div
                    class="percentage-fill"
                    :style="{
                      width: scope.row.percentage + '%',
                      backgroundColor: getQuestionTypeColor(scope.row.type),
                    }"
                  ></div>
                  <span>{{ scope.row.percentage.toFixed(1) }}%</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 每页问题分布 -->
    <el-card class="page-distribution-card">
      <template #header>
        <div class="card-header">
          <h3>各页问题分布</h3>
        </div>
      </template>
      <div ref="pageDistributionChart" class="chart-container"></div>
    </el-card>

    <!-- 详细问题设置分析 -->
    <el-tabs type="border-card" class="detailed-analysis-tabs">
      <el-tab-pane label="选择题分析">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>选择题选项统计</h3>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <div ref="choiceOptionsChart" class="chart-container"></div>
            </el-col>
            <el-col :span="12">
              <el-statistic
                title="单选题平均选项数"
                :value="averageSingleChoiceOptions"
                :precision="1"
              />
              <el-statistic
                title="多选题平均选项数"
                :value="averageMultiChoiceOptions"
                :precision="1"
              />
              <el-statistic
                title="多选题平均最少选择数"
                :value="averageMinSelected"
                :precision="1"
              />
              <el-statistic
                title="多选题平均最多选择数"
                :value="averageMaxSelected"
                :precision="1"
              />
              <el-statistic title="包含'其他'选项的问题数" :value="countWithOtherOption" />
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="填空题分析">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>填空题限制统计</h3>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <div ref="fillBlankChart" class="chart-container"></div>
            </el-col>
            <el-col :span="12">
              <el-statistic title="填空题平均最小长度" :value="averageMinLength" :precision="1" />
              <el-statistic title="填空题平均最大长度" :value="averageMaxLength" :precision="1" />
              <el-statistic title="文本域平均行数" :value="averageTextAreaRows" :precision="1" />
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="评分题分析">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>评分题设置统计</h3>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <div ref="ratingSettingsChart" class="chart-container"></div>
            </el-col>
            <el-col :span="12">
              <el-statistic title="评分题平均最高分" :value="averageMaxScore" :precision="1" />
              <el-statistic title="支持半分的评分题数量" :value="countAllowHalfRating" />
              <el-statistic title="使用星型图标的评分题数量" :value="countStarIconRating" />
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="矩阵题分析">
        <el-card v-if="matrixQuestions.length > 0">
          <template #header>
            <div class="card-header">
              <h3>矩阵题设置统计</h3>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <div ref="matrixSizeChart" class="chart-container"></div>
            </el-col>
            <el-col :span="12">
              <el-statistic title="矩阵题平均行数" :value="averageMatrixRows" :precision="1" />
              <el-statistic title="矩阵题平均列数" :value="averageMatrixColumns" :precision="1" />
              <el-statistic title="矩阵题平均单元格数" :value="averageMatrixCells" :precision="1" />
            </el-col>
          </el-row>
        </el-card>
        <el-empty v-else description="无矩阵题" />
      </el-tab-pane>
    </el-tabs>

    <!-- 问卷复杂度分析 -->
    <el-card class="complexity-card">
      <template #header>
        <div class="card-header">
          <h3>问卷复杂度分析</h3>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="w-full h-full flex items-center justify-center">
            <el-progress type="dashboard" :percentage="complexityScore" :color="complexityColor">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}</span>
                <span class="percentage-label">复杂度</span>
              </template>
            </el-progress>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="complexity-factors">
            <h4>复杂度因素分析</h4>
            <el-table :data="complexityFactors" stripe>
              <el-table-column prop="factor" label="因素" />
              <el-table-column prop="score" label="得分" width="100" />
              <el-table-column prop="description" label="说明" />
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div class="complexity-summary">
        <h4>预估完成时间: {{ estimatedCompletionTime }} 分钟</h4>
        <p>{{ complexityDescription }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Loading from '@/components/loading.vue'
import * as echarts from 'echarts'
import { Document, QuestionFilled, Star, StarFilled } from '@element-plus/icons-vue'
const survey = ref({})
const loading = ref(true)
// 初始化数据
const initData = () => {
  // 解析提供的JSON
  survey.value = {
    id: 'e86f2844-cc1e-4ab6-a54f-13bfebb36933',
    title: '问卷调查',
    description: '',
    createdAt: '2025-05-15T13:03:36.277Z',
    updatedAt: '2025-05-15T13:03:36.280Z',
    settings: {
      isPublished: false,
      allowAnonymous: true,
      showProgressBar: true,
      showPageTitles: true,
    },
    pages: [],
  }
  console.log(survey.value)
  // 添加页面数据
  survey.value.pages = [
    {
      id: '8b36d575-0ea5-4951-9a43-21a91f552518',
      title: 'page1',
      description: '',
      questions: [
        {
          id: 'e7883ca9-5dc4-40a0-837f-c568785ae67f',
          name: 'fruits',
          type: 'MultipleChoice',
          title: '您喜欢的水果有哪些?',
          required: true,
          description: '可多选',
          layout: 'vertical',
          minSelected: 1,
          maxSelected: 3,
          options: [
            { value: 'apple', label: '苹果' },
            { value: 'banana', label: '香蕉' },
            { value: 'orange', label: '橙子' },
            { value: 'grape', label: '葡萄' },
            { value: 'watermelon', label: '西瓜' },
          ],
        },
        {
          id: '5d8cfaa2-c0f7-4099-81f6-94aeb9f5ce2f',
          name: 'gender',
          type: 'SingleChoice',
          title: '您的性别是?',
          required: true,
          description: '请选择您的性别',
          layout: 'horizontal',
          options: [
            { value: 'male', label: '男' },
            { value: 'female', label: '女' },
            { value: 'other', label: '其他' },
          ],
        },
        {
          id: '1c849bfe-375f-4bb8-801c-c2da8a23940f',
          name: 'name',
          type: 'FillBlank',
          title: '请输入您的姓名',
          required: true,
          description: '用于证书发放',
          placeholder: '请输入真实姓名',
          minLength: 2,
          maxLength: 20,
        },
        {
          id: '34b3aea4-0a86-4b27-b899-0285e3988282',
          name: 'rating',
          type: 'Rating',
          title: '您对本次活动的评分',
          required: true,
          description: '请对本次活动进行评价',
          maxScore: 5,
          allowHalf: true,
          iconType: 'star',
        },
        {
          id: 'da406b16-ce41-4ca2-90c2-0807f29dd267',
          name: 'favoriteColor',
          type: 'SingleChoice',
          title: '您最喜欢的颜色是?',
          required: true,
          description: '请选择一个您最喜欢的颜色',
          layout: 'vertical',
          options: [
            { value: 'red', label: '红色' },
            { value: 'blue', label: '蓝色' },
            { value: 'green', label: '绿色' },
            { value: 'yellow', label: '黄色' },
            { value: 'purple', label: '紫色' },
          ],
          hasOther: true,
        },
      ],
    },
    {
      id: 'bb00a22e-c265-4c5b-baef-da6377de40b0',
      title: 'page2',
      description: '',
      questions: [
        {
          id: 'cb0b7ada-6196-464b-977c-ed6cc79aa465',
          name: 'fruits',
          type: 'MultipleChoice',
          title: '您喜欢的水果有哪些?',
          required: true,
          description: '可多选',
          layout: 'vertical',
          minSelected: 1,
          maxSelected: 3,
          options: [
            { value: 'apple', label: '苹果' },
            { value: 'banana', label: '香蕉' },
            { value: 'orange', label: '橙子' },
            { value: 'grape', label: '葡萄' },
            { value: 'watermelon', label: '西瓜' },
          ],
          hasOther: false,
        },
        {
          id: 'bf62167a-ea48-4fe2-a309-1ffd8157edf3',
          name: 'userName',
          type: 'FillBlank',
          title: '请输入您的姓名',
          required: true,
          description: '请使用真实姓名',
          placeholder: '请在此输入您的姓名',
          minLength: 2,
          maxLength: 20,
        },
        {
          id: '3cfbcfeb-5f2f-45e6-98d2-790cbfc6f993',
          name: 'feedback',
          type: 'TextArea',
          title: '请提供您对产品的反馈意见',
          required: false,
          description: '您的反馈对我们非常重要',
          placeholder: '请详细描述您的使用体验和建议',
          rows: 5,
          maxLength: 500,
        },
        {
          id: '220ecdc4-628b-4c1b-ad8d-e9971128ade5',
          name: 'serviceRating',
          type: 'Rating',
          title: '请对我们的服务进行评分',
          required: true,
          description: '1分为非常不满意，5分为非常满意',
          maxRating: 5,
          allowHalf: true,
          defaultValue: 0,
        },
        {
          id: '717f1b77-a69c-4b14-964d-6731ce657850',
          name: 'productFeedback',
          type: 'MatrixChoice',
          title: '请对以下产品特性进行评价',
          required: true,
          description: '请为每个特性选择一个评价',
          rows: [
            { value: 'ui', label: '用户界面' },
            { value: 'performance', label: '性能表现' },
            { value: 'reliability', label: '可靠性' },
            { value: 'features', label: '功能完整性' },
          ],
          columns: [
            { value: 'veryBad', label: '非常差' },
            { value: 'bad', label: '较差' },
            { value: 'neutral', label: '一般' },
            { value: 'good', label: '较好' },
            { value: 'veryGood', label: '非常好' },
          ],
        },
      ],
    },
  ]
}

// 日期格式化
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 获取所有问题
const allQuestions = computed(() => {
  const questions = []
  if (survey.value.pages) {
    survey.value.pages.forEach((page) => {
      if (page.questions) {
        questions.push(...page.questions)
      }
    })
  }
  return questions
})

// 问题总数
const totalQuestions = computed(() => allQuestions.value.length)

// 必填问题数量
const requiredQuestions = computed(() => {
  return allQuestions.value.filter((q) => q.required).length
})

// 按类型分类的问题
const questionsByType = computed(() => {
  const result = {}
  allQuestions.value.forEach((q) => {
    if (!result[q.type]) {
      result[q.type] = []
    }
    result[q.type].push(q)
  })
  return result
})

// 问题类型统计
const questionTypeStats = computed(() => {
  const stats = []
  const types = Object.keys(questionsByType.value)
  types.forEach((type) => {
    stats.push({
      type,
      count: questionsByType.value[type].length,
      percentage: (questionsByType.value[type].length / totalQuestions.value) * 100,
    })
  })
  return stats.sort((a, b) => b.count - a.count)
})

// 获取问题类型的显示名称
const getQuestionTypeName = (type) => {
  const typeMap = {
    SingleChoice: '单选题',
    MultipleChoice: '多选题',
    FillBlank: '填空题',
    TextArea: '文本框',
    Rating: '评分题',
    MatrixChoice: '矩阵题',
  }
  return typeMap[type] || type
}

// 获取问题类型的标签类型
const getQuestionTypeTag = (type) => {
  const tagMap = {
    SingleChoice: 'success',
    MultipleChoice: 'primary',
    FillBlank: 'info',
    TextArea: 'warning',
    Rating: 'danger',
    MatrixChoice: '',
  }
  return tagMap[type] || ''
}

// 获取问题类型的颜色
const getQuestionTypeColor = (type) => {
  const colorMap = {
    SingleChoice: '#67C23A',
    MultipleChoice: '#409EFF',
    FillBlank: '#909399',
    TextArea: '#E6A23C',
    Rating: '#F56C6C',
    MatrixChoice: '#9B59B6',
  }
  return colorMap[type] || '#000000'
}

// 单选题问题
const singleChoiceQuestions = computed(() => {
  return questionsByType.value['SingleChoice'] || []
})

// 多选题问题
const multiChoiceQuestions = computed(() => {
  return questionsByType.value['MultipleChoice'] || []
})

// 填空题问题
const fillBlankQuestions = computed(() => {
  return questionsByType.value['FillBlank'] || []
})

// 文本框问题
const textAreaQuestions = computed(() => {
  return questionsByType.value['TextArea'] || []
})

// 评分题问题
const ratingQuestions = computed(() => {
  return questionsByType.value['Rating'] || []
})

// 矩阵题问题
const matrixQuestions = computed(() => {
  return questionsByType.value['MatrixChoice'] || []
})

// 单选题平均选项数
const averageSingleChoiceOptions = computed(() => {
  if (singleChoiceQuestions.value.length === 0) return 0
  const totalOptions = singleChoiceQuestions.value.reduce(
    (sum, q) => sum + (q.options ? q.options.length : 0),
    0,
  )
  return totalOptions / singleChoiceQuestions.value.length
})

// 多选题平均选项数
const averageMultiChoiceOptions = computed(() => {
  if (multiChoiceQuestions.value.length === 0) return 0
  const totalOptions = multiChoiceQuestions.value.reduce(
    (sum, q) => sum + (q.options ? q.options.length : 0),
    0,
  )
  return totalOptions / multiChoiceQuestions.value.length
})

// 多选题平均最少选择数
const averageMinSelected = computed(() => {
  if (multiChoiceQuestions.value.length === 0) return 0
  const totalMin = multiChoiceQuestions.value.reduce((sum, q) => sum + (q.minSelected || 1), 0)
  return totalMin / multiChoiceQuestions.value.length
})

// 多选题平均最多选择数
const averageMaxSelected = computed(() => {
  if (multiChoiceQuestions.value.length === 0) return 0
  const totalMax = multiChoiceQuestions.value.reduce((sum, q) => sum + (q.maxSelected || 1), 0)
  return totalMax / multiChoiceQuestions.value.length
})

// 包含"其他"选项的问题数
const countWithOtherOption = computed(() => {
  return allQuestions.value.filter((q) => q.hasOther).length
})

// 填空题平均最小长度
const averageMinLength = computed(() => {
  const questions = [...fillBlankQuestions.value]
  if (questions.length === 0) return 0
  const totalMin = questions.reduce((sum, q) => sum + (q.minLength || 0), 0)
  return totalMin / questions.length
})

// 填空题平均最大长度
const averageMaxLength = computed(() => {
  const questions = [...fillBlankQuestions.value, ...textAreaQuestions.value]
  if (questions.length === 0) return 0
  const totalMax = questions.reduce((sum, q) => sum + (q.maxLength || 100), 0)
  return totalMax / questions.length
})

// 文本域平均行数
const averageTextAreaRows = computed(() => {
  if (textAreaQuestions.value.length === 0) return 0
  const totalRows = textAreaQuestions.value.reduce((sum, q) => sum + (q.rows || 3), 0)
  return totalRows / textAreaQuestions.value.length
})

// 评分题平均最高分
const averageMaxScore = computed(() => {
  if (ratingQuestions.value.length === 0) return 0
  const totalMax = ratingQuestions.value.reduce(
    (sum, q) => sum + (q.maxScore || q.maxRating || 5),
    0,
  )
  return totalMax / ratingQuestions.value.length
})

// 支持半分的评分题数量
const countAllowHalfRating = computed(() => {
  return ratingQuestions.value.filter((q) => q.allowHalf).length
})

// 使用星型图标的评分题数量
const countStarIconRating = computed(() => {
  return ratingQuestions.value.filter((q) => q.iconType === 'star').length
})

// 矩阵题平均行数
const averageMatrixRows = computed(() => {
  if (matrixQuestions.value.length === 0) return 0
  const totalRows = matrixQuestions.value.reduce((sum, q) => sum + (q.rows ? q.rows.length : 0), 0)
  return totalRows / matrixQuestions.value.length
})

// 矩阵题平均列数
const averageMatrixColumns = computed(() => {
  if (matrixQuestions.value.length === 0) return 0
  const totalCols = matrixQuestions.value.reduce(
    (sum, q) => sum + (q.columns ? q.columns.length : 0),
    0,
  )
  return totalCols / matrixQuestions.value.length
})

// 矩阵题平均单元格数
const averageMatrixCells = computed(() => {
  if (matrixQuestions.value.length === 0) return 0
  const totalCells = matrixQuestions.value.reduce((sum, q) => {
    const rowCount = q.rows ? q.rows.length : 0
    const colCount = q.columns ? q.columns.length : 0
    return sum + rowCount * colCount
  }, 0)
  return totalCells / matrixQuestions.value.length
})

// 问卷复杂度计算
const complexityScore = computed(() => {
  // 基础分数
  let score = 0

  // 问题数量因素 (最高30分)
  score += Math.min(totalQuestions.value * 3, 30)

  // 问题类型多样性 (最高20分)
  score += Math.min(Object.keys(questionsByType.value).length * 4, 20)

  // 必填问题比例 (最高15分)
  const requiredRatio = requiredQuestions.value / totalQuestions.value
  score += Math.round(requiredRatio * 15)

  // 评分题和矩阵题额外复杂度 (最高15分)
  const complexQuestions = ratingQuestions.value.length + matrixQuestions.value.length
  score += Math.min(complexQuestions * 3, 15)

  // 文本输入题复杂度 (最高10分)
  const textQuestions = fillBlankQuestions.value.length + textAreaQuestions.value.length
  score += Math.min(textQuestions * 2, 10)

  // 多选题复杂度 (根据选项数和限制) (最高10分)
  const multiChoiceComplexity = multiChoiceQuestions.value.reduce((sum, q) => {
    const optionCount = q.options ? q.options.length : 0
    const hasLimits = q.minSelected || q.maxSelected
    return sum + optionCount * 0.5 + (hasLimits ? 1 : 0)
  }, 0)
  score += Math.min(multiChoiceComplexity, 10)

  return Math.min(Math.round(score), 100)
})

// 复杂度颜色
const complexityColor = computed(() => {
  if (complexityScore.value < 30) return '#67C23A' // 简单 - 绿色
  if (complexityScore.value < 60) return '#E6A23C' // 中等 - 黄色
  return '#F56C6C' // 复杂 - 红色
})

// 复杂度因素分析
const complexityFactors = computed(() => {
  return [
    {
      factor: '问题数量',
      score: Math.min(totalQuestions.value * 3, 30),
      description: `共${totalQuestions.value}个问题，每个问题计3分，最高30分`,
    },
    {
      factor: '问题类型多样性',
      score: Math.min(Object.keys(questionsByType.value).length * 4, 20),
      description: `使用了${
        Object.keys(questionsByType.value).length
      }种问题类型，每种类型计4分，最高20分`,
    },
    {
      factor: '必填问题比例',
      score: Math.round((requiredQuestions.value / totalQuestions.value) * 15),
      description: `必填题占比${Math.round(
        (requiredQuestions.value / totalQuestions.value) * 100,
      )}%，按比例计算最高15分`,
    },
    {
      factor: '复杂题型使用',
      score: Math.min((ratingQuestions.value.length + matrixQuestions.value.length) * 3, 15),
      description: `使用了${ratingQuestions.value.length}个评分题和${matrixQuestions.value.length}个矩阵题，每个计3分，最高15分`,
    },
    {
      factor: '文本输入题',
      score: Math.min((fillBlankQuestions.value.length + textAreaQuestions.value.length) * 2, 10),
      description: `使用了${
        fillBlankQuestions.value.length + textAreaQuestions.value.length
      }个文本输入题，每个计2分，最高10分`,
    },
    {
      factor: '多选题复杂度',
      score: Math.min(
        multiChoiceQuestions.value.reduce((sum, q) => {
          const optionCount = q.options ? q.options.length : 0
          const hasLimits = q.minSelected || q.maxSelected
          return sum + optionCount * 0.5 + (hasLimits ? 1 : 0)
        }, 0),
        10,
      ),
      description: `基于多选题选项数量和选择限制计算，最高10分`,
    },
  ]
})

// 复杂度描述
const complexityDescription = computed(() => {
  if (complexityScore.value < 30) {
    return '该问卷设计较为简单，受访者可以轻松完成，预计将获得较高的完成率。可考虑适当增加一些问题类型以收集更多维度的数据。'
  } else if (complexityScore.value < 60) {
    return '该问卷设计难度适中，平衡了数据收集的全面性和用户体验。可以考虑检查问卷逻辑流程，确保受访者能够顺畅完成。'
  } else {
    return '该问卷设计较为复杂，包含多种题型和较多必填题。建议检查是否可以简化某些问题，或分成多个页面，以提高完成率。'
  }
})

// 预估完成时间（分钟）
const estimatedCompletionTime = computed(() => {
  // 基础时间
  let baseTime = 0.5 // 基础0.5分钟

  // 根据问题类型和数量计算时间
  baseTime += singleChoiceQuestions.value.length * 0.3 // 每个单选题0.3分钟
  baseTime += multiChoiceQuestions.value.length * 0.5 // 每个多选题0.5分钟
  baseTime += fillBlankQuestions.value.length * 0.5 // 每个填空题0.5分钟
  baseTime += textAreaQuestions.value.length * 1.0 // 每个文本框1分钟
  baseTime += ratingQuestions.value.length * 0.3 // 每个评分题0.3分钟
  baseTime += matrixQuestions.value.reduce((sum, q) => {
    const rowCount = q.rows ? q.rows.length : 0
    return sum + rowCount * 0.2 // 矩阵题按行数计算，每行0.2分钟
  }, 0)

  return Math.max(1, Math.round(baseTime * 10) / 10)
})

// 图表引用
const questionTypeChart = ref(null)
const pageDistributionChart = ref(null)
const choiceOptionsChart = ref(null)
const fillBlankChart = ref(null)
const ratingSettingsChart = ref(null)
const matrixSizeChart = ref(null)

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 问题类型分布图
    if (questionTypeChart.value) {
      const chart = echarts.init(questionTypeChart.value)
      const typeData = questionTypeStats.value.map((item) => ({
        name: getQuestionTypeName(item.type),
        value: item.count,
        itemStyle: { color: getQuestionTypeColor(item.type) },
      }))

      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: typeData.map((item) => item.name),
        },
        series: [
          {
            name: '问题类型',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            data: typeData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      })

      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    // 各页问题分布图
    if (pageDistributionChart.value) {
      const chart = echarts.init(pageDistributionChart.value)
      const pageData = survey.value.pages.map((page, index) => {
        const questions = page.questions || []
        return {
          name: page.title || `页面${index + 1}`,
          requiredCount: questions.filter((q) => q.required).length,
          optionalCount: questions.filter((q) => !q.required).length,
        }
      })

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['必填问题', '选填问题'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: pageData.map((item) => item.name),
        },
        yAxis: {
          type: 'value',
          name: '问题数量',
        },
        series: [
          {
            name: '必填问题',
            type: 'bar',
            stack: 'total',
            label: { show: true },
            emphasis: { focus: 'series' },
            data: pageData.map((item) => item.requiredCount),
            itemStyle: { color: '#F56C6C' },
          },
          {
            name: '选填问题',
            type: 'bar',
            stack: 'total',
            label: { show: true },
            emphasis: { focus: 'series' },
            data: pageData.map((item) => item.optionalCount),
            itemStyle: { color: '#67C23A' },
          },
        ],
      })

      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    // 选择题选项统计图
    if (choiceOptionsChart.value) {
      const chart = echarts.init(choiceOptionsChart.value)
      const optionCounts = [
        { name: '单选题', value: averageSingleChoiceOptions.value },
        { name: '多选题', value: averageMultiChoiceOptions.value },
      ]

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        xAxis: {
          type: 'category',
          data: optionCounts.map((item) => item.name),
        },
        yAxis: {
          type: 'value',
          name: '平均选项数',
        },
        series: [
          {
            type: 'bar',
            data: optionCounts.map((item) => ({
              value: item.value,
              itemStyle: {
                color: item.name === '单选题' ? '#67C23A' : '#409EFF',
              },
            })),
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
            },
          },
        ],
      })

      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    // 填空题限制统计图
    if (
      fillBlankChart.value &&
      (fillBlankQuestions.value.length > 0 || textAreaQuestions.value.length > 0)
    ) {
      const chart = echarts.init(fillBlankChart.value)

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        xAxis: {
          type: 'category',
          data: ['最小长度', '最大长度'],
        },
        yAxis: {
          type: 'value',
          name: '字符数',
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                value: averageMinLength.value,
                itemStyle: { color: '#909399' },
              },
              {
                value: averageMaxLength.value,
                itemStyle: { color: '#E6A23C' },
              },
            ],
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
            },
          },
        ],
      })

      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    // 评分题设置统计图
    if (ratingSettingsChart.value && ratingQuestions.value.length > 0) {
      const chart = echarts.init(ratingSettingsChart.value)

      chart.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '评分题设置',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            data: [
              {
                name: '支持半分',
                value: countAllowHalfRating.value,
                itemStyle: { color: '#F56C6C' },
              },
              {
                name: '不支持半分',
                value: ratingQuestions.value.length - countAllowHalfRating.value,
                itemStyle: { color: '#E6A23C' },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      })

      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    // 矩阵题尺寸统计图
    if (matrixSizeChart.value && matrixQuestions.value.length > 0) {
      const chart = echarts.init(matrixSizeChart.value)

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        xAxis: {
          type: 'category',
          data: ['平均行数', '平均列数', '平均单元格数'],
        },
        yAxis: {
          type: 'value',
          name: '数量',
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                value: averageMatrixRows.value,
                itemStyle: { color: '#9B59B6' },
              },
              {
                value: averageMatrixColumns.value,
                itemStyle: { color: '#9B59B6' },
              },
              {
                value: averageMatrixCells.value,
                itemStyle: { color: '#9B59B6' },
              },
            ],
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
            },
          },
        ],
      })

      window.addEventListener('resize', () => {
        chart.resize()
      })
    }
  })
}

// 初始化
onMounted(() => {
  console.log(121212)
  try {
    loading.value = true
    initData()
    initCharts()
    loading.value = false
  } catch (error) {
    console.error('Error initializing charts:', error)
  }
})
</script>

<style scoped>
.survey-analysis-container {
  @apply h-full overflow-auto;
  padding: 20px;
}

.survey-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.survey-meta {
  text-align: right;
}

.survey-settings {
  margin-top: 10px;
}

.survey-settings .el-tag {
  margin-right: 8px;
}

.summary-row {
  margin-bottom: 20px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 100%;
}

.chart-container {
  height: 300px;
}

.page-distribution-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detailed-analysis-tabs {
  margin-bottom: 20px;
}

.complexity-card {
  margin-bottom: 20px;
}

.percentage-bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 16px;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.percentage-fill {
  height: 100%;
  border-radius: 8px;
}

.percentage-bar span {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #333;
}

.complexity-factors {
  margin-bottom: 20px;
}

.complexity-summary {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.percentage-value {
  font-size: 28px;
  font-weight: bold;
  display: block;
}

.percentage-label {
  font-size: 14px;
  color: #909399;
}
</style>
