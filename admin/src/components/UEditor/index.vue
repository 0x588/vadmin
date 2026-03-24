<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue';

defineOptions({ name: 'UEditor' });

const props = withDefaults(
  defineProps<{
    editorId?: string;
    height?: number;
    modelValue?: string;
  }>(),
  {
    modelValue: '',
    editorId: 'editor-default',
    height: 400,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const UEDITOR_HOME = '/static/UEditorPlus/';
const container = ref<HTMLElement>();
const editor = shallowRef<any>(null);
const ready = ref(false);
let innerValue = '';

/** Load a script tag and resolve when loaded */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.addEventListener('load', () => resolve());
    s.addEventListener('error', reject);
    document.head.append(s);
  });
}

/** Load UEditorPlus scripts if not loaded yet */
async function loadUEditor() {
  const win = window as any;
  if (win.UE?.getEditor) return;
  await loadScript(`${UEDITOR_HOME}ueditor.config.js`);
  await loadScript(`${UEDITOR_HOME}ueditor.all.js`);
}

/** Initialize editor instance */
async function initEditor() {
  await loadUEditor();
  const win = window as any;
  if (!win.UE?.getEditor || !container.value) return;

  const inst = win.UE.getEditor(props.editorId, {
    UEDITOR_HOME_URL: UEDITOR_HOME,
    UEDITOR_CORS_URL: UEDITOR_HOME,
    serverUrl: '/admin-api/ueditor',
    initialFrameWidth: '100%',
    initialFrameHeight: props.height,
    autoHeightEnabled: false,
  });

  inst.addListener('ready', () => {
    ready.value = true;
    editor.value = inst;
    // Set initial content
    if (props.modelValue) {
      innerValue = props.modelValue;
      inst.setContent(props.modelValue);
    }
    // Listen for content changes
    inst.addListener('contentChange', () => {
      const html = inst.getContent();
      if (html !== innerValue) {
        innerValue = html;
        emit('update:modelValue', html);
      }
    });
  });
}

// Sync external v-model changes into the editor
watch(
  () => props.modelValue,
  (val) => {
    if (ready.value && editor.value && val !== innerValue) {
      innerValue = val || '';
      editor.value.setContent(innerValue);
    }
  },
);

onMounted(() => {
  nextTick(() => initEditor());
});

onBeforeUnmount(() => {
  if (editor.value?.destroy) {
    editor.value.destroy();
    editor.value = null;
  }
});
</script>

<template>
  <div>
    <div :id="editorId" ref="container"></div>
  </div>
</template>
