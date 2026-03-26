import type { RouteRecordStringComponent } from '@vben/types';

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
  return requestClient.post<AuthApi.LoginResult>('/system/auth/login', data);
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

// ========== 权限信息缓存（避免重复请求） ==========

let _permissionInfoPromise: null | Promise<AuthApi.PermissionInfo> = null;

/**
 * 获取缓存的权限信息（同一会话只请求一次API）
 */
export function getPermissionInfoCached(): Promise<AuthApi.PermissionInfo> {
  if (!_permissionInfoPromise) {
    _permissionInfoPromise = getPermissionInfoApi();
  }
  return _permissionInfoPromise;
}

/**
 * 清除权限信息缓存（登出时调用）
 */
export function clearPermissionInfoCache() {
  _permissionInfoPromise = null;
}

/**
 * 获取用户权限码（从缓存读取）
 */
export async function getAccessCodesApi() {
  const info = await getPermissionInfoCached();
  return info.permissions || [];
}

// ========== 后端菜单转换 ==========

/**
 * 将后端菜单树转换为 RouteRecordStringComponent 格式
 * type: 1=目录, 2=菜单, 3=按钮(过滤掉)
 */
function transformBackendMenus(menus: any[]): RouteRecordStringComponent[] {
  return menus
    .filter((menu) => menu.type !== 3 && menu.status === 1)
    .map((menu) => {
      const route: any = {
        component: menu.component || '',
        meta: {
          hideInMenu: menu.visible === false,
          icon: menu.icon || undefined,
          keepAlive: menu.keepAlive ?? false,
          order: menu.sort,
          title: menu.name,
          ...menu.extraMeta,
        },
        name: menu.componentName || `Menu_${menu.id}`,
        path: menu.path || '',
      };

      if (menu.children?.length) {
        route.children = transformBackendMenus(menu.children);
      }

      return route as RouteRecordStringComponent;
    });
}

/**
 * 获取后端菜单（已转换为路由格式）
 */
export async function getBackendMenusApi(): Promise<
  RouteRecordStringComponent[]
> {
  const info = await getPermissionInfoCached();
  return transformBackendMenus(info.menus || []);
}
