import { setTimezoneHandler } from '@vben/stores';

/**
 * 初始化时区处理，固定为 Asia/Shanghai (北京时间)，不走后端 API
 */
export function initTimezone() {
  setTimezoneHandler({
    getTimezone() {
      return Promise.resolve('Asia/Shanghai');
    },
    setTimezone(_timezone: string) {
      return Promise.resolve();
    },
    getTimezoneOptions() {
      return Promise.resolve([
        { label: '(UTC+08:00) 中国标准时间 - 北京', value: 'Asia/Shanghai' },
      ]);
    },
  });
}
