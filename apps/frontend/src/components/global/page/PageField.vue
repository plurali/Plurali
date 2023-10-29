<template>
  <router-link
    v-if="page"
    :to="{
      name: isDashboard
        ? isMember
          ? 'dashboard:member:page:edit'
          : 'dashboard:system:page:edit'
        : isMember
        ? 'public:member:page'
        : 'public:system:page',
      params: {
        pageId: page.id,
        ...(isDashboard
          ? isMember
            ? { id: $route.params.id }
            : {}
          : isMember
          ? { memberId: $route.params.memberId }
          : { systemId: $route.params.systemId }),
      },
    }"
    @click.ctrl.prevent="toggleVisibility"
    class="px-4 py-3 border border-l-4 rounded-2xl block transition cursor-pointer bg-white bg-opacity-25"
    :class="[
      isDashboard ? (page.visible ? 'border-l-green-500' : 'border-l-red-500') : '',
      loading && '!bg-gray-100 bg-opacity-10',
    ]"
  >
    <p class="font-medium">{{ page.name }}</p>
  </router-link>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import ColorCircle from '../color/ColorCircle.vue';
import { getRouteParam } from '@plurali/common';
import { $memberPage, $systemPage, PageDtoInterface } from '@plurali/api-client';
import { wrapRequest } from '../../../utils/api';

export default defineComponent({
  components: { ColorCircle },
  model: {
    prop: 'field',
    event: 'change',
  },
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
    const page = ref<PageDtoInterface>(_page);

    const loading = ref(false);

    const route = useRoute();

    const isDashboard = computed(() => String(route.name).includes('dashboard'));

    const isMember = computed(() => String(route.name).includes('member'));

    const memberId = computed(() =>
      isMember.value ? getRouteParam(isDashboard.value ? route.params.id : route.params.memberId) : null
    );

    const toggleVisibility = async () => {
      if (!modifiable || loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!page.value) return null;

        return isMember.value
          ? $memberPage.updateMemberPage(memberId.value ?? '', page.value.id, { visible: page.value.visible })
          : $systemPage.updateSystemPage(page.value.id, { visible: page.value.visible });
      });

      loading.value = false;
    };

    return {
      toggleVisibility,
      page,
      loading,
      isMember,
      isDashboard,
    };
  },
});
</script>
