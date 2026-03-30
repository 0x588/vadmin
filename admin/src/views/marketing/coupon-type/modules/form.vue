<script lang="ts" setup>
import type { MarketCouponTypeApi } from '#/api/market/coupon-type';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createCouponType,
  getCouponType,
  updateCouponType,
} from '#/api/market/coupon-type';
import { $t } from '#/locales';
import ProductSelect from '#/views/product/product/ProductSelect.vue';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<MarketCouponTypeApi.CouponTypeVO>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

function tsToDay(ts: number) {
  return ts ? dayjs.unix(ts) : undefined;
}

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    // Convert time ranges back to timestamps
    if (values.getTimeRange?.length === 2) {
      values.get_start_time = dayjs(values.getTimeRange[0]).unix();
      values.get_end_time = dayjs(values.getTimeRange[1]).unix();
    }
    delete values.getTimeRange;
    if (values.validityTimeRange?.length === 2) {
      values.start_time = dayjs(values.validityTimeRange[0]).unix();
      values.end_time = dayjs(values.validityTimeRange[1]).unix();
    }
    delete values.validityTimeRange;

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
      await formApi.resetForm();

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
        const d = formData.value;
        formApi.setValues({
          ...d,
          getTimeRange:
            d.get_start_time && d.get_end_time
              ? [tsToDay(d.get_start_time), tsToDay(d.get_end_time)]
              : undefined,
          validityTimeRange:
            d.start_time && d.end_time
              ? [tsToDay(d.start_time), tsToDay(d.end_time)]
              : undefined,
        });
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
    <Form>
      <template #productIds="slotProps">
        <ProductSelect
          :values="slotProps.modelValue || []"
          @update:values="slotProps.onChange"
        />
      </template>
    </Form>
  </Drawer>
</template>
