import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberAuthApi } from '#/api/member/auth';

import { h } from 'vue';

import { $t } from '#/locales';
import { DICT_TYPE, getDictLabel, getDictOptions } from '#/utils/dict';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'member_id',
      label: $t('member.auth.memberId'),
    },
    {
      component: 'Input',
      fieldName: 'client_open_id',
      label: $t('member.auth.clientOpenId'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.AUTH_TYPE, 'string'),
      },
      fieldName: 'client',
      label: $t('member.auth.client'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createdTime',
      label: $t('member.auth.createdAt'),
    },
  ];
}

export function useColumns(
  onStatusChange?: (
    newStatus: any,
    row: MemberAuthApi.MemberAuthVO,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<MemberAuthApi.MemberAuthVO>['columns'] {
  return [
    { field: 'id', title: $t('member.auth.id'), width: 40 },
    {
      cellRender: { name: 'CellImage', props: { height: 40, width: 40 } },
      field: 'avatar',
      title: $t('member.auth.avatar'),
      width: 60,
    },
    { field: 'nickname', title: $t('member.auth.nickname'), width: 100 },
    {
      field: 'client',
      formatter: ({ cellValue }) =>
        getDictLabel(DICT_TYPE.AUTH_TYPE, cellValue),
      title: $t('member.auth.client'),
      width: 100,
    },
    {
      field: 'client_open_id',
      title: $t('member.auth.clientOpenId'),
    },
    {
      field: 'member',
      showOverflow: false,
      slots: {
        default: ({ row }) => {
          const m = row.member;
          if (!m) return '---';
          return h('div', { class: 'flex flex-col text-xs leading-5' }, [
            h('div', `ID: ${m.id ?? '-'}`),
            h(
              'div',
              `${$t('member.auth.memberNickname')}: ${m.nickname || '-'}`,
            ),
            h('div', `${$t('member.auth.memberPhone')}: ${m.phone || '-'}`),
          ]);
        },
      },
      title: $t('member.auth.linkedMember'),
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('member.auth.status'),
      width: 80,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('member.auth.createdAt'),
      width: 160,
    },
  ];
}
