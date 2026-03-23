import type { PageFetchParams } from '#/api/request';

import { requestClient } from '#/api/request';

export namespace SystemLoginLogApi {
  export interface LoginLog {
    [key: string]: any;
    createdAt?: string;
    id: number;
    logType: number;
    result: number;
    traceId?: string;
    userAgent?: string;
    userId?: number;
    userIp?: string;
    userName?: string;
    userType?: number;
  }

  export interface PageResult {
    list: LoginLog[];
    total: number;
  }
}

async function getLoginLogPage(params?: PageFetchParams) {
  return requestClient.get<SystemLoginLogApi.PageResult>(
    '/system/login-log/page',
    { params },
  );
}

export { getLoginLogPage };
