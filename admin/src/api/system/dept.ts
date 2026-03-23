import { requestClient } from '#/api/request';

export namespace SystemDeptApi {
  export interface Dept {
    [key: string]: any;
    children?: Dept[];
    createdAt?: string;
    email?: string;
    id: number;
    leaderUserId?: number;
    name: string;
    parentId?: number;
    phone?: string;
    sort?: number;
    status: number;
  }

  export interface DeptSimple {
    id: number;
    name: string;
    parentId: number;
    sort: number;
    children?: DeptSimple[];
  }
}

async function getDeptList() {
  return requestClient.get<SystemDeptApi.Dept[]>('/system/dept/list');
}

async function getDept(id: number) {
  return requestClient.get<SystemDeptApi.Dept>('/system/dept/get', {
    params: { id },
  });
}

async function getDeptSimpleTree() {
  return requestClient.get<SystemDeptApi.DeptSimple[]>(
    '/system/dept/tree-simple',
  );
}

async function createDept(data: Partial<SystemDeptApi.Dept>) {
  return requestClient.post('/system/dept/create', data);
}

async function updateDept(data: Partial<SystemDeptApi.Dept>) {
  return requestClient.put('/system/dept/update', data);
}

async function deleteDept(id: number) {
  return requestClient.delete('/system/dept/delete', { params: { id } });
}

export {
  createDept,
  deleteDept,
  getDept,
  getDeptList,
  getDeptSimpleTree,
  updateDept,
};
