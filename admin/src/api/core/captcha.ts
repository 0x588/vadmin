import CryptoJS from 'crypto-js';

import { requestClient } from '#/api/request';

export namespace CaptchaApi {
  export interface CaptchaGetResult {
    jigsawImageBase64: string;
    originalImageBase64: string;
    secretKey: string;
    token: string;
  }
}

/**
 * 获取验证码
 */
export async function captchaGetApi(captchaType = 'clickWord') {
  return requestClient.post<CaptchaApi.CaptchaGetResult>(
    '/system/captcha/get',
    { captchaType },
  );
}

/**
 * 校验验证码
 */
export async function captchaCheckApi(
  captchaType: string,
  token: string,
  pointJson: string,
) {
  return requestClient.post('/system/captcha/check', {
    captchaType,
    pointJson,
    token,
  });
}

/**
 * AES ECB 加密 (与后端 goEncrypt AesEcbEncryptBase64 对应)
 */
export function aesEcbEncrypt(text: string, key: string): string {
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const textBytes = CryptoJS.enc.Utf8.parse(text);
  const encrypted = CryptoJS.AES.encrypt(textBytes, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}
