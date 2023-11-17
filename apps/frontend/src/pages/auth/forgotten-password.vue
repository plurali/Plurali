<template>
  <div class="mb-5">
    <Title>Forgotten password</Title>
    <Subtitle>Request a password reset to your Plurali account</Subtitle>
  </div>

  <form class="mb-4 w-full" @submit.prevent="submit">
    <div class="mb-3.5">
      <Label>Your email</Label>
      <input
        :disabled="loading"
        v-model="form.email"
        @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="Your email"
        type="email"
      />
      <InputError v-if="formErrors.email">
        {{ formErrors.email }}
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
import { defineComponent, onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { emailRegex } from '../../utils';
import { formatError } from '../../api';
import Spinner from '../../components/Spinner.vue'
import { flash, FlashType, user } from '../../store';
import { requestPasswordReset } from "../../api/auth";
import { useGoBack } from "../../composables/goBack";
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
    useGoBack('/auth/login');

    const router = useRouter();

    const form = reactive({
      email: '',
    });

    const formErrors = reactive({
      email: null as string|null
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

      return !formErrors.email;
    }

    const submit = async () => {
      if (loading.value) return;
      loading.value = true;

      try {
        const { data } = await requestPasswordReset(form.email);

        if (!data.success) {
          throw new Error(data.error.message);
        }

        flash("If an account matches the provided email, a reset link will be sent shortly.", FlashType.Success, true, false);

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
      submit
    }
  }
})
</script>
