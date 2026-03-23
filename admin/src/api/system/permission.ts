import { requestClient } from '#/api/request';

async function assignRoleMenu(roleId: number, menuIds: number[]) {
  return requestClient.post('/system/permission/assign-role-menu', {
    menuIds,
    roleId,
  });
}

async function listRoleMenuIds(roleId: number) {
  return requestClient.get<number[]>('/system/permission/list-role-menus', {
    params: { roleId },
  });
}

async function assignUserRole(userId: number, roleId: number) {
  return requestClient.post('/system/permission/assign-user-role', {
    roleId,
    userId,
  });
}

export { assignRoleMenu, assignUserRole, listRoleMenuIds };
