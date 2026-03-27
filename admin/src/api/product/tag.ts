import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace ProductTagApi {
  export interface TagVO {
    [key: string]: any;
    id?: number;
    title?: string;
    sort?: number;
    status?: number;
  }

  export interface PageResult {
    list: TagVO[];
    total: number;
  }
}

async function getTagPage(params?: PageFetchParams) {
  return requestClient.get<ProductTagApi.PageResult>('/product/tag/page', { params });
}

async function getTag(id: number) {
  return requestClient.get<ProductTagApi.TagVO>('/product/tag/get', { params: { id } });
}

async function createTag(data: Partial<ProductTagApi.TagVO>) {
  return requestClient.post('/product/tag/create', data);
}

async function updateTag(data: Partial<ProductTagApi.TagVO>) {
  return requestClient.put('/product/tag/update', data);
}

async function deleteTag(id: number) {
  return requestClient.delete('/product/tag/delete', { params: { id } });
}

async function listSimpleTag() {
  return requestClient.get('/product/tag/list');
}

export { createTag, deleteTag, getTag, getTagPage, listSimpleTag, updateTag };
