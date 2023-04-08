<template>
  <Fetchable :result="member" :retry="fetchMember">
    <MemberSummary :member="member" />

    <CustomFields
      :fields="member.fields"
      :modifiable="false"
      title="System-wide Custom Fields"
    />
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import Title from '../components/Title.vue'
import Subtitle from '../components/Subtitle.vue'
import ButtonLink from '../components/ButtonLink.vue'
import Button from '../components/Button.vue'
import { bgColor } from '../store'
import Spinner from '../components/Spinner.vue'
import { wrapRequest } from '../api'
import { getMember } from '../api/public'
import Color from '../components/global/color/ColorCircle.vue'
import { useRoute } from 'vue-router'
import { useGoBack } from '../composables/goBack'
import Fetchable from '../components/global/Fetchable.vue'
import CustomFields from '../components/global/fields/CustomFields.vue'
import ColorCircle from '../components/global/color/ColorCircle.vue'
import { getRouteParam } from '../utils'
import MemberSummary from '../components/global/members/MemberSummary.vue'

export default defineComponent({
  components: {
    MemberSummary,
    ColorCircle,
    CustomFields,
    Fetchable,
    Spinner,
    Title,
    Subtitle,
    ButtonLink,
    Button,
    Color,
  },
  setup() {
    // TODO Member|null|false
    const member = ref<any>(false)

    const route = useRoute()

    const systemId = computed(() => getRouteParam(route.params.systemId))

    useGoBack(`/${systemId.value}`)

    const fetchMember = async () => {
      if (member.value === null) return
      member.value = null

      const res = await wrapRequest(() =>
        getMember(systemId.value, getRouteParam(route.params.memberId))
      )
      member.value = res ? res.member : res

      if (res && res.member.color) {
        bgColor.value = res.member.color
      }
    }

    onMounted(() => fetchMember())

    onBeforeUnmount(() => {
      bgColor.value = null
    })

    return {
      fetchMember,
      member,
      systemId,
    }
  },
})
</script>
