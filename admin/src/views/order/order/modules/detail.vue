<script lang="ts" setup>
import type { OrderApi } from '#/api/order/order';

import { h, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  Descriptions,
  DescriptionsItem,
  Image,
  Spin,
  Table,
  TabPane,
  Tabs,
} from 'ant-design-vue';

import { getOrder } from '#/api/order/order';
import { $t } from '#/locales';

const loading = ref(false);
const orderData = ref<OrderApi.OrderVO>();
const products = ref<any[]>([]);

const [Drawer, drawerApi] = useVbenDrawer({
  async onOpenChange(isOpen) {
    if (isOpen) {
      loading.value = true;
      const data = drawerApi.getData<OrderApi.OrderVO>();
      try {
        if (data?.id) {
          const detail = await getOrder(data.id);
          orderData.value = detail;
          products.value = detail.order_product || [];
        }
      } finally {
        loading.value = false;
      }
    }
  },
});

const productColumns = [
  {
    title: $t('order.order.productPicture'),
    dataIndex: 'product_picture',
    width: 80,
    customRender: ({ text }: any) =>
      text ? h(Image, { src: text, width: 40, height: 40 }) : '',
  },
  { title: $t('order.order.productName'), dataIndex: 'product_name' },
  { title: $t('order.order.price'), dataIndex: 'price', width: 100 },
  { title: $t('order.order.num'), dataIndex: 'num', width: 80 },
  {
    title: $t('order.order.productMoney'),
    dataIndex: 'product_money',
    width: 100,
  },
  {
    title: $t('order.order.orderStatus'),
    dataIndex: 'order_status',
    width: 100,
  },
];
</script>

<template>
  <Drawer :title="$t('order.order.detail')" class="w-[700px]">
    <Spin :spinning="loading">
      <Tabs>
        <TabPane :tab="$t('order.order.orderInfo')" key="info">
          <Descriptions bordered :column="2" v-if="orderData">
            <DescriptionsItem :label="$t('order.order.orderSn')">
              {{ orderData.order_sn }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('order.order.orderType')">
              {{ orderData.order_type }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('order.order.paymentType')">
              {{ orderData.payment_type }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('order.order.payMoney')">
              {{ orderData.pay_money }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('order.order.buyerId')">
              {{ orderData.buyer_id }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('order.order.buyerNickname')">
              {{ orderData.buyer_nickname }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('order.order.buyerMessage')" :span="2">
              {{ orderData.buyer_message }}
            </DescriptionsItem>
            <DescriptionsItem :label="$t('order.order.sellerMemo')" :span="2">
              {{ orderData.seller_memo }}
            </DescriptionsItem>
          </Descriptions>
        </TabPane>
        <TabPane :tab="$t('order.order.productInfo')" key="products">
          <Table
            :columns="productColumns"
            :data-source="products"
            :pagination="false"
            row-key="id"
            size="small"
          />
        </TabPane>
      </Tabs>
    </Spin>
  </Drawer>
</template>
