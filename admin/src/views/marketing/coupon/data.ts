import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MarketCouponApi } from '#/api/market/coupon';

import { h } from 'vue';

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
    {
      field: 'member_id',
      title: $t('market.coupon.memberId'),
      width: 160,
      slots: {
        default: ({ row }) => {
          const member = row.member || {};
          return [
            h('div', [`${member.nickname || ''} ID:${row.member_id || ''}`]),
            h('div', member.phone || ''),
          ];
        },
      },
    },
    {
      field: 'discount_type',
      title: $t('market.coupon.discountType'),
      width: 150,
      slots: {
        default: ({ row }) => {
          const threshold =
            row.at_least > 0 ? `满${row.at_least}元 ` : '无门槛 ';
          const discount =
            row.discount_type === 1
              ? `减${row.discount}元`
              : `打${row.discount}折`;
          return [h('span', threshold + discount)];
        },
      },
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
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.YES_NO),
      },
      field: 'single_type',
      title: $t('market.coupon.singleType'),
      width: 100,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.COUPON_STATE),
      },
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
