<script lang="ts" setup>
import type { SystemMenuApi } from '#/api/system/menu';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message, Spin, Tree } from 'ant-design-vue';

import { getMenuSimpleTree } from '#/api/system/menu';
import { assignRoleMenu, listRoleMenuIds } from '#/api/system/permission';
import { $t } from '#/locales';

const emit = defineEmits(['success']);

const roleId = ref<number>();
const roleName = ref<string>('');
const menuTree = ref<SystemMenuApi.MenuSimple[]>([]);
const checkedKeys = ref<number[]>([]);
const loading = ref(false);

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    if (!roleId.value) return;
    drawerApi.lock();
    try {
      await assignRoleMenu(roleId.value, checkedKeys.value);
      message.success($t('ui.actionMessage.operationSuccess'));
      emit('success');
      drawerApi.close();
    } finally {
      drawerApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<{ id: number; name: string }>();
      if (data) {
        roleId.value = data.id;
        roleName.value = data.name;
      }
      await loadData();
    }
  },
});

async function loadData() {
  loading.value = true;
  try {
    const [tree, menuIds] = await Promise.all([
      getMenuSimpleTree(),
      roleId.value ? listRoleMenuIds(roleId.value) : Promise.resolve([]),
    ]);
    menuTree.value = tree;
    checkedKeys.value = menuIds;
  } finally {
    loading.value = false;
  }
}

const drawerTitle = computed(() =>
  $t('system.role.assignPermission') +
    (roleName.value ? ` - ${roleName.value}` : ''),
);
</script>

<template>
  <Drawer :title="drawerTitle">
    <Spin :spinning="loading">
      <Tree
        v-model:checked-keys="checkedKeys"
        :tree-data="menuTree"
        :field-names="{ title: 'name', key: 'id', children: 'children' }"
        checkable
        check-strictly
        default-expand-all
      />
    </Spin>
  </Drawer>
</template>
