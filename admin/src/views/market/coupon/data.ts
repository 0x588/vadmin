import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MarketCouponApi } from '#/api/market/coupon';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('market.coupon.couponTitle'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('market.coupon.state'),
    },
  ];
}

export function useColumns(): VxeTableGridOptions<MarketCouponApi.CouponVO>['columns'] {
  return [
    { field: 'id', title: $t('market.coupon.id'), width: 80 },
    { field: 'title', title: $t('market.coupon.couponTitle'), minWidth: 150 },
    { field: 'member_id', title: $t('market.coupon.memberId'), width: 120 },
    {
      field: 'discount_type',
      title: $t('market.coupon.discountType'),
      width: 120,
    },
    {
      field: 'end_time',
      title: $t('market.coupon.endTime'),
      width: 180,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
    },
    { field: 'single_type', title: $t('market.coupon.singleType'), width: 100 },
    {
      cellRender: { name: 'CellTag' },
      field: 'state',
      title: $t('market.coupon.state'),
      width: 100,
    },
    {
      field: 'fetch_time',
      title: $t('market.coupon.fetchTime'),
      width: 180,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
    },
  ];
}
