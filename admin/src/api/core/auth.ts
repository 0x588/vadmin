import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  export interface LoginParams {
    captchaVerification?: string;
    password: string;
    username: string;
  }

  export interface LoginResult {
    accessToken: string;
    expiresTime?: number;
    refreshToken: string;
    userId?: number;
  }

  export interface PermissionInfo {
    menus: any[];
    permissions: string[];
    role: any;
    user: UserInfo;
  }

  export interface UserInfo {
    avatar?: string;
    dept_id?: number;
    email?: string;
    id: number;
    mobile?: string;
    nickname?: string;
    role_id?: number;
    username: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/system/auth/login', {
    ...data,
    captchaVerification: data.captchaVerification || 'skip',
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  const refreshToken = localStorage.getItem('refresh_token') || '';
  const res = await baseRequestClient.post<any>('/system/auth/refresh-token', {
    refreshToken,
  });
  // baseRequestClient returns full axios response
  // Backend wraps in { code: 200, data: { accessToken, ... } }
  return (res.data?.data || res.data) as AuthApi.LoginResult;
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/system/auth/logout');
}

/**
 * 获取权限信息（用户信息+权限码+菜单）
 */
export async function getPermissionInfoApi() {
  return requestClient.get<AuthApi.PermissionInfo>(
    '/system/auth/get-permission-info',
  );
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  const info = await getPermissionInfoApi();
  return info.permissions || [];
}
