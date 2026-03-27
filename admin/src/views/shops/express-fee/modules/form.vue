<script lang="ts" setup>
import type { ShopsExpressFeeApi } from '#/api/shops/express-fee';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  createExpressFee,
  getExpressFee,
  updateExpressFee,
} from '#/api/shops/express-fee';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<ShopsExpressFeeApi.ExpressFeeVO>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const expressId = ref<number>();

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    const submitData = { ...values, express_id: expressId.value };
    (id.value
      ? updateExpressFee({ id: id.value, ...submitData })
      : createExpressFee(submitData)
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
      const data = drawerApi.getData<ShopsExpressFeeApi.ExpressFeeVO>();
      formApi.resetForm();

      if (data && data.id) {
        const detail = await getExpressFee(data.id);
        formData.value = detail;
        id.value = detail.id;
        expressId.value = detail.express_id;
        await nextTick();
        formApi.setValues(detail);
      } else {
        formData.value = undefined;
        id.value = undefined;
        expressId.value = data?.express_id;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('shops.expressFee.name')])
    : $t('ui.actionTitle.create', [$t('shops.expressFee.name')]);
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
