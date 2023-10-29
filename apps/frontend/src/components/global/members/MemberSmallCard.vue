<template>
  <router-link :disabled="loading" :aria-disabled="loading" @click.ctrl.prevent="toggleVisibility" :to="isDashboard ? `/dashboard/member/${systemMember.pluralId}` : `/${$route.params.systemId}/m/${systemMember.data.slug}`
    " class="px-4 py-2 border border-l-4 rounded-2xl text-sm flex items-center gap-4 transition" :class="[
    isDashboard ? (isPublic ? 'border-l-green-500' : 'border-l-red-500') : '',
    loading && 'bg-gray-200',
  ]" :style="!isDashboard && systemMember.color ? { borderLeftColor: systemMember.color } : {}">
    <img v-if="systemMember.avatar" :src="systemMember.avatar" :alt="systemMember.name"
      class="w-16 h-16 rounded-full object-cover" loading="lazy" />
    <Color v-else :color="systemMember.color ?? '#e2e8f0'" class="flex-shrink-0 !w-16 !h-16 opacity-25" />
    <div>
      <h2 class="text-xl font-medium">
        {{ systemMember.name }}
        <span v-if="systemMember.pronouns" class="text-sm text-gray-500 font-normaly">{{ systemMember.pronouns }}</span>
      </h2>
      <!-- <h3 class="text-gray-700 !max-w-md max-h-20 overflow-hidden w-full" v-if="systemMember.description">
        <Sanitized :value="string(systemMember.description, true)" />
      </h3> -->
    </div>
  </router-link>
</template>
<script lang="ts">
import Color from '../color/ColorCircle.vue';
import { computed, defineComponent, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import { flash, FlashType } from '../../../store';
import Sanitized from '../Sanitized.vue';
import { $member, MemberDtoInterface } from '@plurali/api-client';
import { formatString, isVisibilityPublic, toggleVisibilityState } from '@plurali/common';
import { wrapRequest } from '../../../utils/api';

export default defineComponent({
  components: {
    Color,
    Sanitized,
  },
  props: {
    member: {
      type: Object as PropType<MemberDtoInterface>,
      required: true,
    },
    modifiable: {
      type: Boolean,
      default: () => false,
    },
  },
  setup({ member: _member }) {
    const systemMember = ref<MemberDtoInterface>(_member);

    const loading = ref(false);

    const route = useRoute();

    const toggleVisibility = async () => {
      if (loading.value || !systemMember.value) return;
      loading.value = true;

      const newVisibility = toggleVisibilityState(systemMember.value.data.visibility);

      const updatedMember = await wrapRequest(() =>
        $member.updateMember(systemMember.value.pluralId, {
          visibility: newVisibility,
        })
      );

      loading.value = false;

      if (!updatedMember) {
        flash('An error has occurred while changing the visibility state.', FlashType.Danger);
        return;
      }

      systemMember.value = updatedMember;
    };

    return {
      systemMember,
      toggleVisibility,
      loading,
      formatString,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
      isPublic: computed(() => isVisibilityPublic(systemMember.value)),
    };
  },
});
</script>
