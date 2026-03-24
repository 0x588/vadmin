<script setup lang="ts">
import type { SystemConfigApi } from '#/api/system/config';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Spin, Tabs } from 'ant-design-vue';

import { getConfigEditAll } from '#/api/system/config';

import BaseSetting from './BaseSetting.vue';

defineOptions({ name: 'ConfigEdit' });

const TabPane = Tabs.TabPane;
const settingList = ref<SystemConfigApi.ConfigEditAll[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    settingList.value = await getConfigEditAll();
  } finally {
    loading.value = false;
  }
});

const singlePanel = computed(() => {
  return (
    settingList.value.length === 1 &&
    (!settingList.value[0]?.children ||
      settingList.value[0].children.length === 0)
  );
});
</script>

<template>
  <Page auto-content-height content-class="bg-card rounded-md">
    <div v-if="loading" class="flex h-full items-center justify-center">
      <Spin size="large" />
    </div>
    <template v-else-if="singlePanel">
      <BaseSetting :cats="settingList" :cat-id="0" />
    </template>
    <template v-else>
      <Tabs tab-position="left" :tab-bar-style="{ width: '220px' }">
        <TabPane
          v-for="item in settingList"
          :key="item.id"
          :tab="item.title"
        >
          <BaseSetting :cats="item.children || [item]" :cat-id="item.id" />
        </TabPane>
      </Tabs>
    </template>
  </Page>
</template>
