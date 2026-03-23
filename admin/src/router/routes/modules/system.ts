import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 9997,
      title: $t('system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        path: '/system/role',
        name: 'SystemRole',
        meta: {
          icon: 'mdi:account-group',
          title: $t('system.role.title'),
        },
        component: () => import('#/views/system/role/list.vue'),
      },
      {
        path: '/system/menu',
        name: 'SystemMenu',
        meta: {
          icon: 'mdi:menu',
          title: $t('system.menu.title'),
        },
        component: () => import('#/views/system/menu/list.vue'),
      },
      {
        path: '/system/dept',
        name: 'SystemDept',
        meta: {
          icon: 'charm:organisation',
          title: $t('system.dept.title'),
        },
        component: () => import('#/views/system/dept/list.vue'),
      },
      {
        path: '/system/user',
        name: 'SystemUser',
        meta: {
          icon: 'mdi:account',
          title: $t('system.user.title'),
        },
        component: () => import('#/views/system/user/list.vue'),
      },
      {
        path: '/system/notice',
        name: 'SystemNotice',
        meta: {
          icon: 'mdi:bell-outline',
          title: $t('system.notice.title'),
        },
        component: () => import('#/views/system/notice/list.vue'),
      },
      {
        path: '/system/login-log',
        name: 'SystemLoginLog',
        meta: {
          icon: 'mdi:file-document-outline',
          title: $t('system.loginLog.title'),
        },
        component: () => import('#/views/system/login-log/list.vue'),
      },
      {
        path: '/system/dict',
        name: 'SystemDict',
        meta: {
          icon: 'mdi:book-alphabet',
          title: $t('system.dictType.title'),
        },
        component: () => import('#/views/system/dict/list.vue'),
      },
      {
        path: '/system/notify-message',
        name: 'SystemNotifyMessage',
        meta: {
          icon: 'mdi:message-outline',
          title: $t('system.notifyMessage.title'),
        },
        component: () => import('#/views/system/notify-message/list.vue'),
      },
      {
        path: '/system/config',
        name: 'SystemConfig',
        meta: {
          icon: 'mdi:cog-outline',
          title: $t('system.config.title'),
        },
        component: () => import('#/views/system/config/list.vue'),
      },
    ],
  },
];

export default routes;
