<script lang="ts" setup>
import type { SystemDeptApi } from '#/api/system/dept';

import { computed, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message, Select, Spin, Tree } from 'ant-design-vue';

import { getDeptSimpleTree } from '#/api/system/dept';
import { updateRole } from '#/api/system/role';
import { $t } from '#/locales';

const emit = defineEmits(['success']);

const roleId = ref<number>();
const roleName = ref<string>('');
const dataScope = ref<number>(1);
const checkedDeptIds = ref<number[]>([]);
const deptTree = ref<SystemDeptApi.DeptSimple[]>([]);
const loading = ref(false);

const dataScopeOptions = [
  { label: '全部数据权限', value: 1 },
  { label: '自定数据权限', value: 2 },
  { label: '本部门数据权限', value: 3 },
  { label: '本部门及以下数据权限', value: 4 },
  { label: '仅本人数据权限', value: 5 },
];

const showDeptTree = computed(() => dataScope.value === 2);

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    if (!roleId.value) return;
    drawerApi.lock();
    try {
      await updateRole({
        dataScope: dataScope.value,
        dataScopeDeptIds:
          dataScope.value === 2 ? checkedDeptIds.value.join(',') : '',
        id: roleId.value,
      });
      message.success($t('ui.actionMessage.operationSuccess'));
      emit('success');
      drawerApi.close();
    } finally {
      drawerApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data =
        drawerApi.getData<{
          dataScope?: number;
          dataScopeDeptIds?: string;
          id: number;
          name: string;
        }>();
      if (data) {
        roleId.value = data.id;
        roleName.value = data.name;
        dataScope.value = data.dataScope || 1;
        checkedDeptIds.value = data.dataScopeDeptIds
          ? data.dataScopeDeptIds
              .split(',')
              .filter(Boolean)
              .map((id) => Number(id))
          : [];
      }
      await loadDeptTree();
    }
  },
});

async function loadDeptTree() {
  loading.value = true;
  try {
    deptTree.value = await getDeptSimpleTree();
  } finally {
    loading.value = false;
  }
}

watch(dataScope, (val) => {
  if (val !== 2) {
    checkedDeptIds.value = [];
  }
});

const drawerTitle = computed(
  () =>
    $t('system.role.dataScope') +
    (roleName.value ? ` - ${roleName.value}` : ''),
);
</script>

<template>
  <Drawer :title="drawerTitle">
    <Spin :spinning="loading">
      <div class="flex flex-col gap-4">
        <div>
          <div class="mb-2 font-medium">{{ $t('system.role.dataScope') }}</div>
          <Select
            v-model:value="dataScope"
            :options="dataScopeOptions"
            class="w-full"
          />
        </div>
        <div v-if="showDeptTree">
          <div class="mb-2 font-medium">
            {{ $t('system.role.dataScopeDept') }}
          </div>
          <Tree
            v-model:checked-keys="checkedDeptIds"
            :tree-data="deptTree as any"
            :field-names="{ title: 'name', key: 'id', children: 'children' }"
            checkable
            default-expand-all
          />
        </div>
      </div>
    </Spin>
  </Drawer>
</template>
