<template>
  <button
    class="text-sm hover:opacity-75 uppercase p-1 px-4 text-white font-semibold rounded-2xl cursor-pointer transition"
    :class="[
      visible ? 'bg-green-500' : 'bg-red-500',
      $attrs.disabled && 'cursor-disabled opacity-25 hover:opacity-25 bg-gray-500',
    ]">
    {{ visible ? 'Public' : 'Private' }}
  </button>
</template>

<script lang="ts">
import { isVisibilityPublic } from '@plurali/common';
import type { Visibility } from '@prisma/client';
import { PropType, computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    visibility: {
      type: String as PropType<Visibility>,
      required: true,
    },
  },
  setup({ visibility }) {
    return {
      visible: computed(() => isVisibilityPublic(visibility)),
    }
  }
})
</script>
