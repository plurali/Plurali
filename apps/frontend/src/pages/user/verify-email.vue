<template>
  <p v-if="error">{{ error }}</p>
  <div v-else class="inline-flex justify-center items-center w-full py-8">
    <Spinner class="!text-violet-700" />
  </div>
</template>

<script lang="ts">
import { $user } from "@plurali/api-client";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { flash, FlashType, goBack } from "../../store";
import { getRouteParam } from "../../utils";

export default defineComponent({
  setup() {
    const router = useRouter();

    const error = ref<string | null>(null);

    const code = computed(() => getRouteParam(router.currentRoute.value.params.code));

    onMounted(async () => {
      const response = await $user.verifyEmail({ code: code.value });

      if (!response.success) {
        error.value = response.error.message || "An unknown error occurred while verifying your email address.";
        goBack.value = "/dashboard";
        return;
      }

      flash("Your email address was verified successfully.", FlashType.Success, true, false);
      router.push("/dashboard");
    });

    return {
      error,
    };
  },
});
</script>
