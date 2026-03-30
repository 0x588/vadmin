<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { OrderApi } from '#/api/order/order';

import { h, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Input, message, Modal, TabPane, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOrderPage, updateOrder } from '#/api/order/order';
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
    case 'detail': {
      detailDrawerApi.setData(e.row).open();
      break;
    }
    case 'memo': {
      onMemo(e.row);
      break;
    }
  }
}

function onMemo(row: OrderApi.OrderVO) {
  const memoValue = ref(row.seller_memo || '');
  Modal.confirm({
    title: $t('order.order.sellerMemo'),
    content: () =>
      h(Input.TextArea, {
        value: memoValue.value,
        rows: 4,
        'onUpdate:value': (val: string) => {
          memoValue.value = val;
        },
      }),
    onOk: async () => {
      await updateOrder(Number(row.id), { seller_memo: memoValue.value });
      message.success($t('ui.actionMessage.operationSuccess'));
      gridApi.query();
    },
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
