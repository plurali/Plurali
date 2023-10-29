<template>
  <!-- temporarily use the cloud hosted editor, because selfhost is beyond fucked up -->
  <UserContent :class="['relative mb-5', !editor && 'pb-20']">
    <Editor :inline="true" :init="init" v-model="value" @init="onInit" />
    <div
      class="h-full w-full bg-gray-100 rounded-2xl absolute inset-0 bg-opacity-50 flex justify-center items-center gap-1"
      v-if="!editor">
      <Spinner class="w-6 h-6 !text-violet-700" />
      <span class="font-medium text-violet-700">Loading...</span>
    </div>
    <div class="mt-5 flex justify-end items-center py-4" v-if="editor && (forceSave || editor.isDirty())">
      <Button class="text-white bg-violet-700 md:w-48" @click="onSave">Save</Button>
    </div>
  </UserContent>
</template>

<script lang="ts">
import "@plurali/editor/src/tiny/deps";

import { PropType, defineComponent, ref } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import { TinyEditorType, tinyInitConfig } from "@plurali/editor";
import Button from '../Button.vue';
import Spinner from '../Spinner.vue';
import UserContent from '../global/UserContent.vue';

export default defineComponent({
  components: {
    Editor,
    Button,
    Spinner,
    UserContent,
  },
  props: {
    placeholder: {
      type: String,
      default: 'Start writing...',
    },
    initialValue: {
      type: [String, null] as PropType<string | null>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    forceSave: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ['save', 'update:modelValue'],
  setup(props, { emit }) {
    const initialValue = ref(props.initialValue ?? null);

    const value = ref(initialValue.value);

    const editor = ref<TinyEditorType | null>(null);

    const onInit = (_: any, _editor: EditorType) => {
      editor.value = _editor;
    };

    const onSave = async (e?: Event) => {
      e?.preventDefault();

      if (!editor.value) return;

      await editor.value.uploadImages();
      emit('save', editor.value);
    };

    return {
      value,
      initialValue,
      editor,
      init: {
        id: props.id,
        placeholder: props.placeholder,
        ...tinyInitConfig,
      },
      onInit,
      onSave,
    };
  },
});
</script>

<style>
body {
  margin: 0 !important;
}
</style>
