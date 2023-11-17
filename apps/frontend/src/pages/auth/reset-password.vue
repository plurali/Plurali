<template>
  <div class="mb-5">
    <Title>Forgotten password</Title>
    <Subtitle>Reset your Plurali account password</Subtitle>
  </div>

  <form class="mb-4 w-full" @submit.prevent="submit">
    <div class="mb-3.5">
      <Label>Your email</Label>
      <input
        :disabled="loading || isEmailDisabled"
        v-model="form.email"
        @keyup="validate"
        :class="['w-full p-2.5 border rounded-xl border-gray-400', isEmailDisabled && 'opacity-50']"
        placeholder="Your email"
        type="email"
      />
      <InputError v-if="formErrors.email">
        {{ formErrors.email }}
      </InputError>
    </div>

    <div class="mb-3.5">
      <Label>Your new password</Label>
      <input
        :disabled="loading"
        v-model="form.password"
        @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="*************"
        type="password"
      />
      <InputError v-if="formErrors.password">
        {{ formErrors.password }}
      </InputError>
    </div>

    <Button
      :disabled="loading"
      type="submit"
      class="w-full border border-violet-700 text-violet-700 mb-3.5 inline-flex justify-between items-center"
    >
      <p>Submit</p>
      <Spinner v-if="loading" class="!text-violet-700" />
    </Button>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { emailRegex, getRouteParam } from '../../utils';
import { formatError } from '../../api';
import Spinner from '../../components/Spinner.vue';
import { flash, FlashType, user } from '../../store';
import { processPasswordReset } from "../../api/auth";
import InputError from "../../components/InputError.vue";
import Label from "../../components/Label.vue";
import Button from "../../components/Button.vue";
import Title from "../../components/Title.vue";
import Subtitle from "../../components/Subtitle.vue";

export default defineComponent({
  components: {
    Spinner,
    InputError,
    Title,
    Subtitle,
    Button,
    Label,
  },
  setup() {
    const router = useRouter();

    const routeEmail = computed(() => getRouteParam(router.currentRoute.value.query.email));
    const isEmailDisabled = computed(() => !!routeEmail.value && emailRegex.test(routeEmail.value));

    const code = computed(() => getRouteParam(router.currentRoute.value.params.code));

    const form = reactive({
      email: !isEmailDisabled.value ? '' : routeEmail,
      password: '',
    });

    const formErrors = reactive({
      email: null as string|null,
      password: null as string|null,
    });

    const loading = ref<boolean>(false);

    onMounted(() => {
      if (user.value) {
       return router.push("/dashboard");
      }
    })

    const validate = () => {
      formErrors.email =
        !form.email || !emailRegex.test(form.email)
          ? 'A valid email must be entered.'
          : null;

      formErrors.password =
        !form.password || form.password.trim().length < 4
          ? 'Password must be at least 4 characters long.'
          : null;

      return !formErrors.email && !formErrors.password;
    }

    const submit = async () => {
      if (loading.value) return;
      loading.value = true;

      try {
        const { data } = await processPasswordReset({
          email: form.email,
          password: form.password,
          code: code.value,
        });

        if (!data.success) {
          throw new Error(data.error.message);
        }

        flash("Your password was reset successfully.", FlashType.Success, true, false);

        return router.push("/auth/login");
      } catch (e) {
        flash(formatError(e), FlashType.Danger, true, false);
      }

      loading.value = false;
    };

    return {
      form,
      formErrors,
      loading,
      validate,
      submit,
      isEmailDisabled,
    }
  }
})
</script>
