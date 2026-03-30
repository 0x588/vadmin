import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';

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
        options: [
          { label: '关闭', value: 0 },
          { label: '开启', value: 1 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      description: $t('market.pointConfig.statusDesc'),
      fieldName: 'status',
      label: $t('market.pointConfig.status'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0.0001,
        precision: 4,
        class: 'w-full',
        addonAfter: $t('market.pointConfig.convertRateUnit'),
      },
      description: $t('market.pointConfig.convertRateDesc'),
      fieldName: 'convert_rate',
      label: $t('market.pointConfig.convertRate'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
        precision: 2,
        class: 'w-full',
      },
      description: $t('market.pointConfig.minOrderMoneyDesc'),
      fieldName: 'min_order_money',
      label: $t('market.pointConfig.minOrderMoney'),
      rules: 'required',
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
        min: 0.01,
        precision: 2,
        class: 'w-full',
      },
      dependencies: {
        show: (values) => values.deduction_type === 1,
        triggerFields: ['deduction_type'],
      },
      description: $t('market.pointConfig.maxMoneyDesc'),
      fieldName: 'max_money',
      label: $t('market.pointConfig.maxMoney'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
        max: 100,
        precision: 2,
        class: 'w-full',
        addonAfter: $t('market.pointConfig.maxRateUnit'),
      },
      dependencies: {
        show: (values) => values.deduction_type === 2,
        triggerFields: ['deduction_type'],
      },
      description: $t('market.pointConfig.maxRateDesc'),
      fieldName: 'max_rate',
      label: $t('market.pointConfig.maxRate'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'explain',
      label: $t('market.pointConfig.explain'),
    },
  ];
}
