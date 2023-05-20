<template>
  <div v-if="computedFields.length >= 1" class="mb-5">
    <p class="inline-flex items-center gap-1 mb-3">
      {{ title ?? 'Custom Fields' }} ({{ computedFields.length }}):
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <CustomField :modifiable="modifiable" v-for="field of computedFields" :field="field" />
    </div>
  </div>
</template>
<script lang="ts">
import CustomField from './CustomField.vue'
import { computed, defineComponent, PropType, ref } from 'vue'
import type { UserFieldDto } from '@app/v1/dto/user/field/UserFieldDto'
import type { UserValueFieldDto } from '@app/v1/dto/user/field/UserValueFieldDto'
import Fetchable from '../Fetchable.vue'

export default defineComponent({
  props: {
    fields: {
      type: Array as PropType<(UserFieldDto | UserValueFieldDto)[]>,
      required: true,
    },
    modifiable: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
    },
    hideNoValues: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    Fetchable,
    CustomField,
  },
  setup({ fields: _fields, hideNoValues }) {
    const customFields = ref<(MemberField | MemberFieldWithValue)[] | null | false>(_fields)

    return {
      customFields,
      computedFields: computed(() =>
        customFields.value
          ? customFields.value.filter(field => {
              return hideNoValues ? (field as any).value?.length >= 1 : true
            })
          : []
      ),
    }
  },
})
</script>
