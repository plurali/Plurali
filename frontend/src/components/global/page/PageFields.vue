<template>
  <div v-if="pages.length >= 1" class="mb-5">
    <p class="inline-flex items-center gap-1 mb-3">{{ title ?? 'Pages' }} ({{ pages.length }}):</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <PageField :modifiable="modifiable" v-for="page of pages" :page="page" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import type { PageDto } from '@app/v1/dto/page/PageDto';
import PageField from './PageField.vue';

export default defineComponent({
  props: {
    pages: {
      type: Array as PropType<PageDto[]>,
      required: true,
    },
    modifiable: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
    },
  },
  components: {
    PageField,
  },
});
</script>
