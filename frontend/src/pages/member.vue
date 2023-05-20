<template>
  <Fetchable :result="member" :retry="fetchMember">
    <div v-if="member">
      <MemberSummary :member="member" />

      <UserContent class="mb-5 p-6" v-if="member.data.customDescription">
        <Sanitized :value="member.data.customDescription" />
      </UserContent>

      <CustomFields :fields="member.fields" :modifiable="false" title="System-wide Custom Fields" />
      
      <Fetchable :result="pages" :retry="fetchPages">
        <PageFields v-if="pages" :pages="pages" :modifiable="false"/>
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
import { wrapRequest } from '../api';
import { getMember, getMemberPages } from '../api/public';
import Color from '../components/global/color/ColorCircle.vue';
import { useGoBack } from '../composables/goBack';
import Fetchable from '../components/global/Fetchable.vue';
import CustomFields from '../components/global/fields/CustomFields.vue';
import PageFields from '../components/global/page/PageFields.vue';
import ColorCircle from '../components/global/color/ColorCircle.vue';
import { getRouteParam } from '../utils';
import MemberSummary from '../components/global/members/MemberSummary.vue';
import UserContent from '../components/global/UserContent.vue';
import Sanitized from '../components/global/Sanitized.vue';
import { withBackground } from '../composables/background';
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import type { PageDto } from '@app/v2/dto/page/PageDto';
import type { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';

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
    const member = ref<UserMemberDto | null | false>(false);
    const pages = ref<PageDto[] | null | false>(false);

    const route = useRoute();

    const systemId = computed(() => getRouteParam(route.params.systemId));
    const memberId = computed(() => getRouteParam(route.params.memberId));

    useGoBack(`/${systemId.value}`);

    const fetchMember = async () => {
      if (member.value === null) return;
      member.value = null;

      const res = await wrapRequest(() => getMember(systemId.value, memberId.value));
      member.value = res ? res.member : res;

      if (member.value) {
        await fetchPages();
      }
    };

    const fetchPages = async () => {
      if (pages.value === null) return;
      pages.value = null;

      const res = await wrapRequest<PagesResponse>(() => getMemberPages(memberId.value));
      pages.value = res ? res.pages : res;
    };

    withBackground(member);

    onMounted(() => fetchMember());

    return {
      fetchMember,
      fetchPages,
      member,
      pages,
      systemId,
    };
  },
});
</script>
