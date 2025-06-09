<template>
  <router-link
    v-if="customPage"
    :to="routerTo"
    class="px-4 py-3 border border-l-4 rounded-2xl block transition cursor-pointer bg-white bg-opacity-25"
    :class="[
      isDashboard ? (customPage.visibility === Visibility.Public ? 'border-l-green-500' : 'border-l-red-500') : '',
      loading && '!bg-gray-100 bg-opacity-10',
    ]"
    @click.ctrl.prevent="toggleVisibility"
  >
    <p class="font-medium">{{ customPage.name }}</p>
  </router-link>
</template>
<script lang="ts">
import { $memberPage, $systemPage, PageDtoInterface } from "@plurali/api-client";
import { OwnerType, Visibility } from "@plurali/api-client";
import { toggleVisibilityState } from "@plurali/common";
import { computed, defineComponent, PropType, ref } from "vue";
import { useRoute } from "vue-router";

import { wrapRequest } from "../../../api";
import { getRouteParam } from "../../../utils";

export default defineComponent({
  props: {
    page: {
      type: Object as PropType<PageDtoInterface>,
      required: true,
    },
    modifiable: {
      type: Boolean,
      default: () => false,
    },
  },
  setup: function ({ page: _page, modifiable }) {
    const customPage = ref<PageDtoInterface>(_page);

    const loading = ref(false);

    const route = useRoute();

    const isDashboard = computed(() => String(route.name).includes("dashboard"));

    const isMember = computed(() => customPage.value.ownerType === OwnerType.Member);

    const memberId = computed(() =>
      isMember.value ? getRouteParam(isDashboard.value ? route.params.id : route.params.memberId) : null,
    );

    const routerTo = computed(() => {
      let name: string;
      let params: Record<string, unknown> = { pageId: isDashboard.value ? customPage.value.id : customPage.value.slug };

      if (isMember.value) {
        name = isDashboard.value ? "dashboard:member:page:edit" : "public:member:page";
        // Use owner id in dashboard, slug otherwise
        params.memberId = isDashboard.value ? customPage.value.ownerId : route.params.memberId;
      } else {
        name = isDashboard.value ? "dashboard:system:page:edit" : "public:system:page";
        // Only public view requires system id
        if (!isDashboard.value) {
          params.systemId = route.params.systemId;
        }
      }

      return {
        name,
        params,
      };
    });

    const toggleVisibility = async () => {
      if (!modifiable || loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!customPage.value) return null;

        return isMember.value
          ? $memberPage.updateMemberPage(memberId.value ?? "", customPage.value.id, {
              visibility: toggleVisibilityState(customPage.value.visibility),
            })
          : $systemPage.updateSystemPage(customPage.value.id, {
              visibility: toggleVisibilityState(customPage.value.visibility),
            });
      });

      if (res) {
        customPage.value = res;
      }

      loading.value = false;
    };

    return {
      toggleVisibility,
      customPage,
      loading,
      isMember,
      isDashboard,
      Visibility,
      routerTo,
    };
  },
});
</script>
