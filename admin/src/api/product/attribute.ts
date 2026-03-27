import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace ProductAttributeApi {
  export interface AttributeValue {
    data?: string;
    id?: number;
    sort: number;
    title: string;
    type: number;
    value?: string;
  }

  export interface CommonAttributeVO {
    [key: string]: any;
    id?: number;
    sort?: number;
    status?: number;
    title?: string;
    values?: AttributeValue[];
  }

  export interface PageResult {
    list: CommonAttributeVO[];
    total: number;
  }
}

async function getCommonAttributePage(params?: PageFetchParams) {
  return requestClient.get<ProductAttributeApi.PageResult>(
    '/product/common-attribute/page',
    { params },
  );
}

async function getCommonAttribute(id: number) {
  return requestClient.get<ProductAttributeApi.CommonAttributeVO>(
    '/product/common-attribute/get',
    { params: { id } },
  );
}

async function createCommonAttribute(
  data: Partial<ProductAttributeApi.CommonAttributeVO>,
) {
  return requestClient.post('/product/common-attribute/create', data);
}

async function updateCommonAttribute(
  data: Partial<ProductAttributeApi.CommonAttributeVO>,
) {
  return requestClient.put('/product/common-attribute/update', data);
}

async function deleteCommonAttribute(id: number) {
  return requestClient.delete('/product/common-attribute/delete', {
    params: { id },
  });
}

async function listSimpleAttribute() {
  return requestClient.get('/product/common-attribute/list');
}

export {
  createCommonAttribute,
  deleteCommonAttribute,
  getCommonAttribute,
  getCommonAttributePage,
  listSimpleAttribute,
  updateCommonAttribute,
};
