<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictDataApi } from '#/api/system/dict-data';
import type { SystemDictTypeApi } from '#/api/system/dict-type';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictData, getDictDataPage } from '#/api/system/dict-data';
import {
  deleteDictType,
  getDictTypePage,
} from '#/api/system/dict-type';
import { $t } from '#/locales';

import { useColumns as useDataColumns } from './data/data';
import DataForm from './data/modules/form.vue';
import { useColumns as useTypeColumns } from './type/data';
import TypeForm from './type/modules/form.vue';

const selectedDictType = ref<string>();
const selectedTypeName = ref<string>();

// --- Dict Type (left) ---
const [TypeFormModal, typeFormModalApi] = useVbenModal({
  connectedComponent: TypeForm,
  destroyOnClose: true,
});

const [TypeGrid, typeGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useTypeColumns(onTypeActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          return await getDictTypePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          });
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
  } as VxeTableGridOptions<SystemDictTypeApi.DictType>,
  gridEvents: {
    currentRowChange({ row }: { row: SystemDictTypeApi.DictType }) {
      if (row) {
        selectedDictType.value = row.type;
        selectedTypeName.value = row.name;
        refreshDataGrid();
      }
    },
  },
});

function onTypeActionClick(
  e: OnActionClickParams<SystemDictTypeApi.DictType>,
) {
  switch (e.code) {
    case 'delete': {
      onDeleteType(e.row);
      break;
    }
    case 'edit': {
      onEditType(e.row);
      break;
    }
  }
}

function onEditType(row: SystemDictTypeApi.DictType) {
  typeFormModalApi.setData(row).open();
}

function onDeleteType(row: SystemDictTypeApi.DictType) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDictType(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshTypeGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onCreateType() {
  typeFormModalApi.setData(null).open();
}

function refreshTypeGrid() {
  typeGridApi.query();
}

// --- Dict Data (right) ---
const [DataFormModal, dataFormModalApi] = useVbenModal({
  connectedComponent: DataForm,
  destroyOnClose: true,
});

const [DataGrid, dataGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDataColumns(onDataActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {},
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async ({ page }) => {
          if (!selectedDictType.value) {
            return { list: [], total: 0 };
          }
          return await getDictDataPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            dictType: selectedDictType.value,
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
  } as VxeTableGridOptions<SystemDictDataApi.DictData>,
});

function onDataActionClick(
  e: OnActionClickParams<SystemDictDataApi.DictData>,
) {
  switch (e.code) {
    case 'delete': {
      onDeleteData(e.row);
      break;
    }
    case 'edit': {
      onEditData(e.row);
      break;
    }
  }
}

function onEditData(row: SystemDictDataApi.DictData) {
  dataFormModalApi.setData(row).open();
}

function onDeleteData(row: SystemDictDataApi.DictData) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.label]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDictData(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.label]),
        key: 'action_process_msg',
      });
      refreshDataGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onCreateData() {
  dataFormModalApi
    .setData({ dictType: selectedDictType.value })
    .open();
}

function refreshDataGrid() {
  dataGridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <TypeFormModal @success="refreshTypeGrid" />
    <DataFormModal @success="refreshDataGrid" />
    <div class="flex h-full gap-4">
      <!-- Left: Dict Type -->
      <div class="flex w-1/2 flex-col overflow-hidden">
        <TypeGrid :table-title="$t('system.dictType.list')">
          <template #toolbar-tools>
            <Button type="primary" @click="onCreateType">
              <Plus class="size-5" />
              {{ $t('ui.actionTitle.create', [$t('system.dictType.name')]) }}
            </Button>
          </template>
        </TypeGrid>
      </div>
      <!-- Right: Dict Data -->
      <div class="flex w-1/2 flex-col overflow-hidden">
        <DataGrid
          :table-title="
            selectedTypeName
              ? `${$t('system.dictData.list')} - ${selectedTypeName}`
              : $t('system.dictData.list')
          "
        >
          <template #toolbar-tools>
            <Button
              type="primary"
              :disabled="!selectedDictType"
              @click="onCreateData"
            >
              <Plus class="size-5" />
              {{ $t('ui.actionTitle.create', [$t('system.dictData.name')]) }}
            </Button>
          </template>
        </DataGrid>
      </div>
    </div>
  </Page>
</template>
