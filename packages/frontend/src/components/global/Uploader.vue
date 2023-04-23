<template>
  <div
    @dragover="() => (dragged = true)"
    @dragleave="() => (dragged = false)"
    @drop.prevent="onDrop"
    class="w-full min-h-[10rem] h-full inset-0 flex justify-center items-center rounded-2xl cursor-pointer"
    @click="() => uploaderEl?.click()"
    :class="!upload && 'bg-gray-100 bg-opacity-50'"
  >
    <input type="file" ref="uploaderEl" class="hidden" :accept="accept.join(',')" @change="onChange" />
    <div v-if="!dragged && !thumbnail" class="inline-flex justify-center items-center gap-4">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 shadow-xl">
        <DocumentArrowUpIcon class="h-8 w-8 text-violet-600" aria-hidden="true" />
      </div>
      <p class="text-2xl text-violet-600 font-light hidden uppercase md:inline-block t">
        {{ upload && !thumbnail ? 'Preview not available' : 'or drag & drop' }}
      </p>
    </div>

    <div v-else-if="dragged" class="text-2xl text-violet-600 font-medium hidden md:inline-block">
      you're almost there!
    </div>

    <img
      v-else-if="thumbnail"
      :src="thumbnail"
      class="rounded-2xl sm:max-h-64 md:max-h-[32rem] border-2 border-violet-500 border-opacity-50"
    />
  </div>
</template>

<script lang="ts">
import { DocumentArrowUpIcon } from '@heroicons/vue/24/outline';
import { PropType, computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<Blob | null>,
      default: null,
    },
    accept: {
      type: Array as PropType<string[]>,
      default: ['image/png', 'image/jpeg', 'image/avif', 'image/gif', 'image/webp'],
    },
  },
  emits: ['update:modelValue', 'submit'],
  setup(props, { emit }) {
    const dragged = ref(false);

    const uploaderEl = ref<HTMLInputElement | null>(null);

    const upload = computed({
      get() {
        return props.modelValue;
      },
      set(v) {
        emit('update:modelValue', v);
      },
    });

    const thumbnail = computed(() => {
      if (!upload.value) return null;
      try {
        return URL.createObjectURL(upload.value);
      } catch {
        return null;
      }
    });

    const onChange = () => {
      if (uploaderEl.value && uploaderEl.value.files) {
        upload.value = uploaderEl.value.files.length >= 1 ? uploaderEl.value.files.item(0) : null;
      }
    };

    const onDrop = (e: DragEvent) => {
      alert('dropped  ');
      dragged.value = false;
      if (e.dataTransfer?.files && e.dataTransfer.files.length >= 1) {
        const file = e.dataTransfer.files.item(0);
        if (file?.type && props.accept.find(accepted => file.type.toLowerCase() === accepted.toLowerCase())) {
          upload.value = file;
        }
      }
    };

    const _prevent = (e: Event) => e.preventDefault();

    const dragEvents: string[] = ['dragenter', 'dragleave', 'dragover', 'drop'];

    onMounted(() => dragEvents.forEach(eventName => document.body.addEventListener(eventName, _prevent)));
    onUnmounted(() => dragEvents.forEach(e => document.body.removeEventListener(e, _prevent)));

    return {
      dragged,
      uploaderEl,
      onChange,
      onDrop,
      upload,
      thumbnail,
    };
  },
  components: { DocumentArrowUpIcon },
});
</script>
