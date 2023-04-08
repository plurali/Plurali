<template>
  <div
    :style="{ backgroundColor: color }"
    class="w-6 h-6 rounded-full border border-gray-400"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    color: {
      type: String,
    },
  },
})
</script>
