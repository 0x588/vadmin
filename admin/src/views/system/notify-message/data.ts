import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemNotifyMessageApi } from '#/api/system/notify-message';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'templateCode',
      label: $t('system.notifyMessage.templateCode'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '站内信', value: 1 },
          { label: '短信', value: 2 },
          { label: '邮件', value: 3 },
        ],
      },
      fieldName: 'templateType',
      label: $t('system.notifyMessage.templateType'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '已读', value: 1 },
          { label: '未读', value: 0 },
        ],
      },
      fieldName: 'readStatus',
      label: $t('system.notifyMessage.readStatus'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemNotifyMessageApi.NotifyMessage>,
): VxeTableGridOptions<SystemNotifyMessageApi.NotifyMessage>['columns'] {
  return [
    {
      field: 'templateNickname',
      title: $t('system.notifyMessage.templateNickname'),
      width: 120,
    },
    {
      field: 'templateContent',
      minWidth: 200,
      title: $t('system.notifyMessage.templateContent'),
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '站内信', value: 1 },
          { color: 'success', label: '短信', value: 2 },
          { color: 'warning', label: '邮件', value: 3 },
        ],
      },
      field: 'templateType',
      title: $t('system.notifyMessage.templateType'),
      width: 100,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'error', label: '未读', value: 0 },
          { color: 'default', label: '已读', value: 1 },
        ],
      },
      field: 'readStatus',
      title: $t('system.notifyMessage.readStatus'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('system.notifyMessage.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'templateNickname',
          nameTitle: $t('system.notifyMessage.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['delete'],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.notifyMessage.operation'),
      width: 100,
    },
  ];
}
