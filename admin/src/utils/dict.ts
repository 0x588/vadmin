/**
 * 数据字典工具类
 */
import type { SystemDictDataApi } from '#/api/system/dict-data';

import { useDictStore } from '#/store/dict';

export interface DictDataType {
  colorType: string;
  cssClass: string;
  dictType: string;
  key?: any;
  label: string;
  value: boolean | number | string;
}

/**
 * 获取 dictType 对应的数据字典数组（原始数据）
 */
export function getDictDatas(dictType: string): SystemDictDataApi.DictDataSimple[] {
  const dictStore = useDictStore();
  return dictStore.getDictMap[dictType] || [];
}

/**
 * 获取 dictType 对应的数据字典数组，用于 Select/Radio 等组件的 options
 * @param dictType 字典类型
 * @param valueType 值类型转换，默认转为 number
 */
export function getDictOptions(
  dictType: string,
  valueType?: 'boolean' | 'number' | 'string',
): DictDataType[] {
  const dictOptions = getDictDatas(dictType);
  if (!dictOptions || dictOptions.length === 0) return [];

  return dictOptions.map((dict) => ({
    ...dict,
    key: dict.value,
    value:
      valueType === 'string'
        ? `${dict.value}`
        : valueType === 'boolean'
          ? `${dict.value}` === 'true'
          : Number.parseInt(`${dict.value}`),
  }));
}

/**
 * 获取 dictType 中指定 value 对应的字典对象
 */
export function getDictObj(
  dictType: string,
  value: any,
): DictDataType | undefined {
  const dictOptions = getDictDatas(dictType);
  for (const dict of dictOptions) {
    if (`${dict.value}` === `${value}`) {
      return { ...dict, key: dict.value, value: dict.value };
    }
  }
  return undefined;
}

/**
 * 获取 dictType 中指定 value 的 label
 */
export function getDictLabel(dictType: string, value: any): string {
  const obj = getDictObj(dictType, value);
  return obj?.label ?? `${value}`;
}

/**
 * 字典类型枚举
 */
export enum DICT_TYPE {
  COMMON_STATUS = 'common_status',
  OPEN_STATUS = 'open_status',
  USER_TYPE = 'user_type',
  YES_NO = 'yes_no',

  // ========== SYSTEM 模块 ==========
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type',
  SYSTEM_OPERATE_TYPE = 'system_operate_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_USER_SEX = 'system_user_sex',

  // ========== 业务模块 ==========
  AUTH_TYPE = 'auth_type',
  COMMON_CONFIG_TYPE = 'common_config_type',
  COUPON_STATE = 'coupon_state',
  DISCOUNT_TYPE = 'discount_type',
  ORDER_STATUS = 'order_status',
  PAY_TYPE = 'pay_type',
  PRODUCT_STATUS = 'product_status',
  RANGE_TYPE = 'range_type',
  SPEC_TYPE = 'spec_type',
}
