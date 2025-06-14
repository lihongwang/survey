export const getCurrentFieldPath = (field: any) => {
  return field.path.segments.slice(0, field.path.segments.length - 1).join('.');
};
export const updateParentValue = (field: any, form: any, data: any) => {
  form.setFieldState(field.path.pop(), {
    value: data,
  });
};
export const getParentPath = (field: any) => {
  return field.path.parent().entire;
};
export const getFormTableItemParenPath = (field: any) => {
  return field.path.parent().entire;
};
export const getFormTableItem = (field: any) => {
  const parentPath = getFormTableItemParenPath(field);
  return field.form.getValuesIn(parentPath);
};
