import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemNotifyMessageApi {
  export interface NotifyMessage {
    [key: string]: any;
    createdAt?: string;
    id: number;
    readStatus: number;
    readTime?: string;
    templateCode?: string;
    templateContent?: string;
    templateId?: number;
    templateNickname?: string;
    templateParams?: string;
    templateType?: number;
    userId?: number;
    userType?: number;
  }

  export interface PageResult {
    list: NotifyMessage[];
    total: number;
  }
}

async function getNotifyMessagePage(params?: PageFetchParams) {
  return requestClient.get<SystemNotifyMessageApi.PageResult>(
    '/system/notify-message/page',
    { params },
  );
}

async function getNotifyMessage(id: number) {
  return requestClient.get<SystemNotifyMessageApi.NotifyMessage>(
    '/system/notify-message/get',
    { params: { id } },
  );
}

async function deleteNotifyMessage(id: number) {
  return requestClient.delete('/system/notify-message/delete', {
    params: { id },
  });
}

async function getUnreadNotifyMessageCount() {
  return requestClient.get<number>('/system/notify-message/get-unread-count');
}

export {
  deleteNotifyMessage,
  getNotifyMessage,
  getNotifyMessagePage,
  getUnreadNotifyMessageCount,
};
