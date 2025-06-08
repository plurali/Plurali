<template>
  <Flash
    :color="isStateSuccess ? FlashType.Success : FlashType.Warning"
    class="flex justify-between items-center gap-4"
  >
    <span v-if="isStateIdle || isStateLoading" :class="isStateLoading && 'opacity-50'">
      Your email is not verified. Please check your inbox or
      <button :disabled="isStateLoading" class="border-b-2 border-white" @click="resendEmail">resend</button> your
      confirmation email.
    </span>
    <span v-if="isStateSuccess"> A new confirmation email was sent. Please check your mailbox. </span>
    <span v-if="isStateError">
      {{ errorMessage ?? "An error has occurred while sending an confirmation email. Please try again later." }}
    </span>
    <Spinner v-if="isStateLoading" />
  </Flash>
</template>

<script setup lang="ts">
import { $user } from "@plurali/api-client";
import { computed, ref } from "vue";

import { FlashType, user } from "../../store";
import Flash from "../Flash.vue";
import Spinner from "../Spinner.vue";

const ResendState = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const state = ref<(typeof ResendState)[keyof typeof ResendState]>(ResendState.IDLE);
const errorMessage = ref<string | null>(null);

const isStateIdle = computed(() => state.value === ResendState.IDLE);
const isStateLoading = computed(() => state.value === ResendState.LOADING);
const isStateSuccess = computed(() => state.value === ResendState.SUCCESS);
const isStateError = computed(() => state.value === ResendState.ERROR);

const resendEmail = async () => {
  if (state.value === ResendState.LOADING || !user.value?.email) {
    return;
  }

  state.value = ResendState.LOADING;

  try {
    const data = await $user.resendVerificationEmail();

    if (data.success) {
      state.value = ResendState.SUCCESS;
      return;
    }

    state.value = ResendState.ERROR;
    errorMessage.value = data.error.message;
  } catch (error) {
    console.log("failed to update user for email resend", { error });
    state.value = ResendState.ERROR;
  }
};
</script>
