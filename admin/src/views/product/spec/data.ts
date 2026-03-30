import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductSpecApi } from '#/api/product/spec';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('product.spec.name'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SPEC_TYPE, 'string'),
      },
      fieldName: 'type',
      label: $t('product.spec.type'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'desc',
      label: $t('product.spec.desc'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, class: 'w-full' },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('product.spec.sort'),
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
      label: $t('product.spec.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('product.spec.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('product.spec.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ProductSpecApi.CommonSpecVO>,
): VxeTableGridOptions<ProductSpecApi.CommonSpecVO>['columns'] {
  return [
    { field: 'title', title: $t('product.spec.name'), minWidth: 150 },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.SPEC_TYPE),
      },
      field: 'type',
      title: $t('product.spec.type'),
      width: 100,
    },
    {
      field: 'values',
      title: $t('product.spec.values'),
      minWidth: 200,
      slots: {
        default: ({ row }) => {
          const values = row.values || [];
          return values.map((v: any) =>
            h(Tag, { color: 'blue' }, () => v.title),
          );
        },
      },
    },
    { field: 'desc', title: $t('product.spec.desc'), width: 150 },
    { field: 'sort', title: $t('product.spec.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('product.spec.status'),
      width: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('product.spec.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('product.spec.operation'),
      width: 130,
    },
  ];
}
