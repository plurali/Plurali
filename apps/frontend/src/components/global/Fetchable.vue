<template>
  <div v-if="result === null" class="inline-flex w-full justify-center items-center">
    <Spinner class="!text-violet-700 w-10 h-10" />
  </div>
  <div v-else-if="result === false" class="inline-flex w-full justify-center items-center">
    <Button class="border border-gray-700 text-gray-700" @click.prevent="retry">{{ retryText }}</Button>
  </div>
  <slot v-else />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Button from "../Button.vue";
import Spinner from "../Spinner.vue";

export default defineComponent({
  components: {
    Button,
    Spinner,
  },
  props: {
    result: {
      type: Object as PropType<unknown | false | null>,
      default: null,
    },
    retry: {
      type: Function as PropType<() => unknown>,
      required: false,
      default: () => () => {},
    },
    retryText: {
      type: String,
      default: "Try again",
    },
  },
});
</script>
