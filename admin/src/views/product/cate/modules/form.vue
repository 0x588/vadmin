<script lang="ts" setup>
import type { ProductCateApi } from '#/api/product/cate';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createCate, updateCate } from '#/api/product/cate';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<ProductCateApi.CateVO>();

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
    // Convert fileList to URL string for cover
    if (Array.isArray(values.cover)) {
      const file = values.cover[0];
      values.cover = file?.response?.url || file?.url || '';
    }
    drawerApi.lock();
    (id.value ? updateCate({ id: id.value, ...values }) : createCate(values))
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
      const data = drawerApi.getData<ProductCateApi.CateVO>();
      formApi.resetForm();
      if (data && data.id) {
        formData.value = data;
        id.value = data.id;
      } else {
        formData.value = undefined;
        id.value = undefined;
      }
      await nextTick();
      if (formData.value) {
        const vals = { ...formData.value };
        // Convert cover URL to fileList for Upload component
        if (vals.cover && typeof vals.cover === 'string') {
          vals.cover = [
            { name: 'cover', status: 'done', uid: '-1', url: vals.cover },
          ] as any;
        }
        formApi.setValues(vals);
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('product.cate.name')])
    : $t('ui.actionTitle.create', [$t('product.cate.name')]);
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
