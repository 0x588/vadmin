import type { PageFetchParams } from '#/api/request';
import { requestClient } from '#/api/request';

export namespace MemberApi {
  export interface MemberVO {
    [key: string]: any;
    id?: number;
    username?: string;
    nickname?: string;
    avatar?: string;
    phone?: string;
    pid?: number;
    status?: number;
    created_at?: number;
    last_ip?: string;
    last_time?: number;
    visit_count?: number;
  }

  export interface PageResult {
    list: MemberVO[];
    total: number;
  }
}

async function getMemberPage(params?: PageFetchParams) {
  return requestClient.get<MemberApi.PageResult>('/member/page', { params });
}

async function changeMemberStatus(id: number, status: number) {
  return requestClient.post('/member/change-status', { id, status });
}

export { changeMemberStatus, getMemberPage };
