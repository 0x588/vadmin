import { requestClient } from '#/api/request';

export namespace MarketPointConfigApi {
  export interface PointConfigVO {
    id?: number;
    convert_rate?: number;
    min_order_money?: number;
    deduction_type?: number;
    max_rate?: number;
    max_money?: number;
    explain?: string;
    status?: number;
  }
}

async function getPointConfig() {
  return requestClient.get<MarketPointConfigApi.PointConfigVO>('/market/point-config/get');
}

async function updatePointConfig(data: MarketPointConfigApi.PointConfigVO) {
  return requestClient.put('/market/point-config/update', data);
}

export { getPointConfig, updatePointConfig };
