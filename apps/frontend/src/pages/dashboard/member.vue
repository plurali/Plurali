<template>
  <Fetchable :result="data.member" :retry="fetchAll">
    <MemberSummary v-model="data" />
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { getRouteParam } from '../../utils';
import { wrapRequest } from '../../api';
import { getMember, getSystem } from '../../api/system';
import { getMemberPages } from '../../api/page';
import { useGoBack } from '../../composables/goBack';
import { withBackground } from '../../composables/background';
import Fetchable from '../../components/global/Fetchable.vue';
import { string } from '../../api/fields';
import { PagesResponse } from '@app/v1/dto/page/response/PagesResponse';
import { PageDto } from '@app/v1/dto/page/PageDto';
import MemberSummary from '../../components/global/members/MemberSummary.vue';

export default defineComponent({
  components: {
    Fetchable,
    MemberSummary,
  },
  setup() {
    // TODO
    const data = reactive({
      system: false as SystemDto | null | false,
      member: false as UserMemberDto | null | false,
      pages: false as PageDto[] | null | false,
    });

    const route = useRoute();

    useGoBack('/dashboard/system');

    const fetchAll = async () => {
      if (data.system === null || data.member === null || data.pages === null) return;
      data.system = data.member = null;

      let sys = await wrapRequest(getSystem);
      data.system = sys ? sys.system : sys;

      if (data.system) {
        let mem = await wrapRequest(() => getMember(getRouteParam(route.params.id)));
        data.member = mem ? mem.member : mem;

        if (data.member) {
          const id = data.member.id; // stupid ts
          const res = await wrapRequest<PagesResponse>(() => getMemberPages(id));
          data.pages = res ? res.pages : res;
        }
      }
    };

    withBackground(() => data.member);

    onMounted(() => fetchAll());

    return {
      fetchAll,
      data,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
      string,
    };
  },
});
</script>
