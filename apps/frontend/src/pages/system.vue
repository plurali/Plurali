<template>
  <Fetchable :retry="fetchSystem" :result="system">
    <SystemSummary v-if="system" v-model:entity="system" />

    <Fetchable :result="pages" :retry="fetchPages">
      <PageFields v-if="pages" :pages="pages" :modifiable="false" />
    </Fetchable>

    <Members />
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import Title from '../components/Title.vue';
import Subtitle from '../components/Subtitle.vue';
import ButtonLink from '../components/ButtonLink.vue';
import Button from '../components/Button.vue';
import Spinner from '../components/Spinner.vue';
import { wrapRequest } from '../utils/api';
import Color from '../components/global/color/ColorCircle.vue';
import { useRoute } from 'vue-router';
import Fetchable from '../components/global/Fetchable.vue';
import Members from '../components/front/members/Members.vue';
import ColorCircle from '../components/global/color/ColorCircle.vue';
import SystemSummary from '../components/global/system/SystemSummary.vue';
import PageFields from '../components/global/page/PageFields.vue';
import { getRouteParam } from '@plurali/common';
import { withBackground } from '../composables/background';
import { $system, $systemPage, SystemDtoInterface, PageDtoInterface } from '@plurali/api-client';

export default defineComponent({
  components: {
    SystemSummary,
    ColorCircle,
    Members,
    PageFields,
    Fetchable,
    Spinner,
    Title,
    Subtitle,
    ButtonLink,
    Button,
    Color,
  },
  setup() {
    const system = ref<SystemDtoInterface | null | false>(false);
    const pages = ref<PageDtoInterface[] | null | false>(false);

    const route = useRoute();

    const systemId = computed(() => getRouteParam(route.params.systemId));

    const fetchSystem = async () => {
      if (system.value === null) return;
      system.value = null;

      const res = await wrapRequest(() => $system.getPublicSystem(systemId.value));
      system.value = res ?? null;

      if (system.value) {
        await fetchPages();
      }
    };

    const fetchPages = async () => {
      if (pages.value === null) return;
      pages.value = null;

      const res = await wrapRequest(() => $systemPage.getPublicSystemPages(systemId.value));
      pages.value = res ?? [];
    };

    withBackground(system);

    onMounted(() => fetchSystem());

    return {
      fetchSystem,
      fetchPages,
      pages,
      system,
    };
  },
});
</script>
