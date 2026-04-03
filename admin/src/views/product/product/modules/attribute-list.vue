<script lang="ts" setup>
import type { ProductAttributeApi } from '#/api/product/attribute';

import { onMounted, ref, watch } from 'vue';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { Button, Card, Input, Select, Table } from 'ant-design-vue';

import { listSimpleAttribute } from '#/api/product/attribute';
import { $t } from '#/locales';

const props = defineProps<{
  values: ProductAttributeApi.AttributeValue[];
}>();

const emit = defineEmits<{
  loadTemplate: [id: number];
  'update:values': [values: ProductAttributeApi.AttributeValue[]];
}>();

const localValues = ref<ProductAttributeApi.AttributeValue[]>([]);
const attrTemplateList = ref<any[]>([]);
const selectedTemplateId = ref<number>();

watch(
  () => props.values,
  (val) => {
    localValues.value = val.map((v) => ({ ...v }));
  },
  { immediate: true, deep: true },
);

function emitUpdate() {
  emit(
    'update:values',
    localValues.value.map((v) => ({ ...v })),
  );
}

onMounted(async () => {
  try {
    const list = await listSimpleAttribute();
    attrTemplateList.value = (list as any[]) || [];
  } catch {
    attrTemplateList.value = [];
  }
});

const columns = [
  {
    title: $t('product.attribute.valueName'),
    dataIndex: 'title',
    key: 'title',
    width: 120,
  },
  {
    title: $t('product.attribute.valueData'),
    dataIndex: 'data',
    key: 'data',
    width: 220,
  },
  {
    title: $t('product.attribute.valueSort'),
    dataIndex: 'sort',
    key: 'sort',
    width: 60,
  },
  {
    title: $t('product.product.operation'),
    key: 'action',
    width: 60,
  },
];

function addRow() {
  localValues.value.push({ title: '', type: 1, value: '', data: '', sort: 10 });
  emitUpdate();
}

function removeRow(index: number) {
  localValues.value.splice(index, 1);
  emitUpdate();
}

function dataOptions(text: string | undefined) {
  if (!text) return [];
  return text.split('\n').map((item) => ({ value: item, label: item }));
}

function onTemplateChange(val: any) {
  selectedTemplateId.value = val as number;
  emit('loadTemplate', val as number);
}
</script>

<template>
  <Card size="small">
    <template #title>
      <div class="flex items-center gap-4">
        <span>{{ $t('product.product.attrInfo') }}</span>
        <Select
          v-model:value="selectedTemplateId"
          placeholder="选择参数模版"
          allow-clear
          class="w-48"
          @change="onTemplateChange"
        >
          <Select.Option
            v-for="item in attrTemplateList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.title }}
          </Select.Option>
        </Select>
      </div>
    </template>
    <template #extra>
      <Button size="small" @click="addRow">
        <PlusOutlined /> {{ $t('product.attribute.addValue') }}
      </Button>
    </template>
    <Table
      :columns="columns"
      :data-source="localValues"
      :pagination="false"
      size="small"
      bordered
      row-key="title"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'title'">
          <Input
            v-if="!record.id"
            v-model:value="localValues[index]!.title"
            size="small"
            @change="emitUpdate"
          />
          <span v-else>{{ record.title }}</span>
        </template>
        <template v-else-if="column.key === 'data'">
          <Input
            v-if="record.type === 1"
            v-model:value="localValues[index]!.data"
            size="small"
            @change="emitUpdate"
          />
          <Select
            v-else-if="record.type === 2"
            v-model:value="localValues[index]!.data"
            :options="dataOptions(record.value)"
            size="small"
            class="w-full"
            @change="emitUpdate"
          />
          <Select
            v-else-if="record.type === 3"
            v-model:value="localValues[index]!.data"
            :options="dataOptions(record.value)"
            mode="multiple"
            size="small"
            class="w-full"
            @change="emitUpdate"
          />
        </template>
        <template v-else-if="column.key === 'sort'">
          <Input
            v-model:value="localValues[index]!.sort"
            size="small"
            @change="emitUpdate"
          />
        </template>
        <template v-else-if="column.key === 'action'">
          <Button type="text" danger size="small" @click="removeRow(index)">
            <DeleteOutlined />
          </Button>
        </template>
      </template>
    </Table>
  </Card>
</template>
