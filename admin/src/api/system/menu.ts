import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export interface Menu {
    [key: string]: any;
    alwaysShow?: boolean;
    children?: Menu[];
    component?: string;
    componentName?: string;
    createdAt?: string;
    icon?: string;
    id: number;
    keepAlive?: boolean;
    meta?: MenuMeta;
    name: string;
    parentId: number;
    path?: string;
    permission?: string;
    sort?: number;
    status: number;
    type: number;
    visible?: boolean;
  }

  export interface MenuMeta {
    carryParam?: boolean;
    hidePathForChildren?: boolean;
    ignoreRoute?: boolean;
    title?: string;
  }

  export interface MenuSimple {
    children?: MenuSimple[];
    id: number;
    name: string;
    parentId: number;
    sort: number;
    type: number;
  }
}

async function getMenuList(params?: Record<string, any>) {
  return requestClient.get<SystemMenuApi.Menu[]>('/system/menu/list', {
    params,
  });
}

async function getMenu(id: number) {
  return requestClient.get<SystemMenuApi.Menu>('/system/menu/get', {
    params: { id },
  });
}

async function getMenuSimpleTree() {
  return requestClient.get<SystemMenuApi.MenuSimple[]>(
    '/system/menu/tree-simple',
  );
}

async function createMenu(data: Partial<SystemMenuApi.Menu>) {
  return requestClient.post('/system/menu/create', data);
}

async function updateMenu(data: Partial<SystemMenuApi.Menu>) {
  return requestClient.put('/system/menu/update', data);
}

async function deleteMenu(id: number) {
  return requestClient.delete('/system/menu/delete', { params: { id } });
}

export {
  createMenu,
  deleteMenu,
  getMenu,
  getMenuList,
  getMenuSimpleTree,
  updateMenu,
};
