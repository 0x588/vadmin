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
      label: $t('market.fullMail.status'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        class: 'w-full',
      },
      fieldName: 'min_order_money',
      label: $t('market.fullMail.minOrderMoney'),
    },
    {
      component: 'Input',
      fieldName: 'no_mail_province_ids',
      label: $t('market.fullMail.noMailProvinceIds'),
    },
    {
      component: 'Input',
      fieldName: 'no_mail_city_ids',
      label: $t('market.fullMail.noMailCityIds'),
    },
  ];
}
