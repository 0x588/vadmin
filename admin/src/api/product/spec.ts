import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace ProductSpecApi {
  export interface SpecValueVo {
    id?: number;
    title: string;
    sort: number;
    is_tmp?: boolean;
    spec_id?: number;
  }

  export interface CommonSpecVO {
    [key: string]: any;
    id?: number;
    type?: number;
    title?: string;
    desc?: string;
    is_tmp?: boolean;
    sort?: number;
    status?: number;
    values?: SpecValueVo[];
  }

  export interface PageResult {
    list: CommonSpecVO[];
    total: number;
  }
}

async function getCommonSpecPage(params?: PageFetchParams) {
  return requestClient.get<ProductSpecApi.PageResult>('/product/common-spec/page', { params });
}

async function getCommonSpec(id: number) {
  return requestClient.get<ProductSpecApi.CommonSpecVO>('/product/common-spec/get', { params: { id } });
}

async function createCommonSpec(data: Partial<ProductSpecApi.CommonSpecVO>) {
  return requestClient.post('/product/common-spec/create', data);
}

async function updateCommonSpec(data: Partial<ProductSpecApi.CommonSpecVO>) {
  return requestClient.put('/product/common-spec/update', data);
}

async function deleteCommonSpec(id: number) {
  return requestClient.delete('/product/common-spec/delete', { params: { id } });
}

async function listSimpleSpec() {
  return requestClient.get('/product/common-spec/list');
}

async function createCommonSpecValue(data: ProductSpecApi.SpecValueVo) {
  return requestClient.post('/product/common-spec-value/create', data);
}

export { createCommonSpec, createCommonSpecValue, deleteCommonSpec, getCommonSpec, getCommonSpecPage, listSimpleSpec, updateCommonSpec };
