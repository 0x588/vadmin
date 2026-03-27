import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace ShopsExpressFeeApi {
  export interface ExpressFeeVO {
    [key: string]: any;
    id?: number;
    express_id?: number;
    title?: string;
    area?: string;
    weight_used?: boolean;
    weight?: number;
    weight_price?: number;
    weight_more?: number;
    weight_more_price?: number;
    volume_used?: boolean;
    volume?: number;
    volume_price?: number;
    volume_more?: number;
    volume_more_price?: number;
    piece_used?: boolean;
    piece?: number;
    piece_price?: number;
    piece_more?: number;
    piece_more_price?: number;
    is_default?: boolean;
    sort?: number;
    status?: number;
  }

  export interface PageResult {
    list: ExpressFeeVO[];
    total: number;
  }
}

async function getExpressFeePage(params?: PageFetchParams) {
  return requestClient.get<ShopsExpressFeeApi.PageResult>('/common/express-fee/page', { params });
}

async function getExpressFee(id: number) {
  return requestClient.get<ShopsExpressFeeApi.ExpressFeeVO>('/common/express-fee/get', { params: { id } });
}

async function createExpressFee(data: Partial<ShopsExpressFeeApi.ExpressFeeVO>) {
  return requestClient.post('/common/express-fee/create', data);
}

async function updateExpressFee(data: Partial<ShopsExpressFeeApi.ExpressFeeVO>) {
  return requestClient.put('/common/express-fee/update', data);
}

async function deleteExpressFee(id: number) {
  return requestClient.delete('/common/express-fee/delete', { params: { id } });
}

async function getExpressFeeHasDefault(expressId: number) {
  return requestClient.get('/common/express-fee/has-default', { params: { express_id: expressId } });
}

export { createExpressFee, deleteExpressFee, getExpressFee, getExpressFeeHasDefault, getExpressFeePage, updateExpressFee };
