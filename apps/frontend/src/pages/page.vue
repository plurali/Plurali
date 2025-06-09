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
import type { PageDto } from "@app/v2/dto/page/PageDto";
import { $memberPage, $systemPage } from "@plurali/api-client";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { wrapRequest } from "../api";
import Fetchable from "../components/global/Fetchable.vue";
import Sanitized from "../components/global/Sanitized.vue";
import UserContent from "../components/global/UserContent.vue";
import { useGoBack } from "../composables/goBack";
import { getRouteParam } from "../utils";

export default defineComponent({
  components: {
    Fetchable,
    UserContent,
    Sanitized,
  },
  setup() {
    const page = ref<PageDto | null | false>(false);

    const route = useRoute();

    const ownerType = computed(() => (String(route.name).includes("public:system") ? "system" : "member"));
    const memberId = computed(() => getRouteParam(route.params.memberId));
    const systemId = computed(() => getRouteParam(route.params.systemId));
    const pageId = computed(() => getRouteParam(route.params.pageId));

    useGoBack(ownerType.value === "member" ? `/${systemId.value}/m/${memberId.value}` : `/${systemId.value}`);

    const fetchPage = async () => {
      if (page.value === null) return;
      page.value = null;

      page.value = await wrapRequest(() =>
        ownerType.value === "system"
          ? $systemPage.getPublicSystemPage(systemId.value, pageId.value)
          : $memberPage.getPublicMemberPage(systemId.value, memberId.value, pageId.value),
      );
    };

    onMounted(() => fetchPage());

    return {
      fetchPage,
      page,
    };
  },
});
</script>
