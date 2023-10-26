<template>
  <button
    class="text-sm hover:opacity-75 uppercase p-1 px-4 text-white font-semibold rounded-2xl cursor-pointer transition"
    :class="[
      visible ? 'bg-green-500' : 'bg-red-500',
      $attrs.disabled && 'cursor-disabled opacity-25 hover:opacity-25 bg-gray-500',
    ]"
  >
    {{ visible ? 'Public' : 'Private' }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
