<template>
  <div class="mb-5">
    <Title>Account settings</Title>
    <Subtitle>Settings of your Plurali account</Subtitle>
  </div>

  <form class="mb-4 w-full" @submit.prevent="submit">
    <div class="mb-3.5">
      <Label>Email</Label>
      <input
        v-model.trim="form.email"
        :disabled="loading"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="Email address"
        @keyup="validate"
      />
    </div>

    <div class="mb-3.5">
      <Label>Simply Plural API key</Label>
      <input
        v-model.trim="form.accessToken"
        :disabled="loading"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="Simply Plural API key"
        @keyup="validate"
      />
    </div>

    <div v-if="isAdmin" class="mb-3.5">
      <Label>Override Plural ID</Label>
      <input
        v-model.trim="form.systemIdOverride"
        :disabled="loading"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="Override Plural ID"
        @keyup="validate"
      />
    </div>

    <Button
      :disabled="loading"
      type="submit"
      class="w-full border border-violet-700 text-violet-700 mb-1 inline-flex justify-between items-center"
    >
      <p>Update user settings</p>
      <Spinner v-if="loading" class="!text-violet-700" />
    </Button>

    <Button v-if="isAdmin" type="button" @click="rebuild">Rebuild</Button>
  </form>
</template>

<script lang="ts">
import { $user, UpdateUserRequestInterface, UserRole } from "@plurali/api-client";
import { computed, defineComponent, reactive, ref } from "vue";

import { wrapRequest } from "../../api";
import Button from "../../components/Button.vue";
import Label from "../../components/Label.vue";
import Spinner from "../../components/Spinner.vue";
import Subtitle from "../../components/Subtitle.vue";
import Title from "../../components/Title.vue";
import { useGoBack } from "../../composables/goBack";
import { flash, FlashType, user } from "../../store";
import { emailRegex } from "../../utils";

export default defineComponent({
  components: {
    Spinner,
    Title,
    Subtitle,
    Button,
    Label,
  },
  setup() {
    const form = reactive<UpdateUserRequestInterface>({
      accessToken: "",
      email: user.value?.email ?? "",
      systemIdOverride: user.value?.systemIdOverride ?? "",
    });

    const formErrors = reactive({
      accessToken: null as string | null,
      email: null as string | null,
    });

    const loading = ref(false);

    useGoBack("/dashboard");

    const validate = () => {
      formErrors.email = !form.email || !emailRegex.test(form.email) ? "A valid email must be entered." : null;

      formErrors.accessToken =
        !form.accessToken || form.accessToken.length < 32 ? "Key must be at least 32 characters long." : null;

      return !formErrors.accessToken;
    };

    const submit = async () => {
      if (loading.value) return;
      loading.value = true;

      const ok = await wrapRequest(() => $user.updateUser(form));
      if (ok) {
        flash("Changes saved!", FlashType.Success, true);
      }

      loading.value = false;
    };

    const rebuild = async () => {
      if (loading.value) return;
      loading.value = true;

      const ok = await wrapRequest(() => $user.rebuild());
      if (ok) {
        flash("Done!", FlashType.Success, true);
      }

      loading.value = false;
    };

    return {
      form,
      formErrors,
      loading,
      validate,
      submit,
      rebuild,
      user,
      isAdmin: computed(() => user.value?.role === UserRole.Admin),
    };
  },
});
</script>
