import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace ProductSpecTempApi {
  export interface CommonSpecTemplateVO {
    [key: string]: any;
    id?: number;
    sort?: number;
    specIds?: string;
    status?: number;
    title?: string;
  }

  export interface PageResult {
    list: CommonSpecTemplateVO[];
    total: number;
  }
}

async function getCommonSpecTempPage(params?: PageFetchParams) {
  return requestClient.get<ProductSpecTempApi.PageResult>(
    '/product/common-spec-template/page',
    { params },
  );
}

async function getCommonSpecTemp(id: number) {
  return requestClient.get<ProductSpecTempApi.CommonSpecTemplateVO>(
    '/product/common-spec-template/get',
    { params: { id } },
  );
}

async function createCommonSpecTemp(
  data: Partial<ProductSpecTempApi.CommonSpecTemplateVO>,
) {
  return requestClient.post('/product/common-spec-template/create', data);
}

async function updateCommonSpecTemp(
  data: Partial<ProductSpecTempApi.CommonSpecTemplateVO>,
) {
  return requestClient.put('/product/common-spec-template/update', data);
}

async function deleteCommonSpecTemp(id: number) {
  return requestClient.delete('/product/common-spec-template/delete', {
    params: { id },
  });
}

async function listSimpleSpecTemplate() {
  return requestClient.get('/product/common-spec-template/list');
}

async function getCommonSpecsByTemplateId(id: number) {
  return requestClient.get('/product/common-spec-by-template-id/list', {
    params: { id },
  });
}

export {
  createCommonSpecTemp,
  deleteCommonSpecTemp,
  getCommonSpecsByTemplateId,
  getCommonSpecTemp,
  getCommonSpecTempPage,
  listSimpleSpecTemplate,
  updateCommonSpecTemp,
};
