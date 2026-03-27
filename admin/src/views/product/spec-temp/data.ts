import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductSpecTempApi } from '#/api/product/spec-temp';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('product.specTemp.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('product.specTemp.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ProductSpecTempApi.CommonSpecTemplateVO>,
): VxeTableGridOptions<ProductSpecTempApi.CommonSpecTemplateVO>['columns'] {
  return [
    { field: 'id', title: $t('product.specTemp.id'), width: 80 },
    { field: 'title', title: $t('product.specTemp.name'), minWidth: 150 },
    {
      field: 'specIds',
      title: $t('product.specTemp.specIds'),
      minWidth: 200,
      slots: {
        default: ({ row }) => {
          const ids = row.specIds ? String(row.specIds).split(',') : [];
          return ids.map((id: string) => h(Tag, { color: 'blue' }, () => id));
        },
      },
    },
    { field: 'sort', title: $t('product.specTemp.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('product.specTemp.status'),
      width: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('product.specTemp.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('product.specTemp.operation'),
      width: 130,
    },
  ];
}
