<script lang="ts" setup>
import type { ProductAttributeApi } from '#/api/product/attribute';
import type { ProductApi } from '#/api/product/product';

import { computed, nextTick, ref, toRaw, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Button, Tabs, Upload } from 'ant-design-vue';
import type { UploadChangeParam, UploadFile } from 'ant-design-vue/es/upload';
import { PlusOutlined } from '@ant-design/icons-vue';

import { useVbenForm } from '#/adapter/form';
import { getCommonAttribute } from '#/api/product/attribute';
import { listSimpleCate } from '#/api/product/cate';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '#/api/product/product';
import {
  getCommonSpecsByTemplateId,
  listSimpleSpecTemplate,
} from '#/api/product/spec-temp';
import { listSimpleTag } from '#/api/product/tag';
import { getExpressListAll } from '#/api/shops/express';
import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

import AttributeList from './attribute-list.vue';
import SkuList from './sku-list.vue';
import SpecList from './spec-list.vue';

const emits = defineEmits(['success']);
const activeTab = ref('basic');
const id = ref<number>();
const isSpec = ref(false);
const specTempList = ref<ProductApi.ProductSpecVo[]>([]);
const skuList = ref<ProductApi.ProductSkuVo[]>([]);
const attributes = ref<ProductAttributeApi.AttributeValue[]>([]);
const coverFileList = ref<UploadFile[]>([]);

function urlToFileList(url: string): UploadFile[] {
  if (!url) return [];
  return [
    {
      uid: '-cover-0',
      name: url.split('/').pop() || 'cover',
      status: 'done' as const,
      url,
      thumbUrl: url,
    },
  ];
}

function extractUploadUrl(response: any): string {
  if (!response) return '';
  if (typeof response === 'string') return response;
  return response.url || response.path || '';
}

async function handleCoverUpload({ file, onError, onProgress, onSuccess }: any) {
  try {
    onProgress?.({ percent: 0 });
    const accessStore = useAccessStore();
    const formData = new FormData();
    formData.append('file', file);
    const resp = await fetch('/admin-api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessStore.accessToken}` },
      body: formData,
    });
    const result = await resp.json();
    onProgress?.({ percent: 100 });
    if (result.code === 200 && result.url) {
      onSuccess?.(result, file);
    } else {
      onError?.(new Error(result.message || '上传失败'));
    }
  } catch (error: any) {
    onError?.(error);
  }
}

function handleCoverChange(info: UploadChangeParam) {
  coverFileList.value = info.fileList;
}

function getCoverUrl(): string {
  const list = coverFileList.value.filter((f) => f.status === 'done');
  if (list.length === 0) return '';
  return list[0]?.url || extractUploadUrl(list[0]?.response) || '';
}

function createDefaultSku(): ProductApi.ProductSkuVo {
  return {
    stock: 0,
    price: 0,
    cost_price: 0,
    market_price: 0,
    sku_no: '',
    bar_code: '',
    weight: 0,
    volume: 0,
    picture: [],
  };
}

// Tab 1: Basic info form
const [BasicForm, basicFormApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      dependencies: { show: () => false, triggerFields: [] },
      fieldName: 'id',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('product.product.name'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'sketch',
      label: $t('product.product.sketch'),
    },
    {
      component: 'ApiCascader',
      componentProps: {
        api: listSimpleCate,
        childrenField: 'children',
        class: 'w-full',
        labelField: 'title',
        multiple: true,
        valueField: 'id',
      },
      fieldName: 'cateIds',
      label: $t('product.product.cateIds'),
      rules: 'required',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: listSimpleTag,
        class: 'w-full',
        labelField: 'title',
        mode: 'tags',
        valueField: 'title',
      },
      fieldName: 'tags',
      label: $t('product.product.tags'),
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        options: [
          { label: $t('product.product.logistics'), value: 1 },
          { label: $t('product.product.localDelivery'), value: 2 },
          { label: $t('product.product.selfPickup'), value: 100 },
        ],
      },
      fieldName: 'delivery_type',
      label: $t('product.product.deliveryType'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('product.product.freeShipping'), value: 1 },
          { label: $t('product.product.buyerPay'), value: 2 },
          { label: $t('product.product.uniformFee'), value: 3 },
        ],
      },
      defaultValue: 1,
      fieldName: 'shipping_type',
      label: $t('product.product.shippingType'),
    },
    {
      component: 'InputNumber',
      componentProps: { class: 'w-full', min: 0, precision: 2 },
      dependencies: {
        show: (values) => values.shipping_type === 3,
        triggerFields: ['shipping_type'],
      },
      fieldName: 'shipping_fee',
      label: $t('product.product.shippingFee'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: getExpressListAll,
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
      },
      dependencies: {
        show: (values) => values.shipping_type === 2,
        triggerFields: ['shipping_type'],
      },
      fieldName: 'shipping_fee_id',
      label: $t('product.product.shippingFeeId'),
    },
    {
      component: 'Input',
      fieldName: 'unit',
      label: $t('product.product.unit'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: { class: 'w-full', min: 1, precision: 0 },
      defaultValue: 1,
      fieldName: 'min_buy_num',
      label: $t('product.product.minBuyNum'),
    },
    {
      component: 'InputNumber',
      componentProps: { class: 'w-full', min: 0, precision: 0 },
      defaultValue: 0,
      fieldName: 'max_buy_num',
      label: $t('product.product.maxBuyNum'),
    },
    {
      component: 'InputNumber',
      componentProps: { class: 'w-full', min: 0, precision: 0 },
      defaultValue: 0,
      fieldName: 'sales',
      label: $t('product.product.sales'),
    },
    {
      component: 'Checkbox',
      defaultValue: false,
      fieldName: 'is_new',
      label: $t('product.product.isNew'),
    },
    {
      component: 'Checkbox',
      defaultValue: false,
      fieldName: 'is_hot',
      label: $t('product.product.isHot'),
    },
    {
      component: 'Checkbox',
      defaultValue: false,
      fieldName: 'is_recommend',
      label: $t('product.product.isRecommend'),
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
      label: $t('product.product.status'),
    },
  ],
  showDefaultActions: false,
});

