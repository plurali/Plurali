<template>
  <Fetchable :result="data.member" :retry="fetchAll">
    <div
      class="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4"
    >
      <img
        v-if="data.member.avatar"
        :src="data.member.avatar"
        :alt="data.member.name"
        class="flex-shrink-0 w-32 h-32 rounded-full object-cover"
      />
      <Color
        v-else
        :color="data.member.color ?? '#e2e8f0'"
        class="flex-shrink-0 w-32 h-32 opacity-25"
      />
      <div>
        <p class="text-sm text-gray-700">SID: {{ data.member.id }}</p>
        <PageTitle class="text-violet-700 inline-flex items-center justify-center gap-3">
          {{ data.member.name }}
          <span class="inline-flex items-center justify-center gap-3">
            <VisibilityTag
              v-if="isDashboard"
              :disabled="toggling"
              :visible="data.member.data.visible"
              @click.prevent="toggleVisibility"
            />
            <a
              v-if="isDashboard && data.member.data.visible"
              :href="`/${data.system.data.slug}/${data.member.data.slug}`"
              class="text-sm text-gray-700 font-normal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <u>Open public view</u>
            </a>
          </span>
        </PageTitle>
        <Subtitle class="mb-3">{{ data.member.description ?? 'No description' }}</Subtitle>
        <span v-if="data.member.color" class="inline-flex text-gray-700 items-center gap-1">
          Color: {{ data.member.color }}
          <ColorCircle :color="data.member.color" />
        </span>
      </div>
    </div>

    <CustomFields
      :fields="data.member.fields"
      :modifiable="true"
      :hide-no-values="true"
      title="System-wide Custom Fields"
    />
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import PageTitle from '../../components/Title.vue'
import Subtitle from '../../components/Subtitle.vue'
import ButtonLink from '../../components/ButtonLink.vue'
import Button from '../../components/Button.vue'
import { bgColor } from '../../store'
import { Member, System } from "@plurali/common/src/system"
import { wrapRequest } from '../../api'
import { getMember, getSystem, updateMember } from '../../api/system'
import Color from '../../components/global/color/ColorCircle.vue'
import { useRoute } from 'vue-router'
import { useGoBack } from '../../composables/goBack'
import Fetchable from '../../components/global/Fetchable.vue'
import CustomFields from '../../components/global/fields/CustomFields.vue'
import ColorCircle from '../../components/global/color/ColorCircle.vue'
import { getRouteParam } from '../../utils'
import VisibilityTag from '../../components/global/visibility/VisibilityTag.vue'

export default defineComponent({
  components: {
    VisibilityTag,
    ColorCircle,
    CustomFields,
    Fetchable,
    PageTitle,
    Subtitle,
    ButtonLink,
    Button,
    Color,
  },
  setup() {
    // TODO
    const data = reactive<any>({
      system: false as System | null | false,
      member: false as Member | null | false,
    })

    const route = useRoute()

    const toggling = ref(false)

    useGoBack('/dashboard/system')

    const fetchAll = async () => {
      if (data.system === null || data.member === null) return
      data.system = data.member = null

      let sys = await wrapRequest(getSystem)
      data.system = sys ? sys.system : sys

      if (sys) {
        let mem = await wrapRequest(() => getMember(getRouteParam(route.params.id)))
        data.member = mem ? mem.member : mem

        if (data.member && data.member.color) {
          bgColor.value = data.member.color
        }
      }
    }

    const toggleVisibility = async () => {
      if (toggling.value) return
      toggling.value = true

      const res = await wrapRequest(() =>
        updateMember(data.member!.id, {
          visible: !data.member!.data.visible,
        })
      )

      data.member = res ? res.member : res
      toggling.value = false
    }

    onMounted(() => fetchAll())

    onBeforeUnmount(() => {
      bgColor.value = null
    })

    return {
      fetchAll,
      data,
      toggling,
      toggleVisibility,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
    }
  },
})
</script>
