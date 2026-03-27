import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductServeApi } from '#/api/product/serve';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('product.serve.name'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'cover',
      label: $t('product.serve.cover'),
    },
    {
      component: 'Input',
      fieldName: 'explain',
      label: $t('product.serve.explain'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, class: 'w-full' },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('product.serve.sort'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('product.serve.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('product.serve.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('product.serve.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ProductServeApi.ServeVO>,
): VxeTableGridOptions<ProductServeApi.ServeVO>['columns'] {
  return [
    { field: 'id', title: $t('product.serve.id'), width: 80 },
    { field: 'name', title: $t('product.serve.name'), minWidth: 150 },
    { field: 'explain', title: $t('product.serve.explain'), minWidth: 200 },
    { field: 'sort', title: $t('product.serve.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('product.serve.status'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('product.serve.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('product.serve.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('product.serve.operation'),
      width: 130,
    },
  ];
}
