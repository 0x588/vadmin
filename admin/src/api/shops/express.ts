import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace ShopsExpressApi {
  export interface ExpressVO {
    [key: string]: any;
    id?: number;
    is_default?: boolean;
    name?: string;
    sort?: number;
    status?: number;
  }

  export interface PageResult {
    list: ExpressVO[];
    total: number;
  }
}

async function getExpressPage(params?: PageFetchParams) {
  return requestClient.get<ShopsExpressApi.PageResult>('/common/express/page', {
    params,
  });
}

async function getExpress(id: number) {
  return requestClient.get<ShopsExpressApi.ExpressVO>('/common/express/get', {
    params: { id },
  });
}

async function createExpress(data: Partial<ShopsExpressApi.ExpressVO>) {
  return requestClient.post('/common/express/create', data);
}

async function updateExpress(data: Partial<ShopsExpressApi.ExpressVO>) {
  return requestClient.put('/common/express/update', data);
}

async function deleteExpress(id: number) {
  return requestClient.delete('/common/express/delete', { params: { id } });
}

async function getExpressListAll() {
  return requestClient.get('/common/express/list-all-simple');
}

export {
  createExpress,
  deleteExpress,
  getExpress,
  getExpressListAll,
  getExpressPage,
  updateExpress,
};
