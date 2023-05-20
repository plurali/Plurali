<template>
  <Fetchable :retry="fetchSystem" :result="system">
    <SystemSummary v-if="system" v-model:entity="system" />
    <Members />
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Title from '../components/Title.vue'
import Subtitle from '../components/Subtitle.vue'
import ButtonLink from '../components/ButtonLink.vue'
import Button from '../components/Button.vue'
import Spinner from '../components/Spinner.vue'
import type { SystemDto } from '@app/v1/dto/user/system/SystemDto'
import { wrapRequest } from '../api'
import Color from '../components/global/color/ColorCircle.vue'
import { useRoute } from 'vue-router'
import Fetchable from '../components/global/Fetchable.vue'
import CustomFields from '../components/global/fields/CustomFields.vue'
import Members from '../components/front/members/Members.vue'
import ColorCircle from '../components/global/color/ColorCircle.vue'
import SystemSummary from '../components/global/system/SystemSummary.vue'
import { getRouteParam } from '../utils'
import { withBackground } from '../composables/background'
import { getSystem } from '../api/public'

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
    const system = ref<SystemDto | null | false>(false)

    const route = useRoute()

    const fetchSystem = async () => {
      if (system.value === null) return
      system.value = null

      const res = await wrapRequest(() => getSystem(getRouteParam(route.params.systemId)))
      system.value = res ? res.system : res;
    }

    withBackground(system);   

    onMounted(() => fetchSystem())

    return {
      fetchSystem,
      system,
    }
  },
})
</script>
