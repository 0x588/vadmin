<script setup lang="ts">
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
import type { SystemConfigApi } from '#/api/system/config';

import { onMounted, reactive, ref } from 'vue';

import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Switch,
  TimePicker,
  Upload,
} from 'ant-design-vue';

import { saveConfigEdit } from '#/api/system/config';
import Tinymce from '#/components/Tinymce/index.vue';

import { useAccessStore } from '@vben/stores';

const props = defineProps<{
  catId: number;
  cats: SystemConfigApi.ConfigEditAll[];
}>();

const formState = reactive<Record<string, any>>({});
const fileListMap = reactive<Record<string, UploadFile[]>>({});
const saving = ref(false);
const previewVisible = ref(false);
const previewImage = ref('');

function parseOptions(optionsStr?: string) {
  if (!optionsStr) return [];
  try {
    return JSON.parse(optionsStr);
  } catch {
    return [];
  }
}

/** Extract URL from an upload response (handles string or object with url field) */
function extractUrl(response: any): string {
  if (!response) return '';
  if (typeof response === 'string') return response;
  return response.url || response.path || '';
}

/** Convert URL array to UploadFile[] for ant-design-vue Upload */
function urlsToFileList(urls: string[], isImage: boolean): UploadFile[] {
  return urls
    .filter((u) => typeof u === 'string' && u)
    .map((url, i) => ({
      uid: `-init-${i}`,
      name: url.split('/').pop() || `file-${i}`,
      status: 'done' as const,
      url,
      thumbUrl: isImage ? url : undefined,
    }));
}

/** Extract URL array from UploadFile[] (only done files) */
function fileListToUrls(list: UploadFile[]): string[] {
  return list
    .filter((f) => f.status === 'done')
    .map((f) => f.url || extractUrl(f.response))
    .filter(Boolean);
}

function handleFileChange(info: UploadChangeParam, key: string) {
  fileListMap[key] = info.fileList.filter((f) => f.status !== 'removed');
  formState[key] = fileListToUrls(fileListMap[key]);
}

function handlePreview(file: UploadFile) {
  previewImage.value = file.url || extractUrl(file.response) || '';
  previewVisible.value = true;
}

