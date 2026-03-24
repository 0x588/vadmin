<script setup lang="ts">
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/models/dom';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/content/default/content.min.css';

import { computed } from 'vue';

import Editor from '@tinymce/tinymce-vue';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    height?: number;
    modelValue?: string;
  }>(),
  {
    modelValue: '',
    height: 400,
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const content = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
});

const initOptions = computed(() => ({
  height: props.height,
  menubar: true,
  plugins:
    'advlist autolink charmap code fullscreen image link lists media preview table wordcount',
  toolbar:
    'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | charmap | fullscreen preview code | insertfile image media link',
  branding: false,
  content_css: false,
  skin: false,
  promotion: false,
  license_key: 'gpl',
}));
</script>

<template>
  <Editor v-model="content" :init="initOptions" :disabled="disabled" />
</template>
