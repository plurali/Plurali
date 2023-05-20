<template>
  <Fetchable :retry="fetchSystem" :result="system">
    <SystemSummary v-if="system" v-model:entity="system" />
    <Members />
    <Fetchable :result="pages" :retry="fetchPages">
      <PageFields :pages="pages" :modifiable="false" />
    </Fetchable>
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import Title from '../components/Title.vue';
import Subtitle from '../components/Subtitle.vue';
import ButtonLink from '../components/ButtonLink.vue';
import Button from '../components/Button.vue';
import Spinner from '../components/Spinner.vue';
import type { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import { wrapRequest } from '../api';
import Color from '../components/global/color/ColorCircle.vue';
import { useRoute } from 'vue-router';
import Fetchable from '../components/global/Fetchable.vue';
import Members from '../components/front/members/Members.vue';
import ColorCircle from '../components/global/color/ColorCircle.vue';
import SystemSummary from '../components/global/system/SystemSummary.vue';
import PageFields from '../components/global/page/PageFields.vue';
import { getRouteParam } from '../utils';
import { withBackground } from '../composables/background';
import { getSystem, getSystemPages, } from '../api/public';
import type { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';
import type { PageDto } from '@app/v2/dto/page/PageDto';

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
    const system = ref<SystemDto | null | false>(false);
    const pages = ref<PageDto[] | null | false>(false);

    const route = useRoute();

    const systemId = computed(() => getRouteParam(route.params.systemId));

    const fetchSystem = async () => {
      if (system.value === null) return;
      system.value = null;

      const res = await wrapRequest(() => getSystem(systemId.value));
      system.value = res ? res.system : res;

      if (system.value) {
        await fetchPages();
      }
    };

    const fetchPages = async () => {
      if (pages.value === null) return;
      pages.value = null;

      const res = await wrapRequest<PagesResponse>(() => getSystemPages(systemId.value));
      pages.value = res ? res.pages : res;
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
