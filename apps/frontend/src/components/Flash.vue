<template>
  <div :style="containerStyle" :class="['px-8 py-2.5 mb-4 font-medium rounded-2xl w-full', containerClass]">
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { isHex } from '../utils';
import { FlashType } from '../store';

export default defineComponent({
  props: {
    color: {
      type: String,
    },
  },
  setup({ color }) {
    const containerStyle = computed(() => (color?.startsWith("#") && isHex(color)) ? { backgroundColor: color, color: "#fff" } : {});
    const containerClass = computed(() => (color && !color.startsWith("#")) ? FlashType[color as any] : "");

    return {
      containerStyle,
      containerClass,
    }
  }
});
</script>