import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemDictDataApi {
  export interface DictData {
    [key: string]: any;
    colorType?: string;
    createdAt?: string;
    cssClass?: string;
    dictType: string;
    id: number;
    label: string;
    remark?: string;
    sort?: number;
    status: number;
    value: string;
  }

  export interface DictDataSimple {
    colorType: string;
    cssClass: string;
    dictType: string;
    label: string;
    value: string;
  }

  export interface PageResult {
    list: DictData[];
    total: number;
  }
}

async function getDictDataPage(params?: PageFetchParams) {
  return requestClient.get<SystemDictDataApi.PageResult>(
    '/system/dict-data/page',
    { params },
  );
}

async function getDictData(id: number) {
  return requestClient.get<SystemDictDataApi.DictData>(
    '/system/dict-data/get',
    { params: { id } },
  );
}

async function getDictDataSimpleList() {
  return requestClient.get<SystemDictDataApi.DictDataSimple[]>(
    '/system/dict-data/list-all-simple',
  );
}

async function createDictData(data: Partial<SystemDictDataApi.DictData>) {
  return requestClient.post('/system/dict-data/create', data);
}

async function updateDictData(data: Partial<SystemDictDataApi.DictData>) {
  return requestClient.put('/system/dict-data/update', data);
}

async function deleteDictData(id: number) {
  return requestClient.delete('/system/dict-data/delete', {
    params: { id },
  });
}

export {
  createDictData,
  deleteDictData,
  getDictData,
  getDictDataPage,
  getDictDataSimpleList,
  updateDictData,
};
