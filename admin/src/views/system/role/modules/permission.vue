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
const halfCheckedKeys = ref<number[]>([]);
const loading = ref(false);

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    if (!roleId.value) return;
    drawerApi.lock();
    try {
      await assignRoleMenu(roleId.value, [
        ...checkedKeys.value,
        ...halfCheckedKeys.value,
      ]);
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
    // Exclude parent IDs so cascade check doesn't auto-select all children
    const parentIds = collectParentIds(tree);
    checkedKeys.value = menuIds.filter((id) => !parentIds.has(id));
    halfCheckedKeys.value = [];
  } finally {
    loading.value = false;
  }
}

function collectParentIds(
  nodes: SystemMenuApi.MenuSimple[],
): Set<number> {
  const parentIds = new Set<number>();
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      parentIds.add(node.id);
      for (const id of collectParentIds(node.children)) {
        parentIds.add(id);
      }
    }
  }
  return parentIds;
}

function onCheck(
  checked: number[] | { checked: number[]; halfChecked: number[] },
  e: any,
) {
  if (Array.isArray(checked)) {
    checkedKeys.value = checked;
    halfCheckedKeys.value = (e.halfCheckedKeys as number[]) || [];
  }
}

const drawerTitle = computed(
  () =>
    $t('system.role.assignPermission') +
    (roleName.value ? ` - ${roleName.value}` : ''),
);
</script>

<template>
  <Drawer :title="drawerTitle">
    <Spin :spinning="loading">
      <Tree
        :checked-keys="checkedKeys"
        :tree-data="menuTree as any"
        :field-names="{ title: 'name', key: 'id', children: 'children' }"
        checkable
        default-expand-all
        @check="onCheck"
      />
    </Spin>
  </Drawer>
</template>
