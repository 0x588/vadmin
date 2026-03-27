import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductAttributeApi } from '#/api/product/attribute';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('product.attribute.name'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, class: 'w-full' },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('product.attribute.sort'),
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
      label: $t('product.attribute.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('product.attribute.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('product.attribute.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ProductAttributeApi.CommonAttributeVO>,
): VxeTableGridOptions<ProductAttributeApi.CommonAttributeVO>['columns'] {
  return [
    { field: 'id', title: $t('product.attribute.id'), width: 80 },
    { field: 'title', title: $t('product.attribute.name'), minWidth: 150 },
    {
      field: 'values',
      title: $t('product.attribute.values'),
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
    { field: 'sort', title: $t('product.attribute.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('product.attribute.status'),
      width: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('product.attribute.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('product.attribute.operation'),
      width: 130,
    },
  ];
}
