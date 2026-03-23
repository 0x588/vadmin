import type { UserInfo } from '@vben/types';

import { getPermissionInfoApi } from './auth';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  const info = await getPermissionInfoApi();
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
