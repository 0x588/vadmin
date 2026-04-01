<script lang="ts" setup>
import type { ProductAttributeApi } from '#/api/product/attribute';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Divider,
  Input,
  InputNumber,
  Modal,
  Select,
  Textarea,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createCommonAttribute,
  getCommonAttribute,
  updateCommonAttribute,
} from '#/api/product/attribute';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<ProductAttributeApi.CommonAttributeVO>();
const attrValues = ref<ProductAttributeApi.AttributeValue[]>([]);

const typeOptions = [
  { label: $t('product.attribute.typeInput'), value: 1 },
  { label: $t('product.attribute.typeSingle'), value: 2 },
  { label: $t('product.attribute.typeMultiple'), value: 3 },
];

// Value editing modal state
const valueModalOpen = ref(false);
const editingIndex = ref(-1);
const editingValue = ref('');

function openValueModal(index: number) {
  editingIndex.value = index;
  editingValue.value = attrValues.value[index]?.value || '';
  valueModalOpen.value = true;
}

function handleValueModalOk() {
  const item = attrValues.value[editingIndex.value];
  if (item) {
    item.value = editingValue.value;
  }
  valueModalOpen.value = false;
}

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    const filteredValues = attrValues.value.filter((v) => v.title);
    const submitData = { ...values, values: filteredValues };
    (id.value
      ? updateCommonAttribute({ id: id.value, ...submitData })
      : createCommonAttribute(submitData)
    )
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<ProductAttributeApi.CommonAttributeVO>();
      formApi.resetForm();
      attrValues.value = [];

      if (data && data.id) {
        const detail = await getCommonAttribute(data.id);
        formData.value = detail;
        id.value = detail.id;
        attrValues.value = detail.values || [];
        await nextTick();
        formApi.setValues(detail);
      } else {
        formData.value = undefined;
        id.value = undefined;
      }
    }
  },
});

function addAttrValue() {
  attrValues.value.push({ title: '', type: 1, sort: 10, value: '' });
}

function removeAttrValue(index: number) {
  attrValues.value.splice(index, 1);
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('product.attribute.name')])
    : $t('ui.actionTitle.create', [$t('product.attribute.name')]);
});
</script>

<template>
  <Drawer class="w-[800px]" :title="getDrawerTitle">
    <Form />
    <Divider />
    <Card :title="$t('product.attribute.values')" size="small">
      <div
        v-for="(item, index) in attrValues"
        :key="index"
        class="mb-2 flex items-center gap-2"
      >
        <Input
          v-model:value="item.title"
          :placeholder="$t('product.attribute.valueName')"
          class="flex-1"
        />
        <Select
          v-model:value="item.type"
          :options="typeOptions"
          :placeholder="$t('product.attribute.valueType')"
          class="w-28"
        />
        <!-- type=1 输入框: show "用户输入" text -->
        <span v-if="item.type === 1" class="w-32 text-center text-gray-400">
          {{ $t('product.attribute.typeInput') }}
        </span>
        <!-- type=2/3 单选/多选: show value + edit button -->
        <template v-else>
          <span class="w-24 truncate text-sm" :title="item.value">
            {{ item.value || '-' }}
          </span>
          <Button type="link" size="small" @click="openValueModal(index)">
            <EditOutlined />
          </Button>
        </template>
        <InputNumber v-model:value="item.sort" :min="0" class="w-20" />
        <Button type="text" danger @click="removeAttrValue(index)">
          <DeleteOutlined />
        </Button>
      </div>
      <Button type="dashed" block @click="addAttrValue">
        <PlusOutlined />
        {{ $t('product.attribute.addValue') }}
      </Button>
    </Card>
  </Drawer>

  <!-- Value editing modal -->
  <Modal
    v-model:open="valueModalOpen"
    :centered="true"
    :title="$t('product.attribute.valueData')"
    @ok="handleValueModalOk"
  >
    <Textarea
      v-model:value="editingValue"
      :rows="8"
      :placeholder="$t('product.attribute.valueEditHint')"
    />
    <p class="mt-2 text-sm text-gray-400">
      {{ $t('product.attribute.valueEditHint') }}
    </p>
  </Modal>
</template>
