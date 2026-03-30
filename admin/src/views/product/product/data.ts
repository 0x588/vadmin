import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductApi } from '#/api/product/product';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { listSimpleCate } from '#/api/product/cate';
import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('product.product.name'),
    },
    {
      component: 'ApiCascader',
      componentProps: {
        api: listSimpleCate,
        childrenField: 'children',
        class: 'w-full',
        labelField: 'title',
        valueField: 'id',
      },
      fieldName: 'cateIds',
      label: $t('product.product.cateIds'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.YES_NO),
      },
      fieldName: 'is_new',
      label: $t('product.product.isNew'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.YES_NO),
      },
      fieldName: 'is_hot',
      label: $t('product.product.isHot'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.YES_NO),
      },
      fieldName: 'is_recommend',
      label: $t('product.product.isRecommend'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS),
      },
      fieldName: 'status',
      label: $t('product.product.status'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createdTime',
      label: $t('product.product.createdAt'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<ProductApi.ProductVO>,
): VxeTableGridOptions<ProductApi.ProductVO>['columns'] {
  return [
    { field: 'id', title: $t('product.product.id'), width: 60 },
    {
      cellRender: { name: 'CellImage', props: { height: 40, width: 40 } },
      field: 'picture',
      title: $t('product.product.picture'),
      width: 80,
    },
    {
      field: 'name',
      minWidth: 200,
      showOverflow: false,
      slots: {
        default: ({ row }) => {
          const tags: any[] = [];
          if (row.is_hot)
            tags.push(
              h(Tag, { color: 'red' }, () => $t('product.product.isHot')),
            );
          if (row.is_recommend)
            tags.push(
              h(Tag, { color: 'blue' }, () =>
                $t('product.product.isRecommend'),
              ),
            );
          if (row.is_new)
            tags.push(
              h(Tag, { color: 'green' }, () => $t('product.product.isNew')),
            );
          if (row.is_spec)
            tags.push(
              h(Tag, { color: 'orange' }, () =>
                $t('product.product.multiSpec'),
              ),
            );
          if (row.shipping_type === 1)
            tags.push(
              h(Tag, { color: 'cyan' }, () =>
                $t('product.product.freeShipping'),
              ),
            );
          return h('div', [
            h('div', { class: 'text-left' }, row.name),
            tags.length > 0
              ? h('div', { class: 'flex mt-1 gap-1' }, tags)
              : null,
          ]);
        },
      },
      title: $t('product.product.name'),
    },
    { field: 'price', title: $t('product.product.price'), width: 80 },
    {
      field: 'real_sales',
      title: $t('product.product.realSales'),
      width: 80,
    },
    { field: 'stock', title: $t('product.product.stock'), width: 80 },
    {
      field: 'cate_id',
      slots: {
        default: ({ row }) => row.cate?.title || '-',
      },
      title: $t('product.product.cateIds'),
      width: 100,
    },
    { field: 'sort', title: $t('product.product.sort'), width: 80 },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: $t('product.product.status'),
      width: 80,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('product.product.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('product.product.operation'),
      width: 130,
    },
  ];
}

export function useSkuColumns(): VxeTableGridOptions['columns'] {
  return [
    { field: 'picture', title: '图片', width: 80 },
    { field: 'price', title: '销售价(元)', width: 100 },
    { field: 'market_price', title: '市场价(元)', width: 100 },
    { field: 'cost_price', title: '成本价(元)', width: 100 },
    { field: 'stock', title: '库存', width: 80 },
    { field: 'weight', title: '重量(kg)', width: 80 },
    { field: 'volume', title: '体积(m³)', width: 80 },
    { field: 'sku_no', title: '商品编码', width: 100 },
    { field: 'bar_code', title: '商品条码', width: 100 },
  ];
}
