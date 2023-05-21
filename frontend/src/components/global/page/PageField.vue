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
import type { PageDto } from '@app/v2/dto/page/PageDto';
import { wrapRequest } from '../../../api/';
import { updateSystemPage, updateMemberPage } from '../../../api/page';
import ColorCircle from '../color/ColorCircle.vue';
import { getRouteParam } from '../../../utils';

export default defineComponent({
  components: { ColorCircle },
  model: {
    prop: 'field',
    event: 'change',
  },
  props: {
    page: {
      type: Object as PropType<PageDto>,
      required: true,
    },
    modifiable: {
      type: Boolean,
      default: () => false,
    },
  },
  setup: function ({ page: _page, modifiable }) {
    const page = ref<PageDto>(_page);

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
          ? updateMemberPage(memberId.value ?? '', page.value.id, { visible: page.value.visible })
          : updateSystemPage(page.value.id, { visible: page.value.visible });
      });

      if (res) {
        page.value = res.page;
      }

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
