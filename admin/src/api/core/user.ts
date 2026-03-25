import type { UserInfo } from '@vben/types';

import { getPermissionInfoCached } from './auth';

/**
 * 获取用户信息（从缓存的权限信息中提取）
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  const info = await getPermissionInfoCached();
  const user = info.user;
  return {
    avatar: user.avatar || '',
    desc: '',
    homePath: '',
    realName: user.nickname || user.username,
    roles: [info.role?.name || 'user'],
    token: '',
    userId: String(user.id),
    username: user.username,
  } as UserInfo;
}
