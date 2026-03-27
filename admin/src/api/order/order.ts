import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace OrderApi {
  export interface OrderVO {
    [key: string]: any;
    id?: number;
    order_sn?: string;
    out_trade_no?: string;
    order_from?: string;
    order_type?: string;
    payment_type?: string;
    buyer_id?: number;
    buyer_nickname?: string;
    pay_money?: number;
    shipping_type?: number;
    order_status?: number;
    seller_memo?: string;
    created_at?: number;
  }

  export interface OrderStatusCount {
    [key: string]: number;
  }

  export interface PageResult {
    list: OrderVO[];
    total: number;
  }
}

async function getOrderPage(params?: PageFetchParams) {
  return requestClient.get<OrderApi.PageResult>('/order/page', { params });
}

async function getOrderStatusCount(params?: Record<string, any>) {
  return requestClient.get<OrderApi.OrderStatusCount>('/order/status-count', { params });
}

async function getOrder(id: number) {
  return requestClient.get<OrderApi.OrderVO>('/order/get', { params: { id } });
}

async function updateOrder(id: number, data: Partial<OrderApi.OrderVO>) {
  return requestClient.post('/order/update', { id, data });
}

async function deleteOrder(id: number) {
  return requestClient.delete('/order/delete', { params: { id } });
}

export { deleteOrder, getOrder, getOrderPage, getOrderStatusCount, updateOrder };
