<template>
  <div ref="div"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Sanitizer } from '../../sanitizer';
import { setHTML } from '../../sanitizer/polyfill';

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const s = ref<Sanitizer>(new Sanitizer());
    const div = ref<HTMLDivElement>();

    onMounted(() => {
      if (div.value) {
        setHTML.bind(div.value)(props.value, { sanitizer: s.value });
      }
    });

    return {
      s,
      div,
    };
  },
});
</script>
