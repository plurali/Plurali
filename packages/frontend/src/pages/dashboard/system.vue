<template>
  <Fetchable :retry="fetchSystem" :result="system">
    <div v-if="system">
      <SystemSummary :system="system" />

      <Members />
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Title from '../../components/Title.vue';
import Subtitle from '../../components/Subtitle.vue';
import { System } from '@plurali/common/src/system';
import { wrapRequest } from '../../api';
import { getSystem } from '../../api/system';
import ColorCircle from '../../components/global/color/ColorCircle.vue';
import CustomFields from '../../components/global/fields/CustomFields.vue';
import Members from '../../components/dashboard/members/Members.vue';
import Fetchable from '../../components/global/Fetchable.vue';
import { useGoBack } from '../../composables/goBack';
import Color from '../../components/global/color/ColorCircle.vue';
import SystemSummary from '../../components/global/system/SystemSummary.vue';
import { withBackground } from '../../composables/background';

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
  },
  setup() {
    const system = ref<System | null | false>(false);

    useGoBack('/dashboard');

    const fetchSystem = async () => {
      if (system.value === null) return;
      system.value = null;

      const res = await wrapRequest(getSystem);
      system.value = res ? res.system : res;
    };

    withBackground(system);

    onMounted(() => fetchSystem());

    return {
      fetchSystem,
      system,
    };
  },
});
</script>
