<script lang="ts" setup>
import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Table } from 'ant-design-vue';

import { getProductByIds } from '#/api/product/product';

import ProductSelectModal from './ProductSelectModal.vue';

const props = defineProps<{
  values?: number[];
}>();

const emit = defineEmits<{ 'update:values': [ids: number[]] }>();

const products = ref<any[]>([]);

const [Modal, modalApi] = useVbenModal({
  connectedComponent: ProductSelectModal,
});

async function loadProducts(ids?: number[]) {
  products.value = ids && ids.length > 0 ? await getProductByIds(ids) : [];
}

let lastIds: string = '';
watch(
  () => props.values,
  async (val) => {
    const key = JSON.stringify(val || []);
    if (key === lastIds) return;
    lastIds = key;
    await loadProducts(val);
  },
  { immediate: true },
);

function openSelect() {
  modalApi.setData({ selectedRows: products.value });
  modalApi.open();
}

function handleSelectRows(rows: any[]) {
  products.value = rows;
  const ids = rows.map((r) => r.id);
  lastIds = JSON.stringify(ids);
  emit('update:values', ids);
}

function handleDelete(record: any) {
  products.value = products.value.filter((r) => r.id !== record.id);
  const ids = products.value.map((r) => r.id);
  lastIds = JSON.stringify(ids);
  emit('update:values', ids);
}

const columns = [
  { dataIndex: 'id', title: 'ID', width: 80 },
  { dataIndex: 'name', title: '名称' },
  { dataIndex: 'price', title: '价格', width: 100 },
  { dataIndex: 'stock', title: '库存', width: 100 },
  { key: 'action', title: '操作', width: 80 },
];
</script>

<template>
  <div>
    <Button class="mb-2" size="small" type="primary" @click="openSelect">
      选择商品
    </Button>
    <Table
      :columns="columns"
      :data-source="products"
      :pagination="false"
      row-key="id"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Button danger size="small" @click="handleDelete(record)">
            删除
          </Button>
        </template>
      </template>
    </Table>
    <Modal @success="handleSelectRows" />
  </div>
</template>
