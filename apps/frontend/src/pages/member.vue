<template>
  <Fetchable :result="data.member" :retry="fetchMember">
    <MemberSummary v-model="data" />
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { wrapRequest } from '../api';
import { getMember, getMemberPages } from '../api/public';
import { useGoBack } from '../composables/goBack';
import Fetchable from '../components/global/Fetchable.vue';
import { getRouteParam } from '../utils';
import { withBackground } from '../composables/background';
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { useMeta } from '../utils/meta';
import { PagesResponse } from '@app/v1/dto/page/response/PagesResponse';
import { PageDto } from '@app/v1/dto/page/PageDto';
import MemberSummary from '../components/global/members/MemberSummary.vue';

export default defineComponent({
  components: {
    Fetchable,
    MemberSummary,
},
  setup() {
    const data = reactive({
      member: false as UserMemberDto | null | false,
      pages: false as PageDto[] | null | false,
      system: null,
    });

    const route = useRoute();

    const systemId = computed(() => getRouteParam(route.params.systemId));
    const memberId = computed(() => getRouteParam(route.params.memberId));

    useGoBack(`/${systemId.value}`);

    const setMeta = useMeta();

    const fetchMember = async () => {
      if (data.member === null) return;
      data.member = null;

      const res = await wrapRequest(() => getMember(systemId.value, memberId.value));
      data.member = res ? res.member : res;

      if (data.member) {
        await fetchPages();
      }
    };

    const fetchPages = async () => {
      if (data.pages === null) return;
      data.pages = null;

      const res = await wrapRequest<PagesResponse>(() => getMemberPages(memberId.value));
      data.pages = res ? res.pages : res;
    };

    withBackground(() => data.member);

    onMounted(() => fetchMember());

    const stopWatch = watch(() => data.member, (member) => {
      setMeta({
        title: member ? member.name : '',
        description: member ? member.description ?? '' : '',
        imageUrl: member ? member.avatar ?? '' : '',
        color: member ? member.color ?? '' : '',
      });
    })

    onBeforeUnmount(() => stopWatch());

    return {
      fetchMember,
      fetchPages,
      data,
      systemId,
    };
  },
});
</script>
