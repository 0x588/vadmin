import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictDataApi } from '#/api/system/dict-data';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

const options = [
  {
    value: '',
    label: '无',
  },
  {
    value: 'processing',
    color: 'processing',
    label: '主要',
  },
  {
    value: 'success',
    color: 'success',
    label: '成功',
  },
  {
    value: 'default',
    color: 'default',
    label: '默认',
  },
  {
    value: 'warning',
    color: 'warning',
    label: '警告',
  },
  {
    value: 'error',
    color: 'error',
    label: '危险',
  },
]

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'label',
      label: $t('system.dictData.label'),
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'dictType',
      label: $t('system.dictData.dictType'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('system.dictData.status'),
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'label',
      label: $t('system.dictData.label'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'value',
      label: $t('system.dictData.value'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'dictType',
      label: $t('system.dictData.dictType'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options,
      },
      fieldName: 'colorType',
      label: $t('system.dictData.colorType'),
    },
    {
      component: 'Input',
      fieldName: 'cssClass',
      label: $t('system.dictData.cssClass'),
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
      label: $t('system.dictData.status'),
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('system.dictData.sort'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.dictData.remark'),
    },
  ];
}

export function useColumns<T = SystemDictDataApi.DictData>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions<T>['columns'] {
  return [
    {
      field: 'label',
      title: $t('system.dictData.label'),
      width: 120,
    },
    {
      field: 'value',
      title: $t('system.dictData.value'),
      width: 120,
    },
    {
      field: 'dictType',
      title: $t('system.dictData.dictType'),
      width: 120,
    },
    {
      field: 'colorType',
      cellRender: { name: 'CellTag', options: options },
      title: $t('system.dictData.colorType'),
      width: 100,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.dictData.status'),
      width: 100,
    },
    {
      field: 'sort',
      title: $t('system.dictData.sort'),
      width: 80,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('system.dictData.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'label',
          nameTitle: $t('system.dictData.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.dictData.operation'),
      width: 130,
    },
  ];
}
