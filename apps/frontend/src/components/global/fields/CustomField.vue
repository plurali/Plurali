<template>
  <div @click.prevent="toggleVisibility"
    class="px-4 py-3 border border-l-4 rounded-2xl block transition cursor-pointer bg-white bg-opacity-25" :class="[
      isDashboard
        ? isPublic
          ? 'border-l-green-500'
          : 'border-l-red-500'
        : '',
      loading && '!bg-gray-100 bg-opacity-10',
    ]">
    <p class="font-medium">{{ customField.name }}</p>
    <p v-if="value && value.length" class="text-gray-500">
      <span v-if="customField.type === 'Color'" class="inline-flex justify-center items-center gap-2">
        <ColorCircle :color="value!" />
        <span class="text-sm">{{ value }}</span>
      </span>
      <span class="max-h-20 overflow-x-hidden overflow-y-scroll" v-else>
        <Sanitized :value="value" />
      </span>
    </p>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useRoute } from 'vue-router'
import { flash, FlashType } from '../../../store'
import ColorCircle from '../color/ColorCircle.vue'
import Sanitized from '../Sanitized.vue'
import { $systemField, FieldDtoInterface, ValueFieldDtoInterface } from '@plurali/api-client'
import { formatField, isVisibilityPublic, toggleVisibilityState } from '@plurali/common'
import { wrapRequest } from '../../../utils/api'

export default defineComponent({
  components: { ColorCircle, Sanitized },
  model: {
    prop: 'field',
    event: 'change',
  },
  props: {
    field: {
      type: Object as PropType<FieldDtoInterface | ValueFieldDtoInterface>,
      required: true,
    },
    modifiable: {
      type: Boolean,
      default: () => false,
    },
  },
  setup: function ({ field: _field, modifiable }) {
    const customField = ref<FieldDtoInterface | ValueFieldDtoInterface>(_field)

    const loading = ref(false)

    const route = useRoute()

    const toggleVisibility = async () => {
      if (loading.value || !modifiable || !customField.value) return;
      loading.value = true;

      const newVisibility = toggleVisibilityState(customField.value.data.visibility);

      const updatedField = await wrapRequest(() =>
        $systemField.updateField(customField.value.id, {
          visibility: newVisibility,
        })
      );
   
      loading.value = false;

      if (!updatedField) {
        flash('An error has occurred while changing the visibility state.', FlashType.Danger);
        return;
      }

      customField.value = updatedField;
    };

    return {
      toggleVisibility,
      customField,
      loading,
      formatField,
      value: computed(() =>
        (customField.value as any).value
          ? formatField(customField.value as any as ValueFieldDtoInterface)
          : ''
      ),
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
      isPublic: computed(() => isVisibilityPublic(customField.value)),
    }
  },
})
</script>
