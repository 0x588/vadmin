import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace ProductApi {
  export interface ProductVO {
    [key: string]: any;
    id?: number;
    name?: string;
    sketch?: string;
    cateIds?: number[];
    tags?: string[];
    delivery_type?: number[];
    shipping_type?: number;
    shipping_fee?: number;
    shipping_fee_id?: number;
    is_spec?: boolean;
    spec_template_id?: number;
    sort?: number;
    status?: number;
  }

  export interface ProductSpecValue {
    id?: number;
    title: string;
    data?: string | string[];
    pitch_on: boolean;
  }

  export interface ProductSpecVo {
    id: number;
    title: string;
    type: number;
    show_image: boolean;
    values?: ProductSpecValue[];
  }

  export interface ProductSkuVo {
    id?: number;
    product_id?: number;
    name?: string;
    picture?: string[];
    price: number;
    market_price: number;
    cost_price: number;
    stock: number;
    sku_no?: string;
    bar_code?: string;
    weight?: number;
    volume?: number;
    data?: string;
    is_default?: boolean;
    items?: any;
  }

  export interface PageResult {
    list: ProductVO[];
    total: number;
  }
}

async function getProductPage(params?: PageFetchParams) {
  return requestClient.get<ProductApi.PageResult>('/product/product/page', { params });
}

async function getProduct(id: number) {
  return requestClient.get<ProductApi.ProductVO>('/product/product/get', { params: { id } });
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

export { createProduct, deleteProduct, getProduct, getProductByIds, getProductPage, modifyProduct, updateProduct };
