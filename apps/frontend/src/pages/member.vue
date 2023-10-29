<template>
  <Fetchable :result="member" :retry="fetchMember">
    <div v-if="member">
      <MemberSummary :member="member" />

      <UserContent class="mb-5 p-6" v-if="member.data.description">
        <Sanitized :value="member.data.description" />
      </UserContent>

      <Fetchable :result="fields" :retry="fetchFields">
        <CustomFields :fields="fields" :modifiable="false" title="System-wide Custom Fields" />
      </Fetchable>

      <Fetchable :result="pages" :retry="fetchPages">
        <PageFields v-if="pages" :pages="pages" :modifiable="false" />
      </Fetchable>
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
import { wrapRequest } from '../utils/api';
import Color from '../components/global/color/ColorCircle.vue';
import { useGoBack } from '../composables/goBack';
import Fetchable from '../components/global/Fetchable.vue';
import CustomFields from '../components/global/fields/CustomFields.vue';
import PageFields from '../components/global/page/PageFields.vue';
import ColorCircle from '../components/global/color/ColorCircle.vue';
import { getRouteParam } from '@plurali/common';
import MemberSummary from '../components/global/members/MemberSummary.vue';
import UserContent from '../components/global/UserContent.vue';
import Sanitized from '../components/global/Sanitized.vue';
import { withBackground } from '../composables/background';
import { $member, $memberField, $memberPage, MemberDtoInterface, PageDtoInterface, FieldDtoInterface } from '@plurali/api-client';

export default defineComponent({
  components: {
    MemberSummary,
    ColorCircle,
    CustomFields,
    PageFields,
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
    const member = ref<MemberDtoInterface | null | false>(false);
    const pages = ref<PageDtoInterface[] | null | false>(false);
    const fields = ref<FieldDtoInterface[] | null | false>(false);

    const route = useRoute();

    const systemId = computed(() => getRouteParam(route.params.systemId));
    const memberId = computed(() => getRouteParam(route.params.memberId));

    useGoBack(`/${systemId.value}`);

    const fetchMember = async () => {
      if (member.value === null) return;
      member.value = null;

      const res = await wrapRequest(() => $member.getPublicMember(systemId.value, memberId.value));
      member.value = res;

      if (member.value) {
        await Promise.all([fetchFields(), fetchPages()])
      }
    };

    const fetchPages = async () => {
      if (pages.value === null) return;
      pages.value = null;

      const res = await wrapRequest(() => $memberPage.getPublicMemberPages(systemId.value, memberId.value));
      pages.value = res;
    };

    const fetchFields = async () => {
      if (pages.value === null) return;
      pages.value = null;

      const res = await wrapRequest(() => $memberField.getPublicFields(systemId.value, memberId.value));
      fields.value = res;
    };

    withBackground(member);

    onMounted(() => fetchMember());

    return {
      fetchMember,
      fetchPages,
      fetchFields,
      member,
      pages,
      systemId,
    };
  },
});
</script>
