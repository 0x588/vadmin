import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface User {
    [key: string]: any;
    avatar?: string;
    createdAt?: string;
    deptId?: number;
    deptName?: string;
    email?: string;
    id: number;
    loginDate?: number;
    loginIp?: string;
    mobile?: string;
    nickname?: string;
    remark?: string;
    roleId?: number;
    sex?: number;
    status: number;
    username: string;
  }

  export interface UserSimple {
    deptId: number;
    deptName: string;
    id: number;
    nickname: string;
  }

  export interface PageResult {
    list: User[];
    total: number;
  }
}

async function getUserPage(params?: PageFetchParams) {
  return requestClient.get<SystemUserApi.PageResult>('/system/user/page', {
    params,
  });
}

async function getUser(id: number) {
  return requestClient.get<SystemUserApi.User>('/system/user/get', {
    params: { id },
  });
}

async function getUserSimpleList() {
  return requestClient.get<SystemUserApi.UserSimple[]>(
    '/system/user/list-all-simple',
  );
}

async function createUser(data: Partial<SystemUserApi.User>) {
  return requestClient.post('/system/user/create', data);
}

async function updateUser(data: Partial<SystemUserApi.User>) {
  return requestClient.put('/system/user/update', data);
}

async function deleteUser(id: number) {
  return requestClient.delete('/system/user/delete', { params: { id } });
}

async function updateUserPassword(id: number, password: string) {
  return requestClient.put('/system/user/update-password', { id, password });
}

async function updateUserStatus(id: number, status: number) {
  return requestClient.put('/system/user/update-status', { id, status });
}

export {
  createUser,
  deleteUser,
  getUser,
  getUserPage,
  getUserSimpleList,
  updateUser,
  updateUserPassword,
  updateUserStatus,
};
