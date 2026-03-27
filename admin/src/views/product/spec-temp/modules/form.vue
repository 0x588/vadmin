<script lang="ts" setup>
import type { ProductSpecTempApi } from '#/api/product/spec-temp';

import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Input, InputNumber, RadioGroup, Transfer } from 'ant-design-vue';

import { listSimpleSpec } from '#/api/product/spec';
import {
  createCommonSpecTemp,
  getCommonSpecTemp,
  updateCommonSpecTemp,
} from '#/api/product/spec-temp';
import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

const emits = defineEmits(['success']);
const formData = ref<ProductSpecTempApi.CommonSpecTemplateVO>();
const title = ref('');
const sort = ref(0);
const status = ref(1);
const selectedSpecIds = ref<string[]>([]);
const specList = ref<any[]>([]);

const id = ref();

onMounted(async () => {
  const list = await listSimpleSpec();
  specList.value = (list || []).map((item: any) => ({
    key: String(item.id),
    title: item.title,
  }));
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    if (!title.value) return;
    drawerApi.lock();
    const data = {
      title: title.value,
      specIds: selectedSpecIds.value.join(','),
      sort: sort.value,
      status: status.value,
    };
    (id.value
      ? updateCommonSpecTemp({ id: id.value, ...data })
      : createCommonSpecTemp(data)
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
      const data = drawerApi.getData<ProductSpecTempApi.CommonSpecTemplateVO>();
      title.value = '';
      sort.value = 0;
      status.value = 1;
      selectedSpecIds.value = [];

      if (data && data.id) {
        const detail = await getCommonSpecTemp(data.id);
        formData.value = detail;
        id.value = detail.id;
        title.value = detail.title || '';
        sort.value = detail.sort || 0;
        status.value = detail.status ?? 1;
        selectedSpecIds.value = detail.specIds
          ? String(detail.specIds).split(',')
          : [];
      } else {
        formData.value = undefined;
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('product.specTemp.name')])
    : $t('ui.actionTitle.create', [$t('product.specTemp.name')]);
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <div class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">{{
          $t('product.specTemp.name')
        }}</label>
        <Input v-model:value="title" />
      </div>
      <div>
        <label class="block mb-1 font-medium">{{
          $t('product.specTemp.specIds')
        }}</label>
        <Transfer
          v-model:target-keys="selectedSpecIds"
          :data-source="specList"
          :titles="['可选规格', '已选规格']"
          :render="(item: any) => item.title"
          show-search
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">{{
          $t('product.specTemp.sort')
        }}</label>
        <InputNumber v-model:value="sort" :min="0" class="w-full" />
      </div>
      <div>
        <label class="block mb-1 font-medium">{{
          $t('product.specTemp.status')
        }}</label>
        <RadioGroup
          v-model:value="status"
          :options="getDictOptions(DICT_TYPE.COMMON_STATUS)"
          button-style="solid"
          option-type="button"
        />
      </div>
    </div>
  </Drawer>
</template>
