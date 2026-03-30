<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProductSpecTempApi } from '#/api/product/spec-temp';

import { onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { listSimpleSpec } from '#/api/product/spec';
import {
  deleteCommonSpecTemp,
  getCommonSpecTempPage,
} from '#/api/product/spec-temp';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const specMap = ref<Record<number, string>>({});

onMounted(async () => {
  const list = await listSimpleSpec();
  const map: Record<number, string> = {};
  for (const item of list) {
    map[item.id] = item.title;
  }
  specMap.value = map;
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
    wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
  },
  gridOptions: {
    columns: useColumns(onActionClick, specMap),
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getCommonSpecTempPage({
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
  } as VxeTableGridOptions<ProductSpecTempApi.CommonSpecTemplateVO>,
});

function onActionClick(
  e: OnActionClickParams<ProductSpecTempApi.CommonSpecTemplateVO>,
) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      formDrawerApi.setData(e.row).open();
      break;
    }
  }
}

function onDelete(row: ProductSpecTempApi.CommonSpecTemplateVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.title]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteCommonSpecTemp(Number(row.id))
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.title]),
        key: 'action_process_msg',
      });
      gridApi.query();
    })
    .catch(() => {
      hideLoading();
    });
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="gridApi.query()" />
    <Grid :table-title="$t('product.specTemp.title')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('product.specTemp.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
