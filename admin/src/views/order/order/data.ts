import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OrderApi } from '#/api/order/order';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export const ORDER_STATUS_TABS = [
  { label: 'statusAll', value: '' },
  { label: 'statusPending', value: '0' },
  { label: 'statusPaid', value: '1' },
  { label: 'statusPartShipped', value: '19' },
  { label: 'statusShipped', value: '20' },
  { label: 'statusReceived', value: '30' },
  { label: 'statusCompleted', value: '40' },
  { label: 'statusRefundApply', value: '-10' },
  { label: 'statusRefunding', value: '-11' },
  { label: 'statusRefunded', value: '-12' },
  { label: 'statusClosed', value: '-20' },
];

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'order_sn',
      label: $t('order.order.orderSn'),
    },
    {
      component: 'Input',
      fieldName: 'out_trade_no',
      label: $t('order.order.outTradeNo'),
    },
    {
      component: 'Input',
      fieldName: 'buyer_id',
      label: $t('order.order.buyerId'),
    },
    {
      component: 'Input',
      fieldName: 'order_type',
      label: $t('order.order.orderType'),
    },
    {
      component: 'Input',
      fieldName: 'order_from',
      label: $t('order.order.orderFrom'),
    },
    {
      component: 'Input',
      fieldName: 'payment_type',
      label: $t('order.order.paymentType'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createdTime',
      label: $t('order.order.createdAt'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<OrderApi.OrderVO>,
): VxeTableGridOptions<OrderApi.OrderVO>['columns'] {
  return [
    { field: 'order_sn', title: $t('order.order.orderSn'), minWidth: 180 },
    {
      field: 'buyer_nickname',
      title: $t('order.order.buyerNickname'),
      width: 120,
    },
    { field: 'pay_money', title: $t('order.order.payMoney'), width: 100 },
    {
      field: 'out_trade_no',
      title: $t('order.order.outTradeNo'),
      width: 180,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.PAY_TYPE),
      },
      field: 'payment_type',
      title: $t('order.order.paymentType'),
      width: 100,
    },
    {
      field: 'shipping_type',
      title: $t('order.order.shippingType'),
      width: 100,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.ORDER_STATUS),
      },
      field: 'order_status',
      title: $t('order.order.orderStatus'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('order.order.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'order_sn',
          nameTitle: $t('order.order.orderSn'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('order.order.operation'),
      width: 130,
    },
  ];
}

export function useProductColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'product_name',
      title: $t('order.order.productName'),
      minWidth: 150,
    },
    { field: 'price', title: $t('order.order.price'), width: 100 },
    { field: 'num', title: $t('order.order.num'), width: 80 },
    {
      field: 'product_money',
      title: $t('order.order.productMoney'),
      width: 100,
    },
  ];
}