/** Custom upload handler — avoids requestClient interceptor stripping url field */
async function handleCustomUpload({ file, onError, onProgress, onSuccess }: any) {
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
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

function initValue(cfg: SystemConfigApi.ConfigWithValue) {
  const raw = cfg.value?.data;
  if (!raw) return cfg.type === 'CheckboxGroup' ? [] : undefined;

  switch (cfg.type) {
    case 'CheckboxGroup':
    case 'ImageUpload':
    case 'Upload': {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    case 'InputNumber': {
      return Number(raw);
    }
    case 'Switch': {
      return raw === 'true' || raw === '1';
    }
    default: {
      return raw;
    }
  }
}

function serializeValue(cfg: SystemConfigApi.ConfigWithValue, val: any) {
  switch (cfg.type) {
    case 'CheckboxGroup':
    case 'ImageUpload':
    case 'Upload': {
      return JSON.stringify(val ?? []);
    }
    case 'Switch': {
      return String(val ?? false);
    }
    default: {
      return val ?? '';
    }
  }
}

onMounted(() => {
  for (const cate of props.cats) {
    for (const cfg of cate.config || []) {
      const key = `${cate.name}.${cfg.name}`;
      formState[key] = initValue(cfg);
      // Initialize file lists for upload types
      if (cfg.type === 'ImageUpload' || cfg.type === 'Upload') {
        const urls = Array.isArray(formState[key]) ? formState[key] : [];
        fileListMap[key] = urlsToFileList(urls, cfg.type === 'ImageUpload');
      }
    }
  }
});

async function handleSubmit() {
  saving.value = true;
  try {
    const values: Record<string, any> = {};
    for (const cate of props.cats) {
      for (const cfg of cate.config || []) {
        const key = `${cate.name}.${cfg.name}`;
        values[key] = serializeValue(cfg, formState[key]);
      }
    }
    await saveConfigEdit({ cateId: props.catId, data: JSON.stringify(values) });
    message.success('保存成功');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="p-4">
    <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
      <template v-for="cate in cats" :key="cate.id">
        <Divider orientation="left">{{ cate.title }}</Divider>
        <template v-for="cfg in cate.config" :key="cfg.id">
          <FormItem :label="cfg.title" :help="cfg.remark">
            <!-- Input -->
            <Input
              v-if="cfg.type === 'Input' || !cfg.type"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
            />
            <!-- InputNumber -->
            <InputNumber
              v-else-if="cfg.type === 'InputNumber'"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              style="width: 100%"
            />
            <!-- Textarea -->
            <Input.TextArea
              v-else-if="
                cfg.type === 'Textarea' || cfg.type === 'InputTextArea'
              "
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              :rows="4"
            />
            <!-- Select -->
            <Select
              v-else-if="cfg.type === 'Select'"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              :options="parseOptions(cfg.options)"
            />
            <!-- RadioGroup -->
            <Radio.Group
              v-else-if="cfg.type === 'RadioGroup'"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              :options="parseOptions(cfg.options)"
            />
            <!-- CheckboxGroup -->
            <Checkbox.Group
              v-else-if="cfg.type === 'CheckboxGroup'"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              :options="parseOptions(cfg.options)"
            />
            <!-- DatePicker -->
            <DatePicker
              v-else-if="cfg.type === 'DatePicker'"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
            <!-- TimePicker -->
            <TimePicker
              v-else-if="cfg.type === 'TimePicker'"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              value-format="HH:mm:ss"
              style="width: 100%"
            />
            <!-- Switch -->
            <Switch
              v-else-if="cfg.type === 'Switch'"
              v-model:checked="formState[`${cate.name}.${cfg.name}`]"
            />
            <!-- Tinymce -->
            <Tinymce
              v-else-if="cfg.type === 'Tinymce'"
              v-model="formState[`${cate.name}.${cfg.name}`]"
            />
            <!-- ImageUpload -->
            <Upload
              v-else-if="cfg.type === 'ImageUpload'"
              :file-list="fileListMap[`${cate.name}.${cfg.name}`]"
              list-type="picture-card"
              :custom-request="handleCustomUpload"
              accept=".png,.jpg,.jpeg,.gif,.webp"
              @change="
                (info: UploadChangeParam) =>
                  handleFileChange(info, `${cate.name}.${cfg.name}`)
              "
              @preview="handlePreview"
            >
              <div
                v-if="
                  (fileListMap[`${cate.name}.${cfg.name}`] || []).length < 1
                "
              >
                <div style="font-size: 24px; color: #999">+</div>
                <div style="margin-top: 4px">上传图片</div>
              </div>
            </Upload>
            <!-- Upload (file) -->
            <Upload
              v-else-if="cfg.type === 'Upload'"
              :file-list="fileListMap[`${cate.name}.${cfg.name}`]"
              :custom-request="handleCustomUpload"
              @change="
                (info: UploadChangeParam) =>
                  handleFileChange(info, `${cate.name}.${cfg.name}`)
              "
            >
              <Button>上传文件</Button>
            </Upload>
            <!-- UEditor: fallback to Textarea until UEditorPlus CDN issues resolved -->
            <Input.TextArea
              v-else-if="cfg.type === 'UEditor'"
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
              :rows="8"
              placeholder="富文本编辑 (UEditor)"
            />
            <!-- Fallback: Input -->
            <Input
              v-else
              v-model:value="formState[`${cate.name}.${cfg.name}`]"
            />
          </FormItem>
        </template>
      </template>
      <FormItem :wrapper-col="{ offset: 4 }">
        <Button type="primary" :loading="saving" @click="handleSubmit">
          保存
        </Button>
      </FormItem>
    </Form>
    <!-- Image preview modal -->
    <Modal
      :open="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img :src="previewImage" style="width: 100%" />
    </Modal>
  </div>
</template>
