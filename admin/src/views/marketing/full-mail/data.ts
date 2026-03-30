import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';
import { areaOption } from '#/utils/areas';

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
      description: $t('market.fullMail.statusDesc'),
      fieldName: 'status',
      label: $t('market.fullMail.status'),
      rules: 'required',
    },
    {
      component: 'Cascader',
      componentProps: {
        class: 'w-full',
        multiple: true,
        options: areaOption,
      },
      fieldName: 'no_mail_province_ids',
      label: $t('market.fullMail.noMailProvinceIds'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
        precision: 2,
        class: 'w-full',
      },
      description: $t('market.fullMail.minOrderMoneyDesc'),
      fieldName: 'min_order_money',
      label: $t('market.fullMail.minOrderMoney'),
      rules: 'required',
    },
  ];
}
