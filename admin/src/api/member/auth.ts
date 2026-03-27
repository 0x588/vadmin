import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace MemberAuthApi {
  export interface MemberAuthVO {
    [key: string]: any;
    id?: number;
    member_id?: number;
    union_id?: string;
    client?: string;
    client_open_id?: string;
    status?: number;
    created_at?: number;
  }

  export interface PageResult {
    list: MemberAuthVO[];
    total: number;
  }
}

async function getMemberAuthPage(params?: PageFetchParams) {
  return requestClient.get<MemberAuthApi.PageResult>('/member/auth-page', { params });
}

export { getMemberAuthPage };
