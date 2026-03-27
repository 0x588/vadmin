<script lang="ts" setup>
import type { MarketCouponTypeApi } from '#/api/market/coupon-type';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  createCouponType,
  getCouponType,
  updateCouponType,
} from '#/api/market/coupon-type';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<MarketCouponTypeApi.CouponTypeVO>();

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
    (id.value
      ? updateCouponType({ id: id.value, ...values })
      : createCouponType(values)
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
      const data = drawerApi.getData<MarketCouponTypeApi.CouponTypeVO>();
      formApi.resetForm();

      if (data && data.id) {
        const detail = await getCouponType(data.id);
        formData.value = detail;
        id.value = detail.id;
      } else {
        formData.value = undefined;
        id.value = undefined;
      }

      await nextTick();
      if (formData.value) {
        formApi.setValues(formData.value);
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('market.couponType.name')])
    : $t('ui.actionTitle.create', [$t('market.couponType.name')]);
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
