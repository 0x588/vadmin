import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemDictTypeApi {
  export interface DictType {
    [key: string]: any;
    createdAt?: string;
    id: number;
    name: string;
    remark?: string;
    status: number;
    type: string;
  }

  export interface PageResult {
    list: DictType[];
    total: number;
  }
}

async function getDictTypePage(params?: PageFetchParams) {
  return requestClient.get<SystemDictTypeApi.PageResult>(
    '/system/dict-type/page',
    { params },
  );
}

async function getDictType(id: number) {
  return requestClient.get<SystemDictTypeApi.DictType>(
    '/system/dict-type/get',
    { params: { id } },
  );
}

async function createDictType(data: Partial<SystemDictTypeApi.DictType>) {
  return requestClient.post('/system/dict-type/create', data);
}

async function updateDictType(data: Partial<SystemDictTypeApi.DictType>) {
  return requestClient.put('/system/dict-type/update', data);
}

async function deleteDictType(id: number) {
  return requestClient.delete('/system/dict-type/delete', {
    params: { id },
  });
}

export {
  createDictType,
  deleteDictType,
  getDictType,
  getDictTypePage,
  updateDictType,
};
