import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace ProductCateApi {
  export interface CateVO {
    [key: string]: any;
    cover?: string;
    id?: number;
    is_recommend?: boolean;
    pid?: number;
    sort?: number;
    status?: number;
    sub_title?: string;
    title?: string;
  }

  export interface PageResult {
    list: CateVO[];
    total: number;
  }
}

async function getCatePage(params?: PageFetchParams) {
  return requestClient.get<ProductCateApi.CateVO[]>('/product/cate/page', {
    params,
  });
}

async function getCate(id: number) {
  return requestClient.get<ProductCateApi.CateVO>('/product/cate/get', {
    params: { id },
  });
}

async function createCate(data: Partial<ProductCateApi.CateVO>) {
  return requestClient.post('/product/cate/create', data);
}

async function updateCate(data: Partial<ProductCateApi.CateVO>) {
  return requestClient.put('/product/cate/update', data);
}

async function deleteCate(id: number) {
  return requestClient.delete('/product/cate/delete', { params: { id } });
}

async function treeSimpleCate() {
  return requestClient.get('/product/cate/tree-simple');
}

async function listSimpleCate() {
  return requestClient.post('/product/cate/list-all-simple');
}

export {
  createCate,
  deleteCate,
  getCate,
  getCatePage,
  listSimpleCate,
  treeSimpleCate,
  updateCate,
};
