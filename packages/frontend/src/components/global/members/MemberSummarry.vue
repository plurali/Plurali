<template>
  <div class="mb-5 flex flex-col justify-left items-center gap-4">
    <img
      v-if="member.avatar"
      :src="member.avatar"
      :alt="member.name"
      class="flex-shrink-0 w-32 h-32 rounded-full object-cover"
    />
    <ColorCircle
      v-else
      :color="member.color ?? '#e2e8f0'"
      class="flex-shrink-0 w-32 h-32 opacity-25"
    />
    <div>
      <p v-if="isDashboard" class="text-sm text-gray-700">SID: {{ member.id }}</p>
      <PageTitle class="text-violet-700">
        {{ member.name }}
      </PageTitle>
      <Subtitle class="mb-3">{{ member.description ?? 'No description' }}</Subtitle>
      <span v-if="member.color" class="inline-flex text-gray-700 items-center gap-1">
        Color: {{ member.color }} <ColorCircle :color="member.color" />
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import PageTitle from '../../Title.vue'
import ColorCircle from '../color/ColorCircle.vue'
import Subtitle from '../../Subtitle.vue'
import { computed, defineComponent, PropType } from 'vue'
import { Member } from '@plurali/common/src/system'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    PageTitle,
    Subtitle,
    ColorCircle,
  },
  props: {
    member: {
      type: Object as PropType<Member>,
      required: true,
    },
  },
  setup() {
    const route = useRoute()
    return {
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
    }
  },
})
</script>
