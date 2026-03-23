import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.loginLog.userName'),
    },
    {
      component: 'Input',
      fieldName: 'userIp',
      label: $t('system.loginLog.userIp'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('system.loginLog.resultSuccess'), value: 0 },
          { label: $t('system.loginLog.resultFail'), value: 10 },
        ],
      },
      fieldName: 'result',
      label: $t('system.loginLog.result'),
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'username',
      title: $t('system.loginLog.userName'),
      width: 120,
    },
    {
      field: 'userIp',
      title: $t('system.loginLog.userIp'),
      width: 140,
    },
    {
      field: 'userAgent',
      minWidth: 200,
      title: $t('system.loginLog.userAgent'),
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          {
            color: 'success',
            label: $t('system.loginLog.resultSuccess'),
            value: 0,
          },
          {
            color: 'error',
            label: $t('system.loginLog.resultFail'),
            value: 10,
          },
        ],
      },
      field: 'result',
      title: $t('system.loginLog.result'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('system.loginLog.createdAt'),
      width: 180,
    },
  ];
}
