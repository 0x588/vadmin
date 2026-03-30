import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ShopsExpressFeeApi } from '#/api/shops/express-fee';

import { $t } from '#/locales';
import { areaOption } from '#/utils/areas';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: { show: () => false, triggerFields: ['id'] },
      label: 'id',
    },
    {
      component: 'Input',
      fieldName: 'express_id',
      dependencies: { show: () => false, triggerFields: ['express_id'] },
      label: 'express_id',
    },
    {
      component: 'Input',
      fieldName: 'hasDefault',
      dependencies: { show: () => false, triggerFields: ['hasDefault'] },
      label: 'hasDefault',
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('shops.expressFee.name'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('shops.expressFee.allArea'), value: 1 },
          { label: $t('shops.expressFee.specifiedArea'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      dependencies: {
        show: (values) => !values.hasDefault,
        triggerFields: ['hasDefault'],
      },
      fieldName: 'is_default',
      label: $t('shops.expressFee.isDefault'),
      rules: 'required',
    },
    {
      component: 'Cascader',
      componentProps: {
        class: 'w-full',
        maxTagCount: 'responsive',
        multiple: true,
        options: areaOption,
      },
      dependencies: {
        show: (values) => values.is_default === 0 || values.is_default === false,
        triggerFields: ['is_default'],
      },
      fieldName: 'areas',
      formItemClass: 'col-span-full',
      label: $t('shops.expressFee.areas'),
      rules: 'required',
    },
    {
      component: 'Checkbox',
      defaultValue: false,
      fieldName: 'piece_used',
      label: $t('shops.expressFee.pieceUsed'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      dependencies: {
        show: (values) => values.piece_used,
        triggerFields: ['piece_used'],
      },
      fieldName: 'piece',
      label: $t('shops.expressFee.piece'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.piece_used,
        triggerFields: ['piece_used'],
      },
      fieldName: 'piece_price',
      label: $t('shops.expressFee.piecePrice'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      dependencies: {
        show: (values) => values.piece_used,
        triggerFields: ['piece_used'],
      },
      fieldName: 'piece_more',
      label: $t('shops.expressFee.pieceMore'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.piece_used,
        triggerFields: ['piece_used'],
      },
      fieldName: 'piece_more_price',
      label: $t('shops.expressFee.pieceMorePrice'),
    },
    {
      component: 'Checkbox',
      defaultValue: false,
      fieldName: 'weight_used',
      label: $t('shops.expressFee.weightUsed'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0.01, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.weight_used,
        triggerFields: ['weight_used'],
      },
      fieldName: 'weight',
      label: $t('shops.expressFee.weight'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.weight_used,
        triggerFields: ['weight_used'],
      },
      fieldName: 'weight_price',
      label: $t('shops.expressFee.weightPrice'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0.01, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.weight_used,
        triggerFields: ['weight_used'],
      },
      fieldName: 'weight_more',
      label: $t('shops.expressFee.weightMore'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.weight_used,
        triggerFields: ['weight_used'],
      },
      fieldName: 'weight_more_price',
      label: $t('shops.expressFee.weightMorePrice'),
    },
    {
      component: 'Checkbox',
      defaultValue: false,
      fieldName: 'volume_used',
      label: $t('shops.expressFee.volumeUsed'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0.01, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.volume_used,
        triggerFields: ['volume_used'],
      },
      fieldName: 'volume',
      label: $t('shops.expressFee.volume'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.volume_used,
        triggerFields: ['volume_used'],
      },
      fieldName: 'volume_price',
      label: $t('shops.expressFee.volumePrice'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0.01, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.volume_used,
        triggerFields: ['volume_used'],
      },
      fieldName: 'volume_more',
      label: $t('shops.expressFee.volumeMore'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      dependencies: {
        show: (values) => values.volume_used,
        triggerFields: ['volume_used'],
      },
      fieldName: 'volume_more_price',
      label: $t('shops.expressFee.volumeMorePrice'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, class: 'w-full' },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('shops.expressFee.sort'),
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
      label: $t('shops.expressFee.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('shops.expressFee.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('shops.expressFee.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ShopsExpressFeeApi.ExpressFeeVO>,
): VxeTableGridOptions<ShopsExpressFeeApi.ExpressFeeVO>['columns'] {
  return [
    { field: 'id', title: $t('shops.expressFee.id'), width: 80 },
    { field: 'title', title: $t('shops.expressFee.name'), minWidth: 150 },
    {
      field: 'is_default',
      minWidth: 200,
      slots: { default: 'is_default_slot' },
      title: $t('shops.expressFee.isDefault'),
    },
    { field: 'sort', title: $t('shops.expressFee.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('shops.expressFee.status'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('shops.expressFee.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('shops.expressFee.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('shops.expressFee.operation'),
      width: 130,
    },
  ];
}
