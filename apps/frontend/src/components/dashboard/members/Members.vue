<template>
  <Fetchable :result="members" retry-text="Load members" :retry="fetchMembers">
    <div v-if="members" class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
      <MemberSmallCard v-for="member of members" :member="member" :modifiable="true" />
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto'
import { flash, FlashType } from '../../../store'
import { formatError } from '../../../api'
import { getMembers } from '../../../api/system'
import Fetchable from '../../../components/global/Fetchable.vue'
import Color from '../../../components/global/color/ColorCircle.vue'
import MemberSmallCard from '../../../components/global/members/MemberSmallCard.vue'

export default defineComponent({
  components: { MemberSmallCard, Color, Fetchable },
  setup() {
    const members = ref<UserMemberDto[] | null | false>(false)

    const fetchMembers = async () => {
      if (members.value === null) return
      members.value = null
      try {
        const res = (await getMembers()).data
        if (!res.success) throw new Error(res.error)

        members.value = res.data.members
      } catch (e) {
        members.value = false
        flash(formatError(e), FlashType.Danger, true)
      }
    }

    onMounted(() => fetchMembers())

    return {
      members,
      fetchMembers,
    }
  },
})
</script>
