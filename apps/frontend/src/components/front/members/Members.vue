<template>
  <Fetchable :result="members" retry-text="Load members" :retry="fetchMembers">
    <div v-if="members" class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
      <MemberSmallCard v-for="member of members" :member="member" />
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { flash, FlashType } from '../../../store'
import Fetchable from '../../global/Fetchable.vue'
import Color from '../../global/color/ColorCircle.vue'
import MemberSmallCard from '../../global/members/MemberSmallCard.vue'
import { getRouteParam } from '@plurali/common'
import { useRoute } from 'vue-router'
import { $member, MemberDtoInterface } from '@plurali/api-client'
import { wrapRequest } from '../../../utils/api'

export default defineComponent({
  components: { MemberSmallCard, Color, Fetchable },
  setup() {
    const members = ref<MemberDtoInterface[] | null | false>(false);

    const route = useRoute();

    const systemId = computed(() => getRouteParam(route.params.systemId));

    const fetchMembers = async () => {
      if (members.value === null) return
      members.value = null
      
      const systemMembers = await wrapRequest(() => $member.getPublicMembers(systemId.value));

      members.value = systemMembers;
    }

    onMounted(() => fetchMembers())

    return {
      members,
      fetchMembers,
    }
  },
})
</script>
