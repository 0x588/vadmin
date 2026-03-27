<script lang="ts" setup>
import type { ProductApi } from '#/api/product/product';
import type { ProductSpecApi } from '#/api/product/spec';

import { h, ref, watch } from 'vue';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Card,
  CheckableTag,
  Input,
  Modal,
  Select,
} from 'ant-design-vue';

import { createCommonSpec, createCommonSpecValue } from '#/api/product/spec';

const props = defineProps<{
  specList: ProductApi.ProductSpecVo[];
}>();

const emit = defineEmits<{
  change: [specs: ProductApi.ProductSpecVo[]];
}>();

const specs = ref<ProductApi.ProductSpecVo[]>([]);

watch(
  () => props.specList,
  (val) => {
    specs.value = val.map((s) => ({
      ...s,
      values: s.values ? s.values.map((v) => ({ ...v })) : [],
    }));
  },
  { immediate: true, deep: true },
);

function dataChanged() {
  emit('change', specs.value);
}

function toggleValue(value: ProductApi.ProductSpecValue) {
  value.pitch_on = !value.pitch_on;
  dataChanged();
}

function addSpecValue(spec: ProductApi.ProductSpecVo) {
  let inputValue = '';
  Modal.confirm({
    content: h(Input, {
      placeholder: '请输入规格值名称',
      onChange: (e: any) => {
        inputValue = e.target.value;
      },
    }),
    title: '添加规格值',
    async onOk() {
      if (!inputValue) return;
      const data: ProductSpecApi.SpecValueVo = {
        title: inputValue,
        spec_id: spec.id,
        is_tmp: true,
        sort: 10,
      };
      const newId = await createCommonSpecValue(data);
      if (!spec.values) spec.values = [];
      spec.values.push({
        id: Number(newId),
        title: inputValue,
        spec_id: spec.id,
        pitch_on: false,
      });
      dataChanged();
    },
  });
}

const showNewSpec = ref(false);
const newSpecTitle = ref('');
const newSpecType = ref(1);

async function createNewSpec() {
  if (!newSpecTitle.value) return;
  const body = {
    title: newSpecTitle.value,
    type: newSpecType.value,
    is_tmp: true,
    sort: 10,
  };
  const newId = await createCommonSpec(body);
  specs.value.push({
    id: Number(newId),
    title: newSpecTitle.value,
    type: newSpecType.value,
    show_image: false,
    values: [],
  });
  newSpecTitle.value = '';
  showNewSpec.value = false;
  dataChanged();
}

function deleteSpec(index: number) {
  Modal.confirm({
    title: '确定删除该规格？',
    onOk() {
      specs.value.splice(index, 1);
      dataChanged();
    },
  });
}

function deleteSpecValue(spec: ProductApi.ProductSpecVo, valueIndex: number) {
  Modal.confirm({
    title: '确定删除该规格值？',
    onOk() {
      spec.values?.splice(valueIndex, 1);
      dataChanged();
    },
  });
}
</script>

<template>
  <Card title="商品规格" size="small" class="mt-4">
    <template #extra>
      <Button size="small" @click="showNewSpec = true">
        <PlusOutlined /> 新增规格
      </Button>
    </template>

    <div v-if="showNewSpec" class="mb-4 flex items-center gap-2">
      <Input v-model:value="newSpecTitle" placeholder="规格名称" class="w-40" />
      <Select v-model:value="newSpecType" class="w-24">
        <Select.Option :value="1">文字</Select.Option>
        <Select.Option :value="3">图片</Select.Option>
      </Select>
      <Button type="primary" size="small" @click="createNewSpec">确定</Button>
      <Button size="small" @click="showNewSpec = false">取消</Button>
    </div>

    <div
      v-for="(spec, sIndex) in specs"
      :key="spec.id"
      class="mb-3 rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800"
    >
      <div class="mb-2 flex items-center justify-between">
        <span class="font-medium">{{ spec.title }}</span>
        <div class="flex gap-2">
          <Select v-model:value="spec.type" size="small" class="w-20">
            <Select.Option :value="1">文字</Select.Option>
            <Select.Option :value="3">图片</Select.Option>
          </Select>
          <Button type="text" danger size="small" @click="deleteSpec(sIndex)">
            删除规格
          </Button>
        </div>
      </div>
      <div class="mb-2 text-xs text-gray-500">
        请点击选择规格值
        <Button size="small" type="link" @click="addSpecValue(spec)">
          增加规格值
        </Button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(value, vIndex) in spec.values"
          :key="value.id || vIndex"
          class="group flex items-center"
        >
          <CheckableTag :checked="value.pitch_on" @change="toggleValue(value)">
            {{ value.title }}
          </CheckableTag>
          <DeleteOutlined
            v-if="!value.pitch_on"
            class="cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
            @click="deleteSpecValue(spec, vIndex)"
          />
        </div>
      </div>
    </div>
  </Card>
</template>
