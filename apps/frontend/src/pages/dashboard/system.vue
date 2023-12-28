<template>
  <Fetchable :retry="fetchSystem" :result="system">
    <div v-if="system">
      <SystemSummary v-model:entity="system" />

      <Fetchable :result="pages" :retry="fetchPages">
        <PageFields v-if="pages" :pages="pages" :modifiable="true" />
      </Fetchable>

      <Members />
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Title from '../../components/Title.vue';
import Subtitle from '../../components/Subtitle.vue';
import type { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import { wrapRequest } from '../../api';
import { getSystem } from '../../api/system';
import { $systemPage, PageDtoInterface } from '@plurali/api-client';
import ColorCircle from '../../components/global/color/ColorCircle.vue';
import CustomFields from '../../components/global/fields/CustomFields.vue';
import Members from '../../components/dashboard/members/Members.vue';
import Fetchable from '../../components/global/Fetchable.vue';
import { useGoBack } from '../../composables/goBack';
import Color from '../../components/global/color/ColorCircle.vue';
import SystemSummary from '../../components/global/system/SystemSummary.vue';
import { withBackground } from '../../composables/background';
import PageFields from '../../components/global/page/PageFields.vue';

export default defineComponent({
  components: {
    SystemSummary,
    Color,
    Fetchable,
    Members,
    CustomFields,
    Title,
    Subtitle,
    ColorCircle,
    PageFields
  },
  setup() {
    const system = ref<SystemDto | null | false>(false);
    const pages = ref<PageDtoInterface[] | null | false>(false);

    useGoBack('/dashboard');

    const fetchSystem = async () => {
      if (system.value === null) return;
      system.value = null;

      const res = await wrapRequest(getSystem);
      system.value = res ? res.system : res;

      if (system.value) {
        fetchPages();
      }
    };

    const fetchPages = async () => {
      if (pages.value === null) return;
      pages.value = null;

      pages.value = await wrapRequest(() => $systemPage.getSystemPages());
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
