<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemConfigApi } from '#/api/system/config';

import { nextTick, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteConfig,
  deleteConfigCate,
  getConfigCateList,
  getConfigPage,
} from '#/api/system/config';
import { $t } from '#/locales';

import { useCateColumns, useConfigColumns } from './data';
import CateForm from './modules/cate-form.vue';
import ConfigForm from './modules/config-form.vue';

const selectedCateId = ref<number>();
const selectedCateTitle = ref<string>();

// --- Left: Config Category ---
const [CateFormModal, cateFormModalApi] = useVbenModal({
  connectedComponent: CateForm,
  destroyOnClose: true,
});

const [CateGrid, cateGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useCateColumns(onCateActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: { enabled: false },
    proxyConfig: {
      ajax: {
        query: async () => {
          const data = await getConfigCateList();
          if (data.length > 0 && !selectedCateId.value) {
            const first = data[0] as SystemConfigApi.ConfigCate;
            selectedCateId.value = first.id;
            selectedCateTitle.value = first.title;
            nextTick(() => {
              cateGridApi.grid?.setCurrentRow(first);
              refreshConfigGrid();
            });
          }
          return { list: data, total: data.length };
        },
      },
    },
    rowConfig: {
      isCurrent: true,
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      zoom: true,
    },
    treeConfig: {
      parentField: 'pid',
      rowField: 'id',
      transform: true,
    },
  } as VxeTableGridOptions<SystemConfigApi.ConfigCate>,
  gridEvents: {
    currentRowChange({ row }: { row: SystemConfigApi.ConfigCate }) {
      if (row) {
        selectedCateId.value = row.id;
        selectedCateTitle.value = row.title;
        refreshConfigGrid();
      }
    },
  },
});

function onCateActionClick(e: OnActionClickParams<SystemConfigApi.ConfigCate>) {
  switch (e.code) {
    case 'delete': {
      onDeleteCate(e.row);
      break;
    }
    case 'edit': {
      onEditCate(e.row);
      break;
    }
  }
}

function onEditCate(row: SystemConfigApi.ConfigCate) {
  cateFormModalApi.setData(row).open();
}

function onDeleteCate(row: SystemConfigApi.ConfigCate) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.title]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteConfigCate(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.title]),
        key: 'action_process_msg',
      });
      refreshCateGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onCreateCate() {
  cateFormModalApi.setData(null).open();
}

function refreshCateGrid() {
  cateGridApi.query();
}

// --- Right: Config List ---
const [ConfigFormModal, configFormModalApi] = useVbenModal({
  connectedComponent: ConfigForm,
  destroyOnClose: true,
});

const [ConfigGrid, configGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useConfigColumns(onConfigActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async ({ page }) => {
          if (!selectedCateId.value) {
            return { list: [], total: 0 };
          }
          return await getConfigPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            cateId: selectedCateId.value,
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
      zoom: true,
    },
  } as VxeTableGridOptions<SystemConfigApi.Config>,
});

function onConfigActionClick(e: OnActionClickParams<SystemConfigApi.Config>) {
  switch (e.code) {
    case 'delete': {
      onDeleteConfig(e.row);
      break;
    }
    case 'edit': {
      onEditConfig(e.row);
      break;
    }
  }
}

function onEditConfig(row: SystemConfigApi.Config) {
  configFormModalApi.setData(row).open();
}

function onDeleteConfig(row: SystemConfigApi.Config) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.title]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteConfig(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.title]),
        key: 'action_process_msg',
      });
      refreshConfigGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onCreateConfig() {
  configFormModalApi
    .setData({ cateId: selectedCateId.value } as SystemConfigApi.Config)
    .open();
}

function refreshConfigGrid() {
  configGridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <CateFormModal @success="refreshCateGrid" />
    <ConfigFormModal @success="refreshConfigGrid" />
    <div class="flex h-full gap-4">
      <!-- Left: Config Category -->
      <div class="flex w-1/2 flex-col overflow-hidden">
        <CateGrid :table-title="$t('system.config.cateTitle')">
          <template #toolbar-tools>
            <Button type="primary" @click="onCreateCate">
              <Plus class="size-5" />
              {{ $t('ui.actionTitle.create') }}
            </Button>
          </template>
        </CateGrid>
      </div>
      <!-- Right: Config List -->
      <div class="flex w-1/2 flex-col overflow-hidden">
        <ConfigGrid
          :table-title="
            selectedCateTitle
              ? `${$t('system.config.list')} - ${selectedCateTitle}`
              : $t('system.config.list')
          "
        >
          <template #toolbar-tools>
            <Button
              type="primary"
              :disabled="!selectedCateId"
              @click="onCreateConfig"
            >
              <Plus class="size-5" />
              {{ $t('ui.actionTitle.create', [$t('system.config.name')]) }}
            </Button>
          </template>
        </ConfigGrid>
      </div>
    </div>
  </Page>
</template>
