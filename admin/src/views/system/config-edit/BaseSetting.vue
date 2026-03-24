<script setup lang="ts">
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
  Radio,
  Select,
  Switch,
  TimePicker,
} from 'ant-design-vue';

import { saveConfigEdit } from '#/api/system/config';
import type { SystemConfigApi } from '#/api/system/config';
import Tinymce from '#/components/Tinymce/index.vue';
import UEditor from '#/components/UEditor/index.vue';

const props = defineProps<{
  catId: number;
  cats: SystemConfigApi.ConfigEditAll[];
}>();

const formState = reactive<Record<string, any>>({});
const saving = ref(false);

function parseOptions(optionsStr?: string) {
  if (!optionsStr) return [];
  try {
    return JSON.parse(optionsStr);
  } catch {
    return [];
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
              v-else-if="cfg.type === 'Textarea'"
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
            <!-- UEditor -->
            <UEditor
              v-else-if="cfg.type === 'UEditor'"
              v-model="formState[`${cate.name}.${cfg.name}`]"
              :editor-id="`editor-${cate.name}-${cfg.name}`"
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
  </div>
</template>
