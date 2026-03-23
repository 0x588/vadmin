import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface Role {
    [key: string]: any;
    code: string;
    createdAt?: string;
    dataScope?: number;
    dataScopeDeptIds?: string;
    id: number;
    name: string;
    remark?: string;
    sort?: number;
    status: number;
    type?: number;
  }

  export interface RoleSimple {
    id: number;
    name: string;
  }

  export interface PageResult {
    list: Role[];
    total: number;
  }
}

async function getRolePage(params?: PageFetchParams) {
  return requestClient.get<SystemRoleApi.PageResult>('/system/role/page', {
    params,
  });
}

async function getRole(id: number) {
  return requestClient.get<SystemRoleApi.Role>('/system/role/get', {
    params: { id },
  });
}

async function getRoleSimpleList() {
  return requestClient.get<SystemRoleApi.RoleSimple[]>(
    '/system/role/list-all-simple',
  );
}

async function createRole(data: Partial<SystemRoleApi.Role>) {
  return requestClient.post('/system/role/create', data);
}

async function updateRole(data: Partial<SystemRoleApi.Role>) {
  return requestClient.put('/system/role/update', data);
}

async function deleteRole(id: number) {
  return requestClient.delete('/system/role/delete', { params: { id } });
}

export {
  createRole,
  deleteRole,
  getRole,
  getRolePage,
  getRoleSimpleList,
  updateRole,
};
