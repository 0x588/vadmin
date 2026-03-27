<script lang="ts" setup>
import type { CaptchaPoint, VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';

import { AuthenticationLogin, PointSelectionCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Modal } from 'ant-design-vue';

import {
  aesEcbEncrypt,
  captchaCheckApi,
  captchaGetApi,
} from '#/api/core/captcha';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});

// 验证码状态
const captchaVisible = ref(false);
const captchaImage = ref('');
const hintImage = ref('');
const captchaToken = ref('');
const captchaSecretKey = ref('');
const pendingLoginParams = ref<Recordable<any> | null>(null);

// 验证码原始图片尺寸(后端固定310x155)
const CAPTCHA_ORIGINAL_WIDTH = 310;
const CAPTCHA_ORIGINAL_HEIGHT = 155;
// 前端显示尺寸
const CAPTCHA_DISPLAY_WIDTH = 310;
const CAPTCHA_DISPLAY_HEIGHT = 155;

async function fetchCaptcha() {
  const data = await captchaGetApi('clickWord');
  captchaImage.value = `data:image/png;base64,${data.originalImageBase64}`;
  hintImage.value = `data:image/png;base64,${data.jigsawImageBase64}`;
  captchaToken.value = data.token;
  captchaSecretKey.value = data.secretKey;
}

async function onSubmit(params: Recordable<any>) {
  pendingLoginParams.value = params;
  await fetchCaptcha();
  captchaVisible.value = true;
}

async function handleCaptchaConfirm(points: CaptchaPoint[], clear: () => void) {
  try {
    const pointArr = points.map((p) => ({
      x: Math.round((p.x * CAPTCHA_ORIGINAL_WIDTH) / CAPTCHA_DISPLAY_WIDTH),
      y: Math.round((p.y * CAPTCHA_ORIGINAL_HEIGHT) / CAPTCHA_DISPLAY_HEIGHT),
    }));
    const pointJson = aesEcbEncrypt(
      JSON.stringify(pointArr),
      captchaSecretKey.value,
    );

    await captchaCheckApi('clickWord', captchaToken.value, pointJson);

    // 生成 captchaVerification = AES(token + "---" + pointJson, secretKey)
    const captchaVerification = aesEcbEncrypt(
      `${captchaToken.value}---${pointJson}`,
      captchaSecretKey.value,
    );

    captchaVisible.value = false;
    clear();

    await authStore.authLogin({
      ...pendingLoginParams.value,
      captchaVerification,
    });
  } catch {
    // 验证失败，刷新验证码
    clear();
    await fetchCaptcha();
  }
}

async function handleCaptchaRefresh() {
  await fetchCaptcha();
}
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="onSubmit"
  />
  <Modal
    v-model:open="captchaVisible"
    :closable="true"
    :footer="null"
    :title="null"
    :width="360"
    centered
    destroy-on-close
  >
    <div class="flex justify-center pt-4">
      <PointSelectionCaptcha
        :captcha-image="captchaImage"
        :height="CAPTCHA_DISPLAY_HEIGHT"
        :hint-image="hintImage"
        :show-confirm="true"
        :width="CAPTCHA_DISPLAY_WIDTH"
        title="请依次点击文字"
        @confirm="handleCaptchaConfirm"
        @refresh="handleCaptchaRefresh"
      />
    </div>
  </Modal>
</template>
