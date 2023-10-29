<template>
  <Fetchable :retry="fetchSystem" :result="system">
    <div v-if="system">
      <SystemSummary v-model:entity="system" :fields="fields" />

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
import { wrapRequest } from '../../utils/api';
import ColorCircle from '../../components/global/color/ColorCircle.vue';
import CustomFields from '../../components/global/fields/CustomFields.vue';
import Members from '../../components/dashboard/members/Members.vue';
import Fetchable from '../../components/global/Fetchable.vue';
import { useGoBack } from '../../composables/goBack';
import Color from '../../components/global/color/ColorCircle.vue';
import SystemSummary from '../../components/global/system/SystemSummary.vue';
import { withBackground } from '../../composables/background';
import PageFields from '../../components/global/page/PageFields.vue';
import { $system, $systemPage, SystemDtoInterface, PageDtoInterface, $systemField, FieldDtoInterface } from '@plurali/api-client';

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
    const system = ref<SystemDtoInterface | null | false>(false);
    const fields = ref<FieldDtoInterface[] | null | false>(false);
    const pages = ref<PageDtoInterface[] | null | false>(false);

    useGoBack('/dashboard');

    const fetchSystem = async () => {
      if (system.value === null) return;
      system.value = null;

      const res = await wrapRequest(() => $system.getSystem());
      system.value = res;

      if (system.value) {
        fetchFields();
        fetchPages();
      }
    };

    const fetchFields = async () => {
      if (fields.value === null) return;
      fields.value = null;

      const res = await wrapRequest(() => $systemField.getFields());
      fields.value = res;
    };

    const fetchPages = async () => {
      if (pages.value === null) return;
      pages.value = null;

      const res = await wrapRequest(() => $systemPage.getSystemPages());
      pages.value = res;
    };

    withBackground(system);

    onMounted(() => fetchSystem());

    return {
      fetchSystem,
      fetchPages,
      pages,
      fields,
      system,
    };
  },
});
</script>
