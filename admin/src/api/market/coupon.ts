import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace MarketCouponApi {
  export interface CouponVO {
    [key: string]: any;
    id?: number;
    title?: string;
    member_id?: number;
    discount_type?: number;
    end_time?: string;
    single_type?: number;
    state?: number;
    fetch_time?: string;
  }

  export interface PageResult {
    list: CouponVO[];
    total: number;
  }
}

async function getCouponPage(params?: PageFetchParams) {
  return requestClient.get<MarketCouponApi.PageResult>('/market/coupon/page', { params });
}

export { getCouponPage };
