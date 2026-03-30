<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { OrderApi } from '#/api/order/order';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { message, TabPane, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteOrder, getOrderPage } from '#/api/order/order';
import { $t } from '#/locales';

import { ORDER_STATUS_TABS, useColumns, useGridFormSchema } from './data';
import Detail from './modules/detail.vue';

const activeStatus = ref('');

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  connectedComponent: Detail,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
    wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getOrderPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            order_status: activeStatus.value || undefined,
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
  } as VxeTableGridOptions<OrderApi.OrderVO>,
});

function onActionClick(e: OnActionClickParams<OrderApi.OrderVO>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      detailDrawerApi.setData(e.row).open();
      break;
    }
  }
}

function onDelete(row: OrderApi.OrderVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.order_sn]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteOrder(Number(row.id))
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.order_sn]),
        key: 'action_process_msg',
      });
      gridApi.query();
    })
    .catch(() => {
      hideLoading();
    });
}

function onTabChange(key: number | string) {
  activeStatus.value = String(key);
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <DetailDrawer />
    <Tabs :active-key="activeStatus" class="mb-2" @change="onTabChange">
      <TabPane
        v-for="tab in ORDER_STATUS_TABS"
        :key="tab.value"
        :tab="$t(`order.order.${tab.label}`)"
      />
    </Tabs>
    <Grid :table-title="$t('order.order.title')" />
  </Page>
</template>
