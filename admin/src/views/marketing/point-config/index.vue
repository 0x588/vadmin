<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getPointConfig, updatePointConfig } from '#/api/market/point-config';
import { $t } from '#/locales';

import { useFormSchema } from './data';

const loading = ref(true);
const saving = ref(false);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  wrapperClass: 'grid-cols-1',
});

onMounted(async () => {
  try {
    const data = await getPointConfig();
    if (data) {
      formApi.setValues(data);
    }
  } finally {
    loading.value = false;
  }
});

async function onSave() {
  const { valid } = await formApi.validate();
  if (!valid) return;
  saving.value = true;
  try {
    const values = await formApi.getValues();
    await updatePointConfig(values);
    message.success($t('ui.actionMessage.operationSuccess'));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <Card :title="$t('market.pointConfig.title')">
      <Spin :spinning="loading">
        <div class="mx-auto mt-4 max-w-200">
          <Form />
          <div class="flex justify-end mt-4">
            <Button type="primary" :loading="saving" @click="onSave">
              {{ $t('system.configEdit.save') }}
            </Button>
          </div>
        </div>
      </Spin>
    </Card>
  </Page>
</template>
