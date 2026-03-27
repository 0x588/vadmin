<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberApi } from '#/api/member/member';

import { Page } from '@vben/common-ui';

import { Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { changeMemberStatus, getMemberPage } from '#/api/member/member';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onStatusChange),
    height: 'auto',
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getMemberPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: { keyField: 'id' },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<MemberApi.MemberVO>,
});

async function onStatusChange(newStatus: number, row: MemberApi.MemberVO) {
  const status: Recordable<string> = { 0: '冻结', 1: '正常' };
  try {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        content: `确定要将${row.nickname}的状态切换为【${status[newStatus.toString()]}】吗？`,
        title: '切换状态',
        onCancel: () => reject(new Error('已取消')),
        onOk: () => resolve(true),
      });
    });
    await changeMemberStatus(row.id, newStatus);
    return true;
  } catch {
    return false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('member.member.title')" />
  </Page>
</template>
