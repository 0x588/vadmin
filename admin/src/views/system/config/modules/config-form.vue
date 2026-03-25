<script lang="ts" setup>
import type { SystemConfigApi } from '#/api/system/config';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createConfig, updateConfig } from '#/api/system/config';
import { $t } from '#/locales';

import { useConfigFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<SystemConfigApi.Config>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.config.name')])
    : $t('ui.actionTitle.create', [$t('system.config.name')]);
});

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useConfigFormSchema(),
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        await (formData.value?.id
          ? updateConfig({
              id: formData.value.id,
              cateId: formData.value.cateId,
              ...data,
            })
          : createConfig({ ...data, cateId: formData.value?.cateId }));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemConfigApi.Config>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
    <template #prepend-footer>
      <div class="flex-auto">
        <Button type="primary" danger @click="resetForm">
          {{ $t('common.reset') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
