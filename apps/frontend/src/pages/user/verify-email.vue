<template>
  <div v-if="!error" class="inline-flex justify-center items-center w-full py-8">
    <Spinner class="!text-violet-700" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { formatError } from "../../api";
import { verifyUserEmail } from "../../api/user";
import { flash, FlashType } from "../../store";
import { getRouteParam } from "../../utils";

export default defineComponent({
  setup() {
    const router = useRouter();

    const error = ref<string | null>(null);

    const code = computed(() => getRouteParam(router.currentRoute.value.params.code));

    onMounted(async () => {
      try {
        await verifyUserEmail({ code: code.value });

        flash("Your email address was verified successfully.", FlashType.Success, true, false);
      } catch (e) {
        flash(formatError(e), FlashType.Danger, true, false);
      }

      router.push("/dashboard");
    });

    return {
      error,
    };
  },
});
</script>
