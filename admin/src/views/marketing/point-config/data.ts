import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        show: () => false,
        triggerFields: ['id'],
      },
      label: 'id',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'status',
      label: $t('market.pointConfig.status'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 4,
        class: 'w-full',
      },
      fieldName: 'convert_rate',
      label: $t('market.pointConfig.convertRate'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        class: 'w-full',
      },
      fieldName: 'min_order_money',
      label: $t('market.pointConfig.minOrderMoney'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '不限制', value: 0 },
          { label: '订单金额', value: 1 },
          { label: '订单比例', value: 2 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'deduction_type',
      label: $t('market.pointConfig.deductionType'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        class: 'w-full',
      },
      dependencies: {
        show: (values) => values.deduction_type === 1,
        triggerFields: ['deduction_type'],
      },
      fieldName: 'max_money',
      label: $t('market.pointConfig.maxMoney'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 100,
        precision: 0,
        class: 'w-full',
      },
      dependencies: {
        show: (values) => values.deduction_type === 2,
        triggerFields: ['deduction_type'],
      },
      fieldName: 'max_rate',
      label: $t('market.pointConfig.maxRate'),
    },
    {
      component: 'Input',
      fieldName: 'explain',
      label: $t('market.pointConfig.explain'),
    },
  ];
}
