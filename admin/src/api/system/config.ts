import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemConfigApi {
  export interface ConfigCate {
    [key: string]: any;
    app?: string;
    children?: ConfigCate[];
    createdAt?: string;
    id: number;
    name: string;
    pid?: number;
    sort?: number;
    status: number;
    title: string;
  }

  export interface ConfigCateSimple {
    children?: ConfigCateSimple[];
    id: number;
    parentId: number;
    sort: number;
    title: string;
  }

  export interface Config {
    [key: string]: any;
    cateId: number;
    createdAt?: string;
    defaultValue?: string;
    hideRemark?: boolean;
    id: number;
    name: string;
    options?: string;
    remark?: string;
    sort?: number;
    status: number;
    title: string;
    type?: string;
    value?: ConfigValue;
  }

  export interface ConfigValue {
    configId: number;
    data: string;
    id: number;
    merchantId: number;
  }

  export interface ConfigEditAll {
    children?: ConfigEditAll[];
    config?: ConfigWithValue[];
    id: number;
    name: string;
    title: string;
  }

  export interface ConfigWithValue {
    cateId: number;
    defaultValue?: string;
    hideRemark?: boolean;
    id: number;
    name: string;
    options?: string;
    remark?: string;
    title: string;
    type?: string;
    value?: ConfigValue;
  }

  export interface PageResult {
    list: Config[];
    total: number;
  }
}

// --- Config Category ---
async function getConfigCateList(params?: Record<string, any>) {
  return requestClient.get<SystemConfigApi.ConfigCate[]>(
    '/system/common-config-cate/list',
    { params },
  );
}

async function getConfigCateSimpleTree() {
  return requestClient.get<SystemConfigApi.ConfigCateSimple[]>(
    '/system/common-config-cate/tree-simple',
  );
}

async function getConfigCate(id: number) {
  return requestClient.get<SystemConfigApi.ConfigCate>(
    '/system/common-config-cate/get',
    { params: { id } },
  );
}

async function createConfigCate(data: Partial<SystemConfigApi.ConfigCate>) {
  return requestClient.post('/system/common-config-cate/create', data);
}

async function updateConfigCate(data: Partial<SystemConfigApi.ConfigCate>) {
  return requestClient.put('/system/common-config-cate/update', data);
}

async function deleteConfigCate(id: number) {
  return requestClient.delete('/system/common-config-cate/delete', {
    params: { id },
  });
}

// --- Config ---
async function getConfigPage(params?: PageFetchParams) {
  return requestClient.get<SystemConfigApi.PageResult>(
    '/system/common-config/page',
    { params },
  );
}

async function getConfigList(cateId: number) {
  return requestClient.get<SystemConfigApi.Config[]>(
    '/system/common-config/list',
    { params: { cateId } },
  );
}

async function getConfig(id: number) {
  return requestClient.get<SystemConfigApi.Config>(
    '/system/common-config/get',
    { params: { id } },
  );
}

async function createConfig(data: Partial<SystemConfigApi.Config>) {
  return requestClient.post('/system/common-config/create', data);
}

async function updateConfig(data: Partial<SystemConfigApi.Config>) {
  return requestClient.put('/system/common-config/update', data);
}

async function deleteConfig(id: number) {
  return requestClient.delete('/system/common-config/delete', {
    params: { id },
  });
}

// --- Config Edit ---
async function getConfigEditAll() {
  return requestClient.get<SystemConfigApi.ConfigEditAll[]>(
    '/system/config-edit/all',
  );
}

async function saveConfigEdit(data: Record<string, any>) {
  return requestClient.post('/system/config-edit/save', data);
}

export {
  createConfig,
  createConfigCate,
  deleteConfig,
  deleteConfigCate,
  getConfig,
  getConfigCate,
  getConfigCateList,
  getConfigCateSimpleTree,
  getConfigEditAll,
  getConfigList,
  getConfigPage,
  saveConfigEdit,
  updateConfig,
  updateConfigCate,
};
