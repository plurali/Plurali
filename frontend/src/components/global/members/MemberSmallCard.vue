<template>
  <router-link
    :disabled="loading"
    :aria-disabled="loading"
    @click.ctrl.prevent="toggleVisibility"
    :to="
      isDashboard
        ? `/dashboard/member/${systemMember.id}`
        : `${$route.fullPath}/${systemMember.data.slug}`
    "
    class="px-4 py-2 border border-l-4 rounded-2xl text-sm flex items-center gap-4 transition"
    :class="[
      isDashboard
        ? systemMember.data.visible
          ? 'border-l-green-500'
          : 'border-l-red-500'
        : '',
      loading && 'bg-gray-200',
    ]"
    :style="!isDashboard && systemMember.color ? { borderLeftColor: systemMember.color } : {}"
  >
    <img
      v-if="systemMember.avatar"
      :src="systemMember.avatar"
      :alt="systemMember.name"
      class="w-16 h-16 rounded-full object-cover"
      loading="lazy"
    />
    <Color
      v-else
      :color="systemMember.color ?? '#e2e8f0'"
      class="flex-shrink-0 w-16 h-16 opacity-25"
    />
    <div>
      <h2 class="text-xl font-medium">
        {{ systemMember.name }}
        <span v-if="systemMember.pronouns" class="text-sm text-gray-500 font-normaly">{{
          systemMember.pronouns
        }}</span>
      </h2>
      <h3 class="text-gray-700">{{ systemMember.description }}</h3>
    </div>
  </router-link>
</template>
<script lang="ts">
import Color from '../color/ColorCircle.vue'
import { computed, defineComponent, PropType, ref } from 'vue'
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto'
import { useRoute } from 'vue-router'
import { updateMember } from '../../../api/system'
import { flash, FlashType } from '../../../store'
import { formatError } from '../../../api'

export default defineComponent({
  components: {
    Color,
  },
  props: {
    member: {
      type: Object as PropType<UserMemberDto>,
      required: true,
    },
    modifiable: {
      type: Boolean,
      default: () => false,
    },
  },
  setup({ member: _member, modifiable }) {
    const systemMember = ref<UserMemberDto>(_member)

    const loading = ref(false)

    const route = useRoute()

    const toggleVisibility = async () => {
      if (!modifiable || loading.value) return
      loading.value = true

      try {
        const res = (
          await updateMember(systemMember.value.id, {
            visible: !systemMember.value.data.visible,
          })
        ).data
        if (!res.success) throw new Error(res.error)

        systemMember.value = res.data.member
        loading.value = false
      } catch (e) {
        flash(formatError(e), FlashType.Danger, true)
        loading.value = false
      }
    }

    return {
      systemMember,
      toggleVisibility,
      loading,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
    }
  },
})
</script>
