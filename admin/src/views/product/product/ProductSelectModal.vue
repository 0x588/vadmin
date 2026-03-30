<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Input, Table } from 'ant-design-vue';

import { getProductPage } from '#/api/product/product';

const emit = defineEmits<{ success: [rows: any[]] }>();

const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });
const searchName = ref('');
const selectedMap = ref<Map<number, any>>(new Map());

const columns = [
  { dataIndex: 'id', title: 'ID', width: 80 },
  { dataIndex: 'name', title: '名称' },
  { dataIndex: 'price', title: '价格', width: 100 },
  { dataIndex: 'stock', title: '库存', width: 100 },
];

async function fetchData() {
  loading.value = true;
  try {
    const res = await getProductPage({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      name: searchName.value || undefined,
    });
    dataSource.value = res.list || [];
    pagination.total = res.total || 0;
  } finally {
    loading.value = false;
  }
}

function handleTableChange(pag: any) {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
}

function handleSearch() {
  pagination.current = 1;
  fetchData();
}

const rowSelection = computed(() => ({
  onChange: (keys: number[]) => {
    const keySet = new Set(keys);
    const currentIds = dataSource.value.map((r: any) => r.id);
    for (const cid of currentIds) {
      if (!keySet.has(cid)) {
        selectedMap.value.delete(cid);
      }
    }
    for (const row of dataSource.value) {
      if (keySet.has(row.id)) {
        selectedMap.value.set(row.id, row);
      }
    }
  },
  preserveSelectedRowKeys: true,
  selectedRowKeys: [...selectedMap.value.keys()],
}));

const [Modal, modalApi] = useVbenModal({
  onConfirm() {
    emit('success', [...selectedMap.value.values()]);
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<{ selectedRows?: any[] }>();
      selectedMap.value = new Map();
      if (data?.selectedRows) {
        for (const row of data.selectedRows) {
          selectedMap.value.set(row.id, row);
        }
      }
      searchName.value = '';
      pagination.current = 1;
      fetchData();
    }
  },
});
</script>

<template>
  <Modal class="w-[1000px]" title="选择商品">
    <div class="mb-4 flex items-center gap-2">
      <Input
        v-model:value="searchName"
        allow-clear
        placeholder="搜索商品名称"
        style="width: 200px"
        @press-enter="handleSearch"
      />
      <Button type="primary" @click="handleSearch">搜索</Button>
    </div>
    <Table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      row-key="id"
      size="small"
      @change="handleTableChange"
    />
  </Modal>
</template>
