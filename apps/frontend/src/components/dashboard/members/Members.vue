<template>
  <Fetchable :result="members" retry-text="Load members" :retry="fetchMembers">
    <div v-if="members" class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
      <MemberSmallCard v-for="member of members" :member="member" :modifiable="true" />
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { flash, FlashType } from '../../../store'
import Fetchable from '../../../components/global/Fetchable.vue'
import Color from '../../../components/global/color/ColorCircle.vue'
import MemberSmallCard from '../../../components/global/members/MemberSmallCard.vue'
import { $member, MemberDtoInterface } from '@plurali/api-client'
import { wrapRequest } from '../../../utils/api'

export default defineComponent({
  components: { MemberSmallCard, Color, Fetchable },
  setup() {
    const members = ref<MemberDtoInterface[] | null | false>(false)

    const fetchMembers = async () => {
      if (members.value === null) return
      members.value = null
     
      const systemMembers = await wrapRequest(() => $member.getMembers());

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
