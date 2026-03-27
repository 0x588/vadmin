import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberApi } from '#/api/member/member';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: $t('member.member.id'),
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('member.member.phone'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('member.member.nickname'),
    },
    {
      component: 'Input',
      fieldName: 'pid',
      label: $t('member.member.pid'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createdTime',
      label: $t('member.member.createdAt'),
    },
  ];
}

export function useColumns(
  onStatusChange?: (
    newStatus: any,
    row: MemberApi.MemberVO,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<MemberApi.MemberVO>['columns'] {
  return [
    { field: 'id', title: $t('member.member.id'), width: 80 },
    { field: 'nickname', title: $t('member.member.nickname'), width: 120 },
    { field: 'phone', title: $t('member.member.phone'), width: 130 },
    { field: 'pid', title: $t('member.member.pid'), width: 100 },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('member.member.status'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('member.member.createdAt'),
      width: 180,
    },
  ];
}
