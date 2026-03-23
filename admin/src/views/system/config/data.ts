import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemConfigApi } from '#/api/system/config';

import { getConfigCateSimpleTree } from '#/api/system/config';
import { $t } from '#/locales';

export function useCateColumns<T = SystemConfigApi.ConfigCate>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions<T>['columns'] {
  return [
    {
      align: 'left',
      field: 'title',
      title: $t('system.config.cateTitle'),
      treeNode: true,
      width: 150,
    },
    {
      field: 'name',
      title: $t('system.config.cateName'),
      width: 100,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.config.cateStatus'),
      width: 80,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('system.config.cateTitle'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.config.operation'),
      width: 130,
    },
  ];
}

export function useCateFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('system.config.cateTitle'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.config.cateName'),
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getConfigCateSimpleTree,
        class: 'w-full',
        labelField: 'title',
        valueField: 'id',
        childrenField: 'children',
      },
      fieldName: 'pid',
      label: $t('system.config.title'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.config.cateStatus'),
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('system.config.sort'),
    },
  ];
}

export function useConfigFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('system.config.configTitle'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.config.configName'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '文本', value: 'text' },
          { label: '数字', value: 'number' },
          { label: '布尔', value: 'boolean' },
          { label: 'JSON', value: 'json' },
          { label: '图片', value: 'image' },
          { label: '富文本', value: 'richtext' },
        ],
      },
      fieldName: 'type',
      label: $t('system.config.type'),
    },
    {
      component: 'Input',
      fieldName: 'defaultValue',
      label: $t('system.config.defaultValue'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.config.remark'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.config.status'),
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('system.config.sort'),
    },
  ];
}

export function useConfigColumns<T = SystemConfigApi.Config>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions<T>['columns'] {
  return [
    {
      field: 'title',
      title: $t('system.config.configTitle'),
      width: 150,
    },
    {
      field: 'name',
      title: $t('system.config.configName'),
      width: 150,
    },
    {
      field: 'type',
      title: $t('system.config.type'),
      width: 100,
    },
    {
      field: 'defaultValue',
      title: $t('system.config.defaultValue'),
      width: 120,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.config.status'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('system.config.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('system.config.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.config.operation'),
      width: 130,
    },
  ];
}
