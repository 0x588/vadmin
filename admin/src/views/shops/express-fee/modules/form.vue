<script lang="ts" setup>
import type { ShopsExpressFeeApi } from '#/api/shops/express-fee';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  createExpressFee,
  getExpressFee,
  getExpressFeeHasDefault,
  updateExpressFee,
} from '#/api/shops/express-fee';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<ShopsExpressFeeApi.ExpressFeeVO>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-4',
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
    delete submitData.hasDefault;
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
      await formApi.resetForm();

      expressId.value = data?.express_id;
      let hasDefault = false;
      try {
        if (expressId.value) {
          hasDefault = await getExpressFeeHasDefault(expressId.value);
        }
      } catch {}

      if (data && data.id) {
        const detail = await getExpressFee(data.id);
        formData.value = detail;
        id.value = detail.id;
        expressId.value = detail.express_id;
        // If editing the default template itself, allow changing is_default
        if (detail.is_default === 1 || detail.is_default === true) {
          hasDefault = false;
        }
        // Parse areas from JSON string if needed
        if (typeof detail.areas === 'string') {
          try {
            detail.areas = JSON.parse(detail.areas);
          } catch {
            detail.areas = [];
          }
        }
        await nextTick();
        formApi.setValues({ ...detail, hasDefault });
        // Set areas after nextTick for conditional field
        if (
          (detail.is_default === 0 || detail.is_default === false) &&
          detail.areas
        ) {
          await nextTick();
          formApi.setFieldValue('areas', detail.areas);
        }
      } else {
        formData.value = undefined;
        id.value = undefined;
        formApi.setValues({
          express_id: expressId.value,
          hasDefault,
          is_default: hasDefault ? 0 : 0,
        });
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
  <Drawer class="w-[800px]" :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