// Tab 2: Spec form
const [SpecForm, specFormApi] = useVbenForm({
  schema: [
    {
      component: 'InputNumber',
      componentProps: { class: 'w-full', min: 0, precision: 0 },
      defaultValue: 0,
      fieldName: 'stock_warning_num',
      label: $t('product.product.stockWarningNum'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('product.product.deductOnPay'), value: 1 },
          { label: $t('product.product.deductOnOrder'), value: 2 },
        ],
      },
      defaultValue: 1,
      fieldName: 'stock_deduction_type',
      label: $t('product.product.stockDeductionType'),
    },
    {
      component: 'Checkbox',
      defaultValue: true,
      fieldName: 'is_stock_visible',
      label: $t('product.product.isStockVisible'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        onChange: (e: any) => {
          const val = typeof e === 'object' ? e.target?.value : e;
          isSpec.value = val === 1;
        },
        options: [
          { label: $t('product.product.singleSpec'), value: 0 },
          { label: $t('product.product.multiSpec'), value: 1 },
        ],
      },
      defaultValue: 0,
      fieldName: 'is_spec',
      label: $t('product.product.isSpec'),
      rules: 'required',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: listSimpleSpecTemplate,
        class: 'w-full',
        labelField: 'title',
        onChange: async (val: any) => {
          if (val) {
            const specs = await getCommonSpecsByTemplateId(val);
            specTempList.value = (specs as ProductApi.ProductSpecVo[]) || [];
            onSpecChanged(specTempList.value);
          }
        },
        valueField: 'id',
      },
      dependencies: {
        show: (values) => values.is_spec === 1,
        triggerFields: ['is_spec'],
      },
      fieldName: 'spec_template_id',
      label: $t('product.product.specTemplateId'),
    },
  ],
  showDefaultActions: false,
});

