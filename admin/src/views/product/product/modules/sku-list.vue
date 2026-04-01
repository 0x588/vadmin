<script lang="ts" setup>
import type { UploadFile } from 'ant-design-vue';

import type { ProductApi } from '#/api/product/product';

import { ref, watch } from 'vue';

import { useAccessStore } from '@vben/stores';

import { PlusOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Input,
  InputNumber,
  Table,
  Upload,
} from 'ant-design-vue';

const props = defineProps<{
  dataList: ProductApi.ProductSkuVo[];
}>();

const emit = defineEmits<{
  change: [skus: ProductApi.ProductSkuVo[]];
}>();

const columns = ref<any[]>([]);
const tableData = ref<ProductApi.ProductSkuVo[]>([]);
const fileLists = ref<Record<number, UploadFile[]>>({});

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

function buildFileLists(data: ProductApi.ProductSkuVo[]) {
  const result: Record<number, UploadFile[]> = {};
  data.forEach((item, i) => {
    result[i] = item.picture && item.picture.length > 0 && item.picture[0] ? [
        { uid: `-${i}`, name: 'sku', status: 'done', url: item.picture[0] },
      ] : [];
  });
  fileLists.value = result;
}

watch(
  () => props.dataList,
  (val) => {
    tableData.value = val.map((item) => ({ ...item }));
    buildFileLists(tableData.value);
    rebuildColumns(val);
  },
  { immediate: true, deep: true },
);

function rebuildColumns(data: ProductApi.ProductSkuVo[]) {
  const specCols: any[] = [];
  if (data.length > 0 && data[0]?.items?.length) {
    const firstItems = data[0]?.items ?? [];
    firstItems.forEach((item: any) => {
      const colId = item.pid ?? item.spec_id;
      const colTitle = item.pname ?? item.title;
      specCols.push({
        title: colTitle,
        dataIndex: colId,
        key: `spec_${colId}`,
        width: 80,
      });
    });
  }
  columns.value = [
    ...specCols,
    { title: '图片', dataIndex: 'picture', key: 'picture', width: 100 },
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
  const found = items.find(
    (item: any) => item.pid === pid || item.spec_id === pid,
  );
  return found?.title || '';
}

function emitChange() {
  emit('change', tableData.value);
}

async function handleSkuUpload({ file, onError, onProgress, onSuccess }: any) {
  try {
    onProgress?.({ percent: 0 });
    const accessStore = useAccessStore();
    const formData = new FormData();
    formData.append('file', file);
    const resp = await fetch('/admin-api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessStore.accessToken}` },
      body: formData,
    });
    const result = await resp.json();
    onProgress?.({ percent: 100 });
    if (result.code === 200 && result.url) {
      onSuccess?.(result, file);
    } else {
      onError?.(new Error(result.message || '上传失败'));
    }
  } catch (error: any) {
    onError?.(error);
  }
}

function onPictureChange(index: number, info: any) {
  fileLists.value[index] = [...info.fileList];
  const item = tableData.value[index];
  if (!item) return;
  if (info.file.status === 'done' && info.file.response?.url) {
    item.picture = [info.file.response.url];
    emitChange();
  } else if (info.file.status === 'removed') {
    item.picture = [];
    emitChange();
  }
}

function setBatch() {
  tableData.value.forEach((item) => {
    Object.keys(batch.value).forEach((key) => {
      if (batch.value[key] !== undefined && batch.value[key] !== '') {
        (item as any)[key] = batch.value[key];
      }
    });
  });
  emitChange();
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
      :scroll="{ x: 'max-content' }"
      size="small"
      row-key="data"
      bordered
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="String(column.key).startsWith('spec_')">
          {{ getSpecValue(record.items, column.dataIndex) }}
        </template>
        <template v-else-if="column.key === 'picture'">
          <Upload
            :file-list="fileLists[index] || []"
            :custom-request="handleSkuUpload"
            :max-count="1"
            list-type="picture-card"
            accept="image/*"
            class="sku-pic-upload"
            @change="(info: any) => onPictureChange(index, info)"
          >
            <div v-if="(fileLists[index] || []).length === 0">
              <PlusOutlined />
            </div>
          </Upload>
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
            @change="emitChange"
          />
        </template>
        <template v-else-if="column.key === 'stock'">
          <InputNumber
            v-model:value="tableData[index]!.stock"
            :min="0"
            :precision="0"
            size="small"
            class="w-full"
            @change="emitChange"
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
            @change="emitChange"
          />
        </template>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.sku-pic-upload :deep(.ant-upload-list-item-container),
.sku-pic-upload :deep(.ant-upload.ant-upload-select) {
  width: 60px !important;
  height: 60px !important;
}
</style>
