/*
 * 处理form json scheme的properties
 *
 */

import classnames from 'classnames';

// 循环遍历properties，为property添加className 方便后续css更改布局
export interface IFormatProperties {
  properties: any;
  format: (property: any, key: string) => any; // 根节点property 处理函数
  level?: number;
}
export const doProperties = ({
  properties,
  format,
  level = 0,
}: IFormatProperties) => {
  level++;
  for (const key in properties) {
    if (properties[key].properties) {
      const property = properties[key];
      const componentsProps = property['x-component-props'] || {};
      properties[key] = {
        ...property,
        'x-component-props': {
          ...componentsProps,
          className: classnames(
            componentsProps.className,
            'property-' + key,
            'property-level-' + level,
            'property-tree'
          ),
        },
      };
      doProperties({ properties: properties[key].properties, format, level });
    } else {
      const property = format(properties[key], key);
      const decoratorProps = property['x-decorator-props'] || {};
      properties[key] = {
        ...property,
        'x-decorator-props': {
          ...decoratorProps,
          className: classnames(
            decoratorProps.className,
            'property-' + key,
            'property-level-' + level,
            'property-child'
          ),
        },
      };
    }
  }
  return properties;
};

export const fillLabelWidth = (properties: any, labelWidth: string | number) => {
  for (const key in properties) {
    if (properties[key].properties) {
      fillLabelWidth(properties[key].properties, labelWidth);
    } else {
      properties[key]['x-decorator-props'] = {
        labelWidth,
        labelAlign: 'left',
        ...properties[key]['x-decorator-props'],
      };
    }
  }
  return properties;
};