<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberAuthApi } from '#/api/member/auth';

import { Page } from '@vben/common-ui';

import { Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMemberAuthPage } from '#/api/member/auth';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
    wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
  },
  gridOptions: {
    columns: useColumns(onStatusChange),
    height: 'auto',
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getMemberAuthPage({
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
  } as VxeTableGridOptions<MemberAuthApi.MemberAuthVO>,
});

async function onStatusChange(
  newStatus: number,
  _row: MemberAuthApi.MemberAuthVO,
) {
  const status: Recordable<string> = { 0: '冻结', 1: '正常' };
  try {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        content: `确定要将此用户状态切换为【${status[newStatus.toString()]}】吗？`,
        title: '切换状态',
        onCancel: () => reject(new Error('已取消')),
        onOk: () => resolve(true),
      });
    });
    return true;
  } catch {
    return false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('member.auth.title')" />
  </Page>
</template>
