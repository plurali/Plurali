<template>
  <!-- temporarily use the cloud hosted editor, because selfhost is beyond fucked up -->
  <UserContent :class="['relative mb-5', !editor && 'pb-20']">
    <Editor :inline="true" :init="init" v-model="value" @init="onInit" />
    <div
      class="h-20 w-full bg-gray-100 rounded-2xl absolute inset-0 bg-opacity-50 flex justify-center items-center gap-1"
      v-if="!editor"
    >
      <Spinner class="w-6 h-6 !text-violet-700" />
      <span class="font-medium text-violet-700">Loading...</span>
    </div>
    <div class="mt-5 flex justify-end items-center py-4" v-if="editor && (forceSave || editor.isDirty())">
      <Button class="text-white bg-violet-700 md:w-48" @click="onSave">Save</Button>
    </div>
  </UserContent>
</template>

<script lang="ts">
import 'tinymce';
import 'tinymce/icons/default';

import 'tinymce/themes/silver';
import 'tinymce/models/dom';

import 'tinymce/plugins/advlist';

import 'tinymce/plugins/autolink';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/code';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/table';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/autosave';

import { PropType, defineComponent, ref } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import Button from '../Button.vue';
import type { EditorOptions, Editor as EditorType } from 'tinymce';
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
    }
  },
  emits: ['save', 'update:modelValue'],
  setup(props, { emit }) {
    const initialValue = ref(props.initialValue ?? null);

    const value = ref(initialValue.value);

    const editor = ref<EditorType | null>(null);

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
        plugins: [
          'advlist',
          'autolink',
          'link',
          'image',
          'lists',
          'charmap',
          'preview',
          'anchor',
          'pagebreak',
          'searchreplace',
          'wordcount',
          'visualblocks',
          'visualchars',
          'code',
          'insertdatetime',
          'table',
          'emoticons',
          'autosave',
        ],
        toolbar:
          'undo redo styles fontfamily fontsize | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor | emoticons image link restoredraft',
        menubar: 'edit insert format table',
        paste_data_images: true,
        browser_spellcheck: true,
        images_file_types: 'jpg,png,svg,webp,avif,gif',
        block_unsupported_drop: true,
        object_resizing: 'img',
        removed_menuitems: 'image',
        font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt',
        promotion: false,
        ...({
          autosave_ask_before_unload: false,
          autosave_prefix: '_plurali_{path}{query}-{id}',
          autosave_restore_when_empty: true,
          autosave_interval: '3s',
        } as any),
      } as EditorOptions,
      onInit,
      onSave,
    };
  },
});
</script>

<style>
@import 'tinymce/skins/ui/oxide/content.css';
@import 'tinymce/skins/ui/oxide/skin.css';
@import 'tinymce/skins/content/default/content.css';

body {
  margin: 0 !important;
}
</style>
