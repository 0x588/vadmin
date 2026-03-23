<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemConfigApi } from '#/api/system/config';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Tree } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteConfig,
  deleteConfigCate,
  getConfigCateSimpleTree,
  getConfigPage,
} from '#/api/system/config';
import { $t } from '#/locales';

import { useConfigColumns } from './data';
import CateForm from './modules/cate-form.vue';
import ConfigForm from './modules/config-form.vue';

const [CateFormModal, cateFormModalApi] = useVbenModal({
  connectedComponent: CateForm,
  destroyOnClose: true,
});

const [ConfigFormModal, configFormModalApi] = useVbenModal({
  connectedComponent: ConfigForm,
  destroyOnClose: true,
});

const cateTree = ref<SystemConfigApi.ConfigCateSimple[]>([]);
const selectedCateKeys = ref<number[]>([]);
const selectedCateId = ref<number>();

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useConfigColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
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

function onActionClick(e: OnActionClickParams<SystemConfigApi.Config>) {
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
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onCreateCate() {
  cateFormModalApi.setData(null).open();
}

function onEditCate(id: number) {
  const findCate = (
    tree: SystemConfigApi.ConfigCateSimple[],
  ): SystemConfigApi.ConfigCateSimple | undefined => {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findCate(node.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  const cate = findCate(cateTree.value);
  if (cate) {
    cateFormModalApi.setData(cate).open();
  }
}

function onDeleteCate(id: number) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteConfigCate(id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess'),
        key: 'action_process_msg',
      });
      refreshCateTree();
    })
    .catch(() => {
      hideLoading();
    });
}

function onCateSelect(keys: number[]) {
  selectedCateKeys.value = keys;
  selectedCateId.value = keys[0];
  refreshGrid();
}

function onCreateConfig() {
  configFormModalApi
    .setData({ cateId: selectedCateId.value } as SystemConfigApi.Config)
    .open();
}

async function refreshCateTree() {
  cateTree.value = await getConfigCateSimpleTree();
}

function refreshGrid() {
  gridApi.query();
}

onMounted(() => {
  refreshCateTree();
});
</script>
<template>
  <Page auto-content-height>
    <CateFormModal @success="refreshCateTree" />
    <ConfigFormModal @success="refreshGrid" />
    <div class="flex h-full gap-4">
      <!-- Left: Category Tree -->
      <div
        class="w-64 shrink-0 overflow-auto rounded-lg bg-white p-4 dark:bg-gray-800"
      >
        <div class="mb-3 flex items-center justify-between">
          <span class="font-medium">{{ $t('system.config.cateTitle') }}</span>
          <Button size="small" type="primary" @click="onCreateCate">
            <Plus class="size-4" />
          </Button>
        </div>
        <Tree
          v-if="cateTree.length > 0"
          :tree-data="(cateTree as any)"
          :field-names="{ title: 'title', key: 'id', children: 'children' }"
          :selected-keys="selectedCateKeys"
          default-expand-all
          @select="(keys: any[]) => onCateSelect(keys)"
        >
          <template #title="{ id, title }">
            <div class="group flex items-center justify-between">
              <span>{{ title }}</span>
              <span
                class="hidden space-x-1 group-hover:inline-flex"
                @click.stop
              >
                <Button size="small" type="link" @click="onEditCate(id)">
                  {{ $t('common.edit') }}
                </Button>
                <Button
                  danger
                  size="small"
                  type="link"
                  @click="onDeleteCate(id)"
                >
                  {{ $t('common.delete') }}
                </Button>
              </span>
            </div>
          </template>
        </Tree>
      </div>
      <!-- Right: Config List -->
      <div class="flex-1 overflow-hidden">
        <Grid :table-title="$t('system.config.list')">
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
        </Grid>
      </div>
    </div>
  </Page>
</template>
