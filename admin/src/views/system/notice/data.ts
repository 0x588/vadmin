import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemNoticeApi } from '#/api/system/notice';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('system.notice.noticeTitle'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('system.notice.typeNotice'), value: 1 },
          { label: $t('system.notice.typeAnnouncement'), value: 2 },
        ],
      },
      fieldName: 'type',
      label: $t('system.notice.type'),
      rules: 'required',
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
      label: $t('system.notice.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        rows: 6,
      },
      fieldName: 'content',
      label: $t('system.notice.content'),
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('system.notice.noticeTitle'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('system.notice.typeNotice'), value: 1 },
          { label: $t('system.notice.typeAnnouncement'), value: 2 },
        ],
      },
      fieldName: 'type',
      label: $t('system.notice.type'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemNoticeApi.Notice>,
): VxeTableGridOptions<SystemNoticeApi.Notice>['columns'] {
  return [
    {
      field: 'title',
      title: $t('system.notice.noticeTitle'),
      width: 200,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: $t('system.notice.typeNotice'), value: 1 },
          { color: 'success', label: $t('system.notice.typeAnnouncement'), value: 2 },
        ],
      },
      field: 'type',
      title: $t('system.notice.type'),
      width: 100,
    },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('system.notice.status'),
      width: 100,
    },
    {
      field: 'createdAt',
      title: $t('system.notice.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('system.notice.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.notice.operation'),
      width: 130,
    },
  ];
}
