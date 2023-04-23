<template>
  <Fetchable :result="members" retry-text="Load members" :retry="fetchMembers">
    <div v-if="members" class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
      <MemberSmallCard v-for="member of members" :member="member" />
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Member } from '@plurali/common/src/system'
import { flash, FlashType } from '../../../store'
import { formatError } from '../../../api'
import { getMembers } from '../../../api/public'
import Fetchable from '../../global/Fetchable.vue'
import Color from '../../global/color/ColorCircle.vue'
import MemberSmallCard from '../../global/members/MemberSmallCard.vue'
import { getRouteParam } from '@plurali/common/src/utils'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: { MemberSmallCard, Color, Fetchable },
  setup() {
    const members = ref<Member[] | null | false>(false)

    const route = useRoute()

    const fetchMembers = async () => {
      if (members.value === null) return
      members.value = null
      try {
        const res = (await getMembers(getRouteParam(route.params.systemId))).data
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