// Tab 3: Image form
const [ImageForm, imageFormApi] = useVbenForm({
  schema: [
    {
      component: 'Textarea',
      componentProps: {
        placeholder: 'JSON array of image URLs, e.g. ["url1","url2"]',
        rows: 3,
      },
      fieldName: 'covers',
      label: $t('product.product.covers'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: { placeholder: 'Video URL' },
      fieldName: 'video_url',
      label: $t('product.product.videoUrl'),
    },
    {
      component: 'Textarea',
      componentProps: { placeholder: '商品详情HTML内容', rows: 10 },
      fieldName: 'intro',
      label: $t('product.product.intro'),
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

// Watch is_spec changes via polling spec form values
watch(isSpec, (val) => {
  if (!val) {
    skuList.value = [createDefaultSku()];
  }
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid: basicValid } = await basicFormApi.validate();
    if (!basicValid) {
      activeTab.value = 'basic';
      return;
    }
    const { valid: specValid } = await specFormApi.validate();
    if (!specValid) {
      activeTab.value = 'spec';
      return;
    }
    const { valid: imageValid } = await imageFormApi.validate();
    if (!imageValid) {
      activeTab.value = 'image';
      return;
    }

    drawerApi.lock();
    const basicValues = await basicFormApi.getValues();
    const specValues = await specFormApi.getValues();
    const imageValues = await imageFormApi.getValues();

    const submitData: Record<string, any> = {
      ...basicValues,
      ...specValues,
      ...imageValues,
      cover_img: getCoverUrl(),
    };

    // Spec data
    if (submitData.is_spec) {
      submitData.spec_list = toRaw(specTempList.value);
    }

    // SKU data
    submitData.sku_list = skuList.value.map((item) => {
      const pic =
        item.picture && item.picture.length > 0 ? item.picture[0] : '';
      const name = item.items
        ? item.items.map((v: any) => v.title).join(' ')
        : '';
      return { ...toRaw(item), picture: pic, name };
    });

    // Attribute data
    const selectAttributes = attributes.value.filter((v) => v.title && v.data);
    submitData.attributes = selectAttributes.map((v) => toRaw(v));

    (id.value
      ? updateProduct({ id: id.value, ...submitData })
      : createProduct(submitData)
    )
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<ProductApi.ProductVO>();
      activeTab.value = 'basic';

      // Reset all forms and state
      basicFormApi.resetForm();
      specFormApi.resetForm();
      imageFormApi.resetForm();
      specTempList.value = [];
      skuList.value = [createDefaultSku()];
      attributes.value = [];
      coverFileList.value = [];
      isSpec.value = false;

      if (data && data.id) {
        id.value = data.id;
        const detail = await getProduct(data.id);
        await nextTick();

        basicFormApi.setValues(detail);
        specFormApi.setValues({
          ...detail,
          is_spec: detail.is_spec ? 1 : 0,
        });
        imageFormApi.setValues(detail);

        if (detail.cover_img) {
          coverFileList.value = urlToFileList(detail.cover_img);
        }

        isSpec.value = !!detail.is_spec;
        if (detail.attributes) attributes.value = detail.attributes;
        if (detail.sku_list) {
          skuList.value = detail.sku_list.map((item: any) => ({
            ...item,
            picture:
              item.picture && item.picture.length > 0 ? [item.picture] : [],
          }));
        }
        if (detail.spec_list) {
          specTempList.value = detail.spec_list;
          // Regenerate SKUs to add pid/pname and merge with existing data
          if (isSpec.value) {
            onSpecChanged(specTempList.value);
          }
        }
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value
    ? $t('ui.actionTitle.edit', [$t('product.product.name')])
    : $t('ui.actionTitle.create', [$t('product.product.name')]);
});

function onSpecChanged(specs: ProductApi.ProductSpecVo[]) {
  specTempList.value = specs;
  // Recalculate SKU combinations
  const selectedSpecs = specs
    .filter((s) => s.values && s.values.some((v) => v.pitch_on))
    .map((s) => ({ ...s, values: (s.values || []).filter((v) => v.pitch_on) }));
  recalculateSkus(selectedSpecs);
}

function recalculateSkus(selectedSpecs: ProductApi.ProductSpecVo[]) {
  if (selectedSpecs.length === 0) {
    if (isSpec.value) skuList.value = [];
    return;
  }
  let combinations: any[][] = [[]];
  for (const spec of selectedSpecs) {
    const next: any[][] = [];
    for (const a of combinations) {
      for (const b of spec.values || []) {
        next.push([...a, { ...b, pid: spec.id, pname: spec.title }]);
      }
    }
    combinations = next;
  }

  const oldSkus = [...skuList.value];
  skuList.value = combinations.map((combo) => {
    const data = combo.map((item) => item.id).join('-');
    const existing = oldSkus.find((s) => s.data === data);
    return (
      existing || {
        ...createDefaultSku(),
        data,
        items: combo,
      }
    );
  });
}

function onSkuChanged(skus: ProductApi.ProductSkuVo[]) {
  skuList.value = skus;
}

async function onSpecTemplateLoad() {
  const specValues = await specFormApi.getValues();
  if (specValues.spec_template_id) {
    const specs = await getCommonSpecsByTemplateId(specValues.spec_template_id);
    specTempList.value = (specs as ProductApi.ProductSpecVo[]) || [];
    onSpecChanged(specTempList.value);
  }
}

async function onAttributeTemplateChange(attrId: number) {
  if (attrId) {
    const res = await getCommonAttribute(attrId);
    if (res.values) attributes.value = res.values;
  }
}
</script>

<template>
  <Drawer :title="getDrawerTitle" class="w-[800px]">
    <Tabs v-model:active-key="activeTab">
      <Tabs.TabPane
        key="basic"
        :tab="$t('product.product.basicInfo')"
        force-render
      >
        <BasicForm />
        <div class="ant-form-item mx-auto" style="max-width: 500px">
          <div class="ant-form-item-label">
            <label>{{ $t('product.product.coverImg') }}</label>
          </div>
          <div class="ant-form-item-control">
            <Upload
              v-model:file-list="coverFileList"
              list-type="picture-card"
              :custom-request="handleCoverUpload"
              :max-count="1"
              accept=".png,.jpg,.jpeg,.gif,.webp"
              @change="handleCoverChange"
            >
              <div v-if="coverFileList.length === 0">
                <PlusOutlined />
                <div class="mt-1 text-xs">上传主图</div>
              </div>
            </Upload>
          </div>
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane
        key="spec"
        :tab="$t('product.product.specInfo')"
        force-render
      >
        <SpecForm />
        <template v-if="isSpec">
          <Button type="dashed" class="my-2" @click="onSpecTemplateLoad">
            {{ $t('product.product.specTemplateId') }}
            - 加载规格
          </Button>
          <SpecList :spec-list="specTempList" @change="onSpecChanged" />
        </template>
        <SkuList :data-list="skuList" @change="onSkuChanged" />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="image"
        :tab="$t('product.product.imageInfo')"
        force-render
      >
        <ImageForm />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="attr"
        :tab="$t('product.product.attrInfo')"
        force-render
      >
        <AttributeList
          v-model:values="attributes"
          @load-template="onAttributeTemplateChange"
        />
      </Tabs.TabPane>
    </Tabs>
  </Drawer>
</template>
