<script lang="ts" setup>
import type { ProductSpecApi } from '#/api/product/spec';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { Button, Card, Divider, Input, InputNumber } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createCommonSpec,
  getCommonSpec,
  updateCommonSpec,
} from '#/api/product/spec';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<ProductSpecApi.CommonSpecVO>();
const specValues = ref<ProductSpecApi.SpecValueVo[]>([]);

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
    const submitData = { ...values, values: specValues.value };
    (id.value
      ? updateCommonSpec({ id: id.value, ...submitData })
      : createCommonSpec(submitData)
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
      const data = drawerApi.getData<ProductSpecApi.CommonSpecVO>();
      formApi.resetForm();
      specValues.value = [];

      if (data && data.id) {
        const detail = await getCommonSpec(data.id);
        formData.value = detail;
        id.value = detail.id;
        specValues.value = detail.values || [];
        await nextTick();
        formApi.setValues(detail);
      } else {
        formData.value = undefined;
        id.value = undefined;
      }
    }
  },
});

function addSpecValue() {
  specValues.value.push({ title: '', sort: 0 });
}

function removeSpecValue(index: number) {
  specValues.value.splice(index, 1);
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('product.spec.name')])
    : $t('ui.actionTitle.create', [$t('product.spec.name')]);
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
    <Divider />
    <Card :title="$t('product.spec.values')" size="small">
      <div
        v-for="(item, index) in specValues"
        :key="index"
        class="flex items-center gap-2 mb-2"
      >
        <Input
          v-model:value="item.title"
          :placeholder="$t('product.spec.valueName')"
          class="flex-1"
        />
        <InputNumber
          v-model:value="item.sort"
          :placeholder="$t('product.spec.valueSort')"
          :min="0"
          class="w-20"
        />
        <Button type="text" danger @click="removeSpecValue(index)">
          <DeleteOutlined />
        </Button>
      </div>
      <Button type="dashed" block @click="addSpecValue">
        <PlusOutlined />
        {{ $t('product.spec.addValue') }}
      </Button>
    </Card>
  </Drawer>
</template>
