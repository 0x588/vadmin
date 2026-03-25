import type { SystemDictDataApi } from '#/api/system/dict-data';

import { defineStore } from 'pinia';

import { getDictDataSimpleList } from '#/api';

const DICT_CACHE_KEY = 'DICT__DATA__';
const DICT_CACHE_TTL = 60; // seconds

export const useDictStore = defineStore('app-dict', {
  actions: {
    async setDictMap() {
      // Try localStorage cache first
      const cached = localStorage.getItem(DICT_CACHE_KEY);
      if (cached) {
        try {
          const { data, expiry } = JSON.parse(cached);
          if (expiry > Date.now()) {
            this.dictMap = data;
            this.isSetDict = true;
            return;
          }
        } catch {
          localStorage.removeItem(DICT_CACHE_KEY);
        }
      }

      // Fetch from backend
      const res = await getDictDataSimpleList();
      const dictDataMap: Record<string, SystemDictDataApi.DictDataSimple[]> =
        {};
      for (const item of res) {
        if (!dictDataMap[item.dictType]) {
          dictDataMap[item.dictType] = [];
        }
        dictDataMap[item.dictType].push({
          colorType: item.colorType,
          cssClass: item.cssClass,
          dictType: item.dictType,
          label: item.label,
          value: item.value,
        });
      }

      this.dictMap = dictDataMap;
      this.isSetDict = true;
      localStorage.setItem(
        DICT_CACHE_KEY,
        JSON.stringify({
          data: dictDataMap,
          expiry: Date.now() + DICT_CACHE_TTL * 1000,
        }),
      );
    },
  },
  getters: {
    getDictMap(
      state,
    ): Record<string, SystemDictDataApi.DictDataSimple[]> {
      return state.dictMap;
    },
  },
  state: () => ({
    dictMap: {} as Record<string, SystemDictDataApi.DictDataSimple[]>,
    isSetDict: false,
  }),
});
