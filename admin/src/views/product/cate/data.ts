import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductCateApi } from '#/api/product/cate';

import { treeSimpleCate } from '#/api/product/cate';
import { requestClient } from '#/api/request';
import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: treeSimpleCate,
        class: 'w-full',
        labelField: 'title',
        valueField: 'id',
        childrenField: 'children',
      },
      fieldName: 'pid',
      label: $t('product.cate.pid'),
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('product.cate.name'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'sub_title',
      label: $t('product.cate.subTitle'),
    },
    {
      component: 'Upload',
      componentProps: {
        accept: '.png,.jpg,.jpeg,.gif,.webp',
        customRequest: async ({
          file,
          onError,
          onProgress,
          onSuccess,
        }: any) => {
          try {
            onProgress?.({ percent: 0 });
            const data = await requestClient.upload(
              '/upload',
              { file },
              { responseReturn: 'body' },
            );
            onProgress?.({ percent: 100 });
            onSuccess?.(data, file);
          } catch (error: any) {
            onError?.(error);
          }
        },
        listType: 'picture-card',
        maxCount: 1,
        maxSize: 5,
      },
      fieldName: 'cover',
      label: $t('product.cate.cover'),
    },
    {
      component: 'Switch',
      fieldName: 'is_recommend',
      label: $t('product.cate.isRecommend'),
    },
    {
      component: 'InputNumber',
      componentProps: { min: 0, class: 'w-full' },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('product.cate.sort'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('product.cate.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('product.cate.name'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('product.cate.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ProductCateApi.CateVO>,
): VxeTableGridOptions<ProductCateApi.CateVO>['columns'] {
  return [
    {
      field: 'title',
      title: $t('product.cate.name'),
      minWidth: 200,
      treeNode: true,
    },
    { field: 'sub_title', title: $t('product.cate.subTitle'), width: 120 },
    {
      cellRender: { name: 'CellImage', props: { height: 40, width: 40 } },
      field: 'cover',
      title: $t('product.cate.cover'),
      width: 80,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: $t('common.yes'), value: true },
          { color: 'error', label: $t('common.no'), value: false },
        ],
      },
      field: 'is_recommend',
      title: $t('product.cate.isRecommend'),
      width: 100,
    },
    { field: 'sort', title: $t('product.cate.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('product.cate.status'),
      width: 100,
    },
    {
      field: 'created_at',
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        return new Date(cellValue * 1000).toLocaleString('zh-CN');
      },
      title: $t('product.cate.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('product.cate.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('product.cate.operation'),
      width: 130,
    },
  ];
}
