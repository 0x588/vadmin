import { requestClient } from '#/api/request';

export namespace MarketFullMailApi {
  export interface FullMailVO {
    id?: number;
    min_order_money?: number;
    no_mail_city_ids?: string;
    no_mail_province_ids?: string;
    status?: number;
  }
}

async function getFullMail() {
  return requestClient.get<MarketFullMailApi.FullMailVO>(
    '/market/full-mail/get',
  );
}

async function updateFullMail(data: MarketFullMailApi.FullMailVO) {
  return requestClient.put('/market/full-mail/update', data);
}

export { getFullMail, updateFullMail };
