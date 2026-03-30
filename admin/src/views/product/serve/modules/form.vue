<script lang="ts" setup>
import type { ProductServeApi } from '#/api/product/serve';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createServe, updateServe } from '#/api/product/serve';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<ProductServeApi.ServeVO>();

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
    // Convert fileList to URL string
    const fileList = values.cover;
    if (Array.isArray(fileList) && fileList.length > 0) {
      const file = fileList[0];
      values.cover = file?.response?.url || file?.url || '';
    } else {
      values.cover = '';
    }
    drawerApi.lock();
    (id.value ? updateServe({ id: id.value, ...values }) : createServe(values))
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
      const data = drawerApi.getData<ProductServeApi.ServeVO>();
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
    ? $t('ui.actionTitle.edit', [$t('product.serve.name')])
    : $t('ui.actionTitle.create', [$t('product.serve.name')]);
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
