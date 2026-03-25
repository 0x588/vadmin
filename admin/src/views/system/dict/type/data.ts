import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictTypeApi } from '#/api/system/dict-type';

import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.dictType.dictName'),
    },
    {
      component: 'Input',
      fieldName: 'type',
      label: $t('system.dictType.type'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('system.dictType.status'),
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.dictType.dictName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'type',
      label: $t('system.dictType.type'),
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
      label: $t('system.dictType.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.dictType.remark'),
    },
  ];
}

export function useColumns<T = SystemDictTypeApi.DictType>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions<T>['columns'] {
  return [
    {
      field: 'name',
      title: $t('system.dictType.dictName'),
      width: 150,
    },
    {
      field: 'type',
      title: $t('system.dictType.type'),
      width: 150,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.dictType.status'),
      width: 100,
    },
    {
      field: 'remark',
      minWidth: 150,
      title: $t('system.dictType.remark'),
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('system.dictType.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.dictType.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.dictType.operation'),
      width: 130,
    },
  ];
}
