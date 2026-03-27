<script lang="ts" setup>
import type { ProductAttributeApi } from '#/api/product/attribute';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Divider,
  Input,
  InputNumber,
  Select,
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
  { label: $t('product.attribute.typeInput'), value: 0 },
  { label: $t('product.attribute.typeSingle'), value: 1 },
  { label: $t('product.attribute.typeMultiple'), value: 2 },
];

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
    const submitData = { ...values, values: attrValues.value };
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
  attrValues.value.push({ title: '', type: 0, sort: 0 });
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
  <Drawer :title="getDrawerTitle">
    <Form />
    <Divider />
    <Card :title="$t('product.attribute.values')" size="small">
      <div
        v-for="(item, index) in attrValues"
        :key="index"
        class="flex items-center gap-2 mb-2"
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
        <Input
          v-model:value="item.value"
          :placeholder="$t('product.attribute.valueData')"
          class="w-32"
        />
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
</template>
