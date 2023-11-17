<template>
  <div :style="containerStyle" :class="['relative flex justify-between space-x-10 rounded-2xl bg-opacity-75 p-4', containerClass]">
    <div class="flex items-start space-x-2.5 ">
      <InformationCircleIcon class="h-6 w-6 flex-shrink-0 text-white" />
      <div class="text-white">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import { isHex } from '../utils';
import { FlashType } from '../store';

const flashTypeToClass = {
  [FlashType.Danger]: 'bg-red-700 text-danger-400',
  [FlashType.Warning]: 'bg-yellow-600 text-warning-400',
  [FlashType.Success]: 'bg-green-700 text-success-400',
  [FlashType.Info]: 'bg-blue-700 text-info-400',
}

export default defineComponent({
  components: {
    InformationCircleIcon,
  },
  props: {
    color: {
      type: String,
    },
  },
  setup({ color }) {
    const containerStyle = computed(() => (color?.startsWith("#") && isHex(color)) ? { backgroundColor: color, color: "#fff" } : {});
    const containerClass = computed(() => (color && Object.keys(FlashType).includes(color)) ? flashTypeToClass[color as FlashType] : "");

    return {
      containerStyle,
      containerClass,
    }
  }
});
</script>
