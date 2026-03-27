import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace ProductApi {
  export interface ProductVO {
    [key: string]: any;
    cateIds?: number[];
    delivery_type?: number[];
    id?: number;
    is_spec?: boolean;
    name?: string;
    shipping_fee?: number;
    shipping_fee_id?: number;
    shipping_type?: number;
    sketch?: string;
    sort?: number;
    spec_template_id?: number;
    status?: number;
    tags?: string[];
  }

  export interface ProductSpecValue {
    data?: string | string[];
    id?: number;
    pitch_on: boolean;
    title: string;
  }

  export interface ProductSpecVo {
    id: number;
    show_image: boolean;
    title: string;
    type: number;
    values?: ProductSpecValue[];
  }

  export interface ProductSkuVo {
    bar_code?: string;
    cost_price: number;
    data?: string;
    id?: number;
    is_default?: boolean;
    items?: any;
    market_price: number;
    name?: string;
    picture?: string[];
    price: number;
    product_id?: number;
    sku_no?: string;
    stock: number;
    volume?: number;
    weight?: number;
  }

  export interface PageResult {
    list: ProductVO[];
    total: number;
  }
}

async function getProductPage(params?: PageFetchParams) {
  return requestClient.get<ProductApi.PageResult>('/product/product/page', {
    params,
  });
}

async function getProduct(id: number) {
  return requestClient.get<ProductApi.ProductVO>('/product/product/get', {
    params: { id },
  });
}

async function getProductByIds(ids: number[]) {
  return requestClient.post('/product/product/get-by-ids', { ids });
}

async function createProduct(data: Partial<ProductApi.ProductVO>) {
  return requestClient.post('/product/product/create', data);
}

async function updateProduct(data: Partial<ProductApi.ProductVO>) {
  return requestClient.put('/product/product/update', data);
}

async function deleteProduct(id: number) {
  return requestClient.delete('/product/product/delete', { params: { id } });
}

async function modifyProduct(params: Record<string, any>) {
  return requestClient.post('/product/product/modify', params);
}

export {
  createProduct,
  deleteProduct,
  getProduct,
  getProductByIds,
  getProductPage,
  modifyProduct,
  updateProduct,
};
