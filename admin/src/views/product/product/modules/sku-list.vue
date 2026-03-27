<script lang="ts" setup>
import type { ProductApi } from '#/api/product/product';

import { ref, watch } from 'vue';

import { Button, Card, Input, InputNumber, Table } from 'ant-design-vue';

const props = defineProps<{
  dataList: ProductApi.ProductSkuVo[];
}>();

const columns = ref<any[]>([]);
const tableData = ref<ProductApi.ProductSkuVo[]>([]);

const batch = ref<Record<string, any>>({
  price: undefined,
  market_price: undefined,
  cost_price: undefined,
  stock: undefined,
  weight: undefined,
  volume: undefined,
  sku_no: undefined,
  bar_code: undefined,
});

watch(
  () => props.dataList,
  (val) => {
    tableData.value = val.map((item) => ({ ...item }));
    rebuildColumns(val);
  },
  { immediate: true, deep: true },
);

function rebuildColumns(data: ProductApi.ProductSkuVo[]) {
  const specCols: any[] = [];
  if (data.length > 0 && data[0]?.items?.length) {
    const firstItems = data[0]?.items ?? [];
    firstItems.forEach((item: any) => {
      specCols.push({
        title: item.pname,
        dataIndex: item.pid,
        key: `spec_${item.pid}`,
      });
    });
  }
  columns.value = [
    ...specCols,
    { title: '销售价(元)', dataIndex: 'price', key: 'price', width: 100 },
    {
      title: '市场价(元)',
      dataIndex: 'market_price',
      key: 'market_price',
      width: 100,
    },
    {
      title: '成本价(元)',
      dataIndex: 'cost_price',
      key: 'cost_price',
      width: 100,
    },
    { title: '库存', dataIndex: 'stock', key: 'stock', width: 80 },
    { title: '重量(kg)', dataIndex: 'weight', key: 'weight', width: 80 },
    { title: '体积(m³)', dataIndex: 'volume', key: 'volume', width: 80 },
    { title: '编码', dataIndex: 'sku_no', key: 'sku_no', width: 100 },
    { title: '条码', dataIndex: 'bar_code', key: 'bar_code', width: 100 },
  ];
}

function getSpecValue(items: any, pid: any) {
  if (!items) return '';
  const found = items.find((item: any) => item.pid === pid);
  return found?.title || '';
}

function setBatch() {
  tableData.value.forEach((item) => {
    Object.keys(batch.value).forEach((key) => {
      if (batch.value[key] !== undefined && batch.value[key] !== '') {
        (item as any)[key] = batch.value[key];
      }
    });
  });
}

function clearBatch() {
  batch.value = {
    price: undefined,
    market_price: undefined,
    cost_price: undefined,
    stock: undefined,
    weight: undefined,
    volume: undefined,
    sku_no: undefined,
    bar_code: undefined,
  };
}
</script>

<template>
  <Card title="SKU列表" size="small" class="mt-4">
    <div
      v-if="tableData.length > 1"
      class="mb-3 flex flex-wrap items-center gap-2"
    >
      <InputNumber
        v-model:value="batch.price"
        placeholder="销售价"
        :min="0"
        :precision="2"
        size="small"
        class="w-24"
      />
      <InputNumber
        v-model:value="batch.market_price"
        placeholder="市场价"
        :min="0"
        :precision="2"
        size="small"
        class="w-24"
      />
      <InputNumber
        v-model:value="batch.cost_price"
        placeholder="成本价"
        :min="0"
        :precision="2"
        size="small"
        class="w-24"
      />
      <InputNumber
        v-model:value="batch.stock"
        placeholder="库存"
        :min="0"
        :precision="0"
        size="small"
        class="w-20"
      />
      <Button type="link" danger size="small" @click="setBatch">
        批量设置
      </Button>
      <Button type="link" size="small" @click="clearBatch">清空</Button>
    </div>
    <Table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      size="small"
      row-key="data"
      bordered
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="String(column.key).startsWith('spec_')">
          {{ getSpecValue(record.items, column.dataIndex) }}
        </template>
        <template
          v-else-if="
            [
              'price',
              'market_price',
              'cost_price',
              'weight',
              'volume',
            ].includes(column.key as string)
          "
        >
          <InputNumber
            v-model:value="
              tableData[index]![
                column.dataIndex as keyof ProductApi.ProductSkuVo
              ]
            "
            :min="0"
            :precision="2"
            size="small"
            class="w-full"
          />
        </template>
        <template v-else-if="column.key === 'stock'">
          <InputNumber
            v-model:value="tableData[index]!.stock"
            :min="0"
            :precision="0"
            size="small"
            class="w-full"
          />
        </template>
        <template
          v-else-if="['sku_no', 'bar_code'].includes(column.key as string)"
        >
          <Input
            v-model:value="
              tableData[index]![
                column.dataIndex as keyof ProductApi.ProductSkuVo
              ]
            "
            size="small"
          />
        </template>
      </template>
    </Table>
  </Card>
</template>
