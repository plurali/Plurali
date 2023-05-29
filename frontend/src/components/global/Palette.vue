<template>
  <div class="relative w-full">
    <input type="text" ref="paletteEl" />
    <div
      class="absolute w-full h-full inset-0 flex justify-center items-center rounded-2xl cursor-pointer bg-transparent"
      @click.prevent="onParentClick"
    >
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 shadow-xl">
        <EyeDropperIcon class="h-8 w-8 text-violet-600" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import Pickr from '@simonwep/pickr';

import '@simonwep/pickr/dist/themes/classic.min.css';
import { EyeDropperIcon } from '@heroicons/vue/24/outline';

export default defineComponent({
  props: {
    modelValue: {
      type: String as PropType<string | null>,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const paletteEl = ref<HTMLInputElement | null>();

    const palette = ref<Pickr | null>(null);

    const color = computed({
      get() {
        return props.modelValue;
      },
      set(v) {
        emit('update:modelValue', v);
      },
    });

    const onParentClick = () => {
      if (!palette.value) {
        createPalette();
      }
      if (palette.value!.isOpen()) {
        palette.value!.hide();
      } else {
        palette.value!.show();
      }
    };

    const destroyPalette = () => {
      if (palette.value) {
        palette.value.destroyAndRemove();
        palette.value = null;
      }
    };

    const createPalette = () => {
      if (paletteEl.value) {
        destroyPalette();
        const picker = Pickr.create();

        picker.on('save', () => (color.value = palette.value?.getColor().toHEXA().toString()));

        palette.value = picker;
      }
    };

    onMounted(() => {
      createPalette();
    });

    onBeforeUnmount(() => {
      destroyPalette();
    });

    return {
      paletteEl,
      palette,
      onParentClick,
    };
  },
  components: { EyeDropperIcon },
});
</script>

<style>
.pcr-app[data-theme='classic'] {
  @apply w-72 max-w-[18rem] !rounded-xl !important;
}
.pcr-app .pcr-palette {
  @apply !rounded-t-lg;
}
.pcr-app .pcr-palette:before {
  @apply !rounded-t-lg;
}
.pcr-interaction input[type='button'] {
  @apply border-[2.5px] !bg-violet-700 hover:!bg-opacity-75 border-violet-300 !text-white font-medium inline-flex justify-center items-center gap-1 rounded-[0.35rem] px-4 py-2 text-base;
}

.pcr-interaction input[type='text'] {
  @apply border-[2.5px] !bg-gray-200 bg-opacity-25 border-violet-300 !text-black font-medium inline-flex justify-center items-center gap-1 !rounded-md px-4 py-2 text-base;
}
.pcr-app .pcr-interaction .pcr-save:hover,
.pcr-app .pcr-interaction .pcr-cancel:hover,
.pcr-app .pcr-interaction .pcr-clear:hover {
  @apply !filter-none;
}
.pickr .pcr-button {
  @apply w-full min-h-[10rem] !rounded-2xl;
}
.pickr .pcr-button:before,
.pickr .pcr-button:after {
  @apply !rounded-2xl;
}
</style>
