import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MarketCouponTypeApi } from '#/api/market/coupon-type';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

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
      defaultValue: 0,
      fieldName: 'at_least',
      label: $t('market.couponType.atLeast'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '优惠金额', value: 1 },
          { label: '折扣', value: 2 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'discount_type',
      label: $t('market.couponType.discountType'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0.01, precision: 2, class: 'w-full' },
      description:
        '金额类型填减免金额；折扣类型范围0-9.9，0为全部抵扣，9.9为优惠百分之一',
      fieldName: 'discount',
      label: $t('market.couponType.discount'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      fieldName: 'count',
      label: $t('market.couponType.count'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      defaultValue: 0,
      description: '输入0表示无限制',
      fieldName: 'max_fetch',
      label: $t('market.couponType.maxFetch'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      defaultValue: 0,
      description: '输入0表示无限制',
      fieldName: 'max_fetch_per_day',
      label: $t('market.couponType.maxFetchPerDay'),
      rules: 'required',
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
      rules: 'required',
    },
    {
      component: 'RangePicker',
      componentProps: {
        class: 'w-full',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
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
      rules: 'required',
    },
    {
      component: 'RangePicker',
      componentProps: {
        class: 'w-full',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      dependencies: {
        show: (values) => values.validity_type === 0,
        triggerFields: ['validity_type'],
      },
      fieldName: 'validityTimeRange',
      label: $t('market.couponType.startTime'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 1, precision: 0, class: 'w-full' },
      dependencies: {
        show: (values) => values.validity_type === 1,
        triggerFields: ['validity_type'],
      },
      fieldName: 'validity_days',
      label: $t('market.couponType.validityDays'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '全部商品', value: 0 },
          { label: '指定商品', value: 1 },
          { label: '指定分类', value: 2 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'rang_type',
      label: $t('market.couponType.rangType'),
      rules: 'required',
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
      description: '未下单支付用户可领',
      fieldName: 'is_new_people',
      label: $t('market.couponType.isNewPeople'),
      rules: 'required',
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
      description:
        '"是"取符合商品中最高价的一个进行抵扣，"否"则是符合的商品累加价格进行抵扣',
      fieldName: 'single_type',
      label: $t('market.couponType.singleType'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0, class: 'w-full' },
      defaultValue: 6,
      fieldName: 'sort',
      label: $t('market.couponType.sort'),
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

function formatDate(ts: number): string {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleString('zh-CN');
}

function timeStatus(start: number, end: number): string {
  const now = Date.now() / 1000;
  if (now < start) return '未开始';
  if (now > end) return '已结束';
  return '进行中';
}

export function useColumns(
  onActionClick: OnActionClickFn<MarketCouponTypeApi.CouponTypeVO>,
): VxeTableGridOptions<MarketCouponTypeApi.CouponTypeVO>['columns'] {
  return [
    { field: 'id', title: $t('market.couponType.id'), width: 80 },
    { field: 'title', title: $t('market.couponType.name'), minWidth: 120 },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.RANGE_TYPE),
      },
      field: 'rang_type',
      title: $t('market.couponType.rangType'),
      width: 100,
    },
    {
      field: 'discount_type',
      title: $t('market.couponType.discountType'),
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
      field: 'get_type',
      title: $t('market.couponType.getType'),
      width: 180,
      slots: {
        default: ({ row }) => {
          if (row.get_type === 0) return [h('span', '无限制')];
          return [
            h('div', [
              h('div', `开始: ${formatDate(row.get_start_time)}`),
              h('div', `结束: ${formatDate(row.get_end_time)}`),
              h(Tag, () => timeStatus(row.get_start_time, row.get_end_time)),
            ]),
          ];
        },
      },
    },
    {
      field: 'validity_type',
      title: $t('market.couponType.validityType'),
      width: 180,
      slots: {
        default: ({ row }) => {
          if (row.validity_type === 1) {
            return [h('span', `领取后${row.validity_days}天内有效`)];
          }
          return [
            h('div', [
              h('div', `开始: ${formatDate(row.start_time)}`),
              h('div', `结束: ${formatDate(row.end_time)}`),
              h(Tag, () => timeStatus(row.start_time, row.end_time)),
            ]),
          ];
        },
      },
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.YES_NO),
      },
      field: 'single_type',
      title: $t('market.couponType.singleType'),
      width: 80,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DICT_TYPE.YES_NO),
      },
      field: 'is_new_people',
      title: $t('market.couponType.isNewPeople'),
      width: 80,
    },
    {
      field: 'count',
      title: $t('market.couponType.count'),
      width: 120,
      slots: {
        default: ({ row }) => [
          h('div', `发布: ${row.count ?? 0}`),
          h('div', { style: 'color: red' }, [
            `剩余: ${(row.count ?? 0) - (row.get_count ?? 0)}`,
          ]),
        ],
      },
    },
    { field: 'sort', title: $t('market.couponType.sort'), width: 60 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('market.couponType.status'),
      width: 100,
    },
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
