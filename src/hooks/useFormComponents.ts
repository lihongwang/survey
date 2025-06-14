import {
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTable,
  ArrayTabs,
  Checkbox,
  DatePicker,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  FormTab,
  Input,
  InputNumber,
  Password,
  Radio,
  Select,
  Space,
  Switch,
  Upload,
} from '@formily/element-plus'

// Formily 内置组件

// 自定义组件

export interface FormComponents {
  [key: string]: any
}

// 基础组件集合
const baseComponents: FormComponents = {
  Input,
  Password,
  FormTab,
  DatePicker,
  Radio,
  InputNumber,
  Checkbox,
  Switch,
  Upload,
  FormCollapse,
  Select,
  Space,
  ArrayCards,
  ArrayCollapse,
  ArrayItems,
  ArrayTable,
  ArrayTabs,
  FormGrid,
  FormItem,
  FormLayout,
}

// 默认组件集合
const defaultComponents: FormComponents = {
  ...baseComponents,
}

export const useFormComponents = () => {
  // 创建组件配置
  const createComponentsConfig = (userComponents: FormComponents = {}) => {
    return {
      ...defaultComponents,
      ...userComponents,
    }
  }

  // 创建表单作用域
  const createFormScope = (userScope: Record<string, any> = {}) => {
    return {
      ...userScope,
    }
  }

  // 获取组件类别
  const getComponentsByCategory = () => {
    return {
      base: baseComponents,
    }
  }

  return {
    defaultComponents,
    createComponentsConfig,
    createFormScope,
    getComponentsByCategory,
  }
}
