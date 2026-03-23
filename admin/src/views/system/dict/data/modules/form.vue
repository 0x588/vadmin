<script lang="ts" setup>
import type { SystemDictDataApi } from '#/api/system/dict-data';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDictData, updateDictData } from '#/api/system/dict-data';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<SystemDictDataApi.DictData>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.dictData.name')])
    : $t('ui.actionTitle.create', [$t('system.dictData.name')]);
});

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useFormSchema(),
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
          ? updateDictData({ id: formData.value.id, ...data })
          : createDictData(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDictDataApi.DictData>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);
        // Make dictType readonly when editing
        if (data.id) {
          formApi.updateSchema([
            { componentProps: { disabled: true }, fieldName: 'dictType' },
          ]);
        } else {
          formApi.updateSchema([
            { componentProps: { disabled: false }, fieldName: 'dictType' },
          ]);
        }
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
