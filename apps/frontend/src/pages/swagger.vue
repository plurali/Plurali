<template>
  <div id="swagger-ui"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
// @ts-ignore
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-es-bundle.js';
import { apiUrl } from '@plurali/api-client';

export default defineComponent({
  setup() {
    const init = () => {
      SwaggerUIBundle({
        dom_id: '#swagger-ui',
        url: `${apiUrl}/oa-json`,
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
