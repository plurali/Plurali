<template>
  <div id="swagger-ui"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
// @ts-ignore
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-es-bundle.js';
import { $axios } from '../api';

export default defineComponent({
  setup() {
    const init = () => {
      SwaggerUIBundle({
        dom_id: '#swagger-ui',
        url: `${$axios.defaults.baseURL}/oa-json`,
        presets: [SwaggerUIBundle.presets.apis],
      });
    };

    onMounted(init);
  },
});
</script>

<style>
@import 'swagger-ui-dist/swagger-ui.css';
</style>
