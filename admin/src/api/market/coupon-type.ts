import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace MarketCouponTypeApi {
  export interface CouponTypeVO {
    [key: string]: any;
    id?: number;
    title?: string;
    remark?: string;
    at_least?: number;
    discount_type?: number;
    discount?: number;
    count?: number;
    max_fetch?: number;
    max_fetch_per_day?: number;
    get_type?: number;
    get_start_time?: number;
    get_end_time?: number;
    validity_type?: number;
    start_time?: number;
    end_time?: number;
    validity_days?: number;
    rang_type?: number;
    cateIds?: number[];
    productIds?: number[];
    is_new_people?: number;
    single_type?: number;
    sort?: number;
    status?: number;
  }

  export interface PageResult {
    list: CouponTypeVO[];
    total: number;
  }
}

async function getCouponTypePage(params?: PageFetchParams) {
  return requestClient.get<MarketCouponTypeApi.PageResult>('/market/coupon-type/page', { params });
}

async function getCouponType(id: number) {
  return requestClient.get<MarketCouponTypeApi.CouponTypeVO>('/market/coupon-type/get', { params: { id } });
}

async function createCouponType(data: MarketCouponTypeApi.CouponTypeVO) {
  return requestClient.post('/market/coupon-type/create', data);
}

async function updateCouponType(data: MarketCouponTypeApi.CouponTypeVO) {
  return requestClient.put('/market/coupon-type/update', data);
}

async function deleteCouponType(id: number) {
  return requestClient.delete('/market/coupon-type/delete', { params: { id } });
}

export { createCouponType, deleteCouponType, getCouponType, getCouponTypePage, updateCouponType };
