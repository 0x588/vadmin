import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MarketCouponTypeApi } from '#/api/market/coupon-type';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('market.couponType.name'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: $t('market.couponType.remark'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      fieldName: 'at_least',
      label: $t('market.couponType.atLeast'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '金额', value: 1 },
          { label: '折扣', value: 2 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'discount_type',
      label: $t('market.couponType.discountType'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2, class: 'w-full' },
      fieldName: 'discount',
      label: $t('market.couponType.discount'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      fieldName: 'count',
      label: $t('market.couponType.count'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      fieldName: 'max_fetch',
      label: $t('market.couponType.maxFetch'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      fieldName: 'max_fetch_per_day',
      label: $t('market.couponType.maxFetchPerDay'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '不限时', value: 0 },
          { label: '限时', value: 1 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'get_type',
      label: $t('market.couponType.getType'),
    },
    {
      component: 'RangePicker',
      componentProps: { class: 'w-full', showTime: true },
      dependencies: {
        show: (values) => values.get_type === 1,
        triggerFields: ['get_type'],
      },
      fieldName: 'getTimeRange',
      label: $t('market.couponType.getStartTime'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '时间段', value: 0 },
          { label: '天数', value: 1 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'validity_type',
      label: $t('market.couponType.validityType'),
    },
    {
      component: 'RangePicker',
      componentProps: { class: 'w-full', showTime: true },
      dependencies: {
        show: (values) => values.validity_type === 0,
        triggerFields: ['validity_type'],
      },
      fieldName: 'validityTimeRange',
      label: $t('market.couponType.startTime'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      dependencies: {
        show: (values) => values.validity_type === 1,
        triggerFields: ['validity_type'],
      },
      fieldName: 'validity_days',
      label: $t('market.couponType.validityDays'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '全部商品', value: 0 },
          { label: '指定分类', value: 1 },
          { label: '指定商品', value: 2 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'rang_type',
      label: $t('market.couponType.rangType'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'is_new_people',
      label: $t('market.couponType.isNewPeople'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'single_type',
      label: $t('market.couponType.singleType'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('market.couponType.sort'),
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
      label: $t('market.couponType.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('market.couponType.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('market.couponType.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<MarketCouponTypeApi.CouponTypeVO>,
): VxeTableGridOptions<MarketCouponTypeApi.CouponTypeVO>['columns'] {
  return [
    { field: 'id', title: $t('market.couponType.id'), width: 80 },
    { field: 'title', title: $t('market.couponType.name'), minWidth: 150 },
    {
      field: 'discount_type',
      title: $t('market.couponType.discountType'),
      width: 100,
    },
    { field: 'discount', title: $t('market.couponType.discount'), width: 100 },
    { field: 'count', title: $t('market.couponType.count'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('market.couponType.status'),
      width: 100,
    },
    { field: 'sort', title: $t('market.couponType.sort'), width: 80 },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('market.couponType.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('market.couponType.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('market.couponType.operation'),
      width: 130,
    },
  ];
}
