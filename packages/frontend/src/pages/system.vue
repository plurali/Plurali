<template>
  <Fetchable :retry="fetchSystem" :result="system">
    <SystemSummary v-if="system" :system="system" />

    <CustomFields v-if="system" :fields="system.fields" :modifiable="false" />

    <Members />
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import Title from '../components/Title.vue'
import Subtitle from '../components/Subtitle.vue'
import ButtonLink from '../components/ButtonLink.vue'
import Button from '../components/Button.vue'
import { bgColor } from '../store'
import Spinner from '../components/Spinner.vue'
import { System } from '@plurali/common/src/system'
import { wrapRequest } from '../api'
import Color from '../components/global/color/ColorCircle.vue'
import { useRoute } from 'vue-router'
import Fetchable from '../components/global/Fetchable.vue'
import CustomFields from '../components/global/fields/CustomFields.vue'
import Members from '../components/front/members/Members.vue'
import ColorCircle from '../components/global/color/ColorCircle.vue'
import { getSystem } from '../api/public'
import SystemSummary from '../components/global/system/SystemSummary.vue'
import { getRouteParam } from '../utils'

export default defineComponent({
  components: {
    SystemSummary,
    ColorCircle,
    Members,
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
    const system = ref<System | null | false>(false)

    const route = useRoute()

    const fetchSystem = async () => {
      if (system.value === null) return
      system.value = null

      const res = await wrapRequest(() => getSystem(getRouteParam(route.params.systemId)))
      system.value = res ? res.system : res

      if (res && res.system.color) {
        bgColor.value = res.system.color
      }
    }

    onMounted(() => fetchSystem())

    onBeforeUnmount(() => {
      bgColor.value = null
    })

    return {
      fetchSystem,
      system,
    }
  },
})
</script>
