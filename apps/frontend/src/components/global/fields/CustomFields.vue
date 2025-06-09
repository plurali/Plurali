<template>
  <div v-if="computedFields.length >= 1" class="mb-5">
    <div class="inline-flex items-center gap-1 mb-3">
      <IdentificationIcon class="w-7 h-7 -ml-1" />
      <p class="inline-flex items-center gap-1">{{ title ?? "Custom Fields" }} ({{ computedFields.length }}):</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <CustomField v-for="field of computedFields" :key="field.id" :field="field" :modifiable="modifiable" />
    </div>
  </div>
</template>
<script lang="ts">
import type { UserFieldDto } from "@app/v1/dto/user/field/UserFieldDto";
import type { UserValueFieldDto } from "@app/v1/dto/user/field/UserValueFieldDto";
import { IdentificationIcon } from "@heroicons/vue/24/outline";
import { computed, defineComponent, PropType, ref } from "vue";

import CustomField from "./CustomField.vue";

export default defineComponent({
  components: {
    CustomField,
    IdentificationIcon,
  },
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
      default: "",
    },
    hideNoValues: {
      type: Boolean,
      default: () => false,
    },
  },
  setup({ fields: _fields, hideNoValues }) {
    const customFields = ref<(UserFieldDto | UserValueFieldDto)[] | null | false>(_fields);

    return {
      customFields,
      computedFields: computed(() =>
        customFields.value
          ? customFields.value.filter((field) => {
              return hideNoValues ? (field as UserValueFieldDto).value?.length >= 1 : true;
            })
          : [],
      ),
    };
  },
});
</script>
