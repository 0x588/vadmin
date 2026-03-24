<script setup lang="ts">
import { computed } from 'vue';

import VueUeditorWrap from 'vue-ueditor-wrap';

const props = withDefaults(
  defineProps<{
    editorId?: string;
    height?: number;
    modelValue?: string;
  }>(),
  {
    modelValue: '',
    editorId: 'editor-default',
    height: 500,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const content = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
});

const editorConfig = {
  serverUrl: '/api/ueditor',
  UEDITOR_HOME_URL: '/static/UEditorPlus/',
  UEDITOR_CORS_URL: '/static/UEditorPlus/',
  initialFrameWidth: '100%',
  initialFrameHeight: props.height,
  autoHeightEnabled: false,
};
</script>

<template>
  <VueUeditorWrap
    v-model="content"
    :editor-id="editorId"
    :config="editorConfig"
    :editor-dependencies="['ueditor.config.js', 'ueditor.all.js']"
  />
</template>
