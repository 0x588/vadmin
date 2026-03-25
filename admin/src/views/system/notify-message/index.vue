<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemNotifyMessageApi } from '#/api/system/notify-message';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteNotifyMessage,
  getNotifyMessagePage,
} from '#/api/system/notify-message';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getNotifyMessagePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemNotifyMessageApi.NotifyMessage>,
});

function onActionClick(
  e: OnActionClickParams<SystemNotifyMessageApi.NotifyMessage>,
) {
  if (e.code === 'delete') {
    onDelete(e.row);
  }
}

function onDelete(row: SystemNotifyMessageApi.NotifyMessage) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.templateNickname]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteNotifyMessage(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.templateNickname]),
        key: 'action_process_msg',
      });
      gridApi.query();
    })
    .catch(() => {
      hideLoading();
    });
}
</script>
<template>
  <Page auto-content-height>
    <Grid :table-title="$t('system.notifyMessage.list')" />
  </Page>
</template>
