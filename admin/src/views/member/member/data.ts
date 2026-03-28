import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberApi } from '#/api/member/member';

import { h } from 'vue';

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
  const formatDate = (ts?: number) => {
    if (!ts) return '-';
    return new Date(ts * 1000).toLocaleString('zh-CN');
  };

  return [
    { field: 'id', title: $t('member.member.id'), width: 60 },
    {
      cellRender: { name: 'CellImage' },
      field: 'avatar',
      title: $t('member.member.avatar'),
      width: 60,
    },
    { field: 'nickname', title: $t('member.member.nickname'), width: 120 },
    { field: 'phone', title: $t('member.member.phone'), width: 130 },
    {
      field: 'pid',
      formatter: ({ cellValue }) =>
        cellValue === 0 || !cellValue ? '---' : String(cellValue),
      title: $t('member.member.pid'),
      width: 80,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('member.member.status'),
      width: 80,
    },
    {
      field: 'created_at',
      showOverflow: false,
      slots: {
        default: ({ row }) => {
          return h('div', { class: 'flex flex-col text-xs leading-5' }, [
            h('div', `${$t('member.member.lastIp')}: ${row.last_ip || '-'}`),
            h(
              'div',
              `${$t('member.member.lastTime')}: ${formatDate(row.last_time)}`,
            ),
            h(
              'div',
              `${$t('member.member.visitCount')}: ${row.visit_count ?? 0}`,
            ),
            h(
              'div',
              `${$t('member.member.createdAt')}: ${formatDate(row.created_at)}`,
            ),
          ]);
        },
      },
      title: $t('member.member.createdAt'),
      width: 220,
    },
  ];
}
