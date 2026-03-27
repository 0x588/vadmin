import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace ProductServeApi {
  export interface ServeVO {
    [key: string]: any;
    id?: number;
    name?: string;
    cover?: string;
    explain?: string;
    sort?: number;
    status?: number;
  }

  export interface PageResult {
    list: ServeVO[];
    total: number;
  }
}

async function getServePage(params?: PageFetchParams) {
  return requestClient.get<ProductServeApi.PageResult>('/product/serve/page', { params });
}

async function getServe(id: number) {
  return requestClient.get<ProductServeApi.ServeVO>('/product/serve/get', { params: { id } });
}

async function createServe(data: Partial<ProductServeApi.ServeVO>) {
  return requestClient.post('/product/serve/create', data);
}

async function updateServe(data: Partial<ProductServeApi.ServeVO>) {
  return requestClient.put('/product/serve/update', data);
}

async function deleteServe(id: number) {
  return requestClient.delete('/product/serve/delete', { params: { id } });
}

export { createServe, deleteServe, getServe, getServePage, updateServe };
