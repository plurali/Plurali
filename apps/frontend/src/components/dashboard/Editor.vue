<template>
  <!-- temporarily use the cloud hosted editor, because selfhost is beyond fucked up -->
  <UserContent :class="['relative mb-5', !editor && 'pb-20']">
    <Editor v-model="value" :inline="true" :init="init" @init="onInit" />
    <div
      v-if="!editor"
      class="h-full w-full bg-gray-100 rounded-2xl absolute inset-0 bg-opacity-50 flex justify-center items-center gap-1"
    >
      <Spinner class="w-6 h-6 !text-violet-700" />
      <span class="font-medium text-violet-700">Loading...</span>
    </div>
    <div v-if="editor && (forceSave || editor.isDirty())" class="mt-5 flex justify-end items-center py-4">
      <Button class="text-white bg-violet-700 md:w-48" @click="onSave">Save</Button>
    </div>
  </UserContent>
</template>

<script lang="ts">
import "@plurali/editor/src/tiny/deps";

import { tinyInitConfig } from "@plurali/editor";
import Editor from "@tinymce/tinymce-vue";
import type { Editor as EditorType } from "tinymce";
import { defineComponent, PropType, ref } from "vue";

import Button from "../Button.vue";
import UserContent from "../global/UserContent.vue";
import Spinner from "../Spinner.vue";

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
      default: "Start writing...",
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
  emits: ["save", "update:modelValue"],
  setup(props, { emit }) {
    const initialValue = ref(props.initialValue ?? null);

    const value = ref(initialValue.value);

    const editor = ref<EditorType | null>(null);

    const onInit = (_: unknown, _editor: EditorType) => {
      editor.value = _editor;
    };

    const onSave = async (e?: Event) => {
      e?.preventDefault();

      if (!editor.value) return;

      await editor.value.uploadImages();
      emit("save", editor.value);
    };

    return {
      value,
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
