import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ShopsExpressApi } from '#/api/shops/express';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('shops.express.name'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '否', value: false },
          { label: '是', value: true },
        ],
        optionType: 'button',
      },
      defaultValue: false,
      fieldName: 'is_default',
      label: $t('shops.express.isDefault'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, class: 'w-full' },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('shops.express.sort'),
      rules: 'required',
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
      label: $t('shops.express.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('shops.express.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('shops.express.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ShopsExpressApi.ExpressVO>,
): VxeTableGridOptions<ShopsExpressApi.ExpressVO>['columns'] {
  return [
    { field: 'id', title: $t('shops.express.id'), width: 80 },
    { field: 'name', title: $t('shops.express.name'), minWidth: 150 },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.YES_NO),
      },
      field: 'is_default',
      title: $t('shops.express.isDefault'),
      width: 100,
    },
    { field: 'sort', title: $t('shops.express.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('shops.express.status'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('shops.express.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('shops.express.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'feeTemplate',
            text: $t('shops.express.feeTemplate'),
          },
          'edit',
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('shops.express.operation'),
      width: 230,
    },
  ];
}
