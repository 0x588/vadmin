import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemNoticeApi {
  export interface Notice {
    [key: string]: any;
    content: string;
    createdAt?: string;
    id: number;
    status: number;
    title: string;
    type: number;
  }

  export interface PageResult {
    list: Notice[];
    total: number;
  }
}

async function getNoticePage(params?: PageFetchParams) {
  return requestClient.get<SystemNoticeApi.PageResult>('/system/notice/page', {
    params,
  });
}

async function getNotice(id: number) {
  return requestClient.get<SystemNoticeApi.Notice>('/system/notice/get', {
    params: { id },
  });
}

async function createNotice(data: Partial<SystemNoticeApi.Notice>) {
  return requestClient.post('/system/notice/create', data);
}

async function updateNotice(data: Partial<SystemNoticeApi.Notice>) {
  return requestClient.put('/system/notice/update', data);
}

async function deleteNotice(id: number) {
  return requestClient.delete('/system/notice/delete', { params: { id } });
}

export { createNotice, deleteNotice, getNotice, getNoticePage, updateNotice };
