import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'backend',
    authPageLayout: 'panel-center',
    defaultHomePath: '/dashboard',
    name: import.meta.env.VITE_APP_TITLE,
  },
  breadcrumb: {
    styleType: 'background',
  },
  sidebar: {
    draggable: false,
    width: 189,
  },
  tabbar: {
    maxCount: 10,
    styleType: 'brisk',
    visitHistory: false,
  },
  theme: {
    mode: 'light',
    radius: '0.25',
    semiDarkSidebar: true,
  },
  widget: {
    globalSearch: false,
    languageToggle: false,
    lockScreen: false,
    notification: false,
  },
});
