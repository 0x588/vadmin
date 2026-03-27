import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace MarketCouponApi {
  export interface CouponVO {
    [key: string]: any;
    discount_type?: number;
    end_time?: string;
    fetch_time?: string;
    id?: number;
    member_id?: number;
    single_type?: number;
    state?: number;
    title?: string;
  }

  export interface PageResult {
    list: CouponVO[];
    total: number;
  }
}

async function getCouponPage(params?: PageFetchParams) {
  return requestClient.get<MarketCouponApi.PageResult>('/market/coupon/page', {
    params,
  });
}

export { getCouponPage };
