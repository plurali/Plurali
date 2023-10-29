<template>
  <Fetchable :result="page" :retry="fetchPage">
    <div v-if="page">
        <h1 class="text-4xl my-5">{{ page.name }}</h1>
        <UserContent>
          <Sanitized :value="page.content" />
        </UserContent>
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Title from '../components/Title.vue';
import Subtitle from '../components/Subtitle.vue';
import ButtonLink from '../components/ButtonLink.vue';
import Button from '../components/Button.vue';
import Spinner from '../components/Spinner.vue';
import Color from '../components/global/color/ColorCircle.vue';
import { useGoBack } from '../composables/goBack';
import Fetchable from '../components/global/Fetchable.vue';
import CustomFields from '../components/global/fields/CustomFields.vue';
import ColorCircle from '../components/global/color/ColorCircle.vue';
import { getRouteParam } from '@plurali/common';
import MemberSummary from '../components/global/members/MemberSummary.vue';
import UserContent from '../components/global/UserContent.vue';
import Sanitized from '../components/global/Sanitized.vue';
import { $memberPage, $systemPage, PageDtoInterface } from '@plurali/api-client';
import { wrapRequest } from '../utils/api';

export default defineComponent({
  components: {
    MemberSummary,
    ColorCircle,
    CustomFields,
    Fetchable,
    Spinner,
    Title,
    Subtitle,
    ButtonLink,
    Button,
    Color,
    UserContent,
    Sanitized,
  },
  setup() {
    const page = ref<PageDtoInterface | null | false>(false);

    const route = useRoute();

    const ownerType = computed(() => (String(route.name).includes('public:system') ? 'system' : 'member'));
    const memberId = computed(() => getRouteParam(route.params.memberId));
    const systemId = computed(() => getRouteParam(route.params.systemId))
    const pageId = computed(() => getRouteParam(route.params.pageId));

    useGoBack(ownerType.value === 'member' ? `/${systemId.value}/m/${memberId.value}` : `/${systemId.value}`);

    const fetchPage = async () => {
      if (page.value === null) return;
      page.value = null;

      const res = await wrapRequest(() =>
        ownerType.value === 'system'
          ? $systemPage.getPublicSystemPage(systemId.value, pageId.value)
          : $memberPage.getPublicMemberPage(systemId.value, memberId.value, pageId.value)
      );

      page.value = res;
    };

    onMounted(() => fetchPage());

    return {
      fetchPage,
      page,
    };
  },
});
</script>
