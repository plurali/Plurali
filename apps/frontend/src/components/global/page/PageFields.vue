<template>
  <div v-if="modifiable || pages.length >= 1" class="mb-5">
    <div class="flex flex-1 justify-between items-center mb-3">
      <p class="inline-flex items-center gap-1">
        <DocumentIcon class="w-7 h-7 -ml-1" />

        {{ title ?? 'Pages' }} ({{ pages.length }}):
      </p>
      <ButtonLink
        v-if="modifiable"
        :to="{ name: 'dashboard:system:page:create', params: $route.params }"
        class="border-[2.5px] text-violet-700 font-semibold inline-flex justify-center items-center gap-1"
      >
        <PlusCircleIcon class="w-6 h-6 -ml-1" />
        <span>New Page</span>
      </ButtonLink>
    </div>

    <div v-if="pages.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <PageField :modifiable="modifiable" v-for="page of pages" :page="page" />
    </div>
    <p v-else>You have no pages yet.</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { PageDto } from '@app/v1/dto/page/PageDto';
import PageField from './PageField.vue';
import { DocumentIcon, PlusCircleIcon, PlusIcon } from '@heroicons/vue/24/outline';
import ButtonLink from '../../ButtonLink.vue';

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
    DocumentIcon,
    PlusIcon,
    ButtonLink,
    PlusCircleIcon
},
});
</script>
