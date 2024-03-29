<template>
  <div class="mb-5">
    <Title>Register</Title>
    <Subtitle>Create a new Plurali account</Subtitle>
  </div>

  <form class="mb-4 w-full" @submit.prevent="submit">
    <div class="mb-3.5">
      <Label>Your username</Label>
      <input
        :disabled="loading"
        v-model="form.username"
        @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="Your username"
      />
      <InputError v-if="formErrors.username">
        {{ formErrors.username }}
      </InputError>
    </div>

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

    <div class="mb-3.5">
      <Label>Your password</Label>
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
      <p>Register</p>
      <Spinner v-if="loading" class="!text-violet-700" />
    </Button>

    <div class="inline-flex w-full justify-end items-center">
      <router-link to="/auth/login" class="text-gray-500">Already registered?</router-link>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Title from '../../components/Title.vue'
import Subtitle from '../../components/Subtitle.vue'
import Button from '../../components/Button.vue'
import Label from '../../components/Label.vue'
import { register } from '../../api/auth'
import InputError from '../../components/InputError.vue'
import Spinner from '../../components/Spinner.vue'
import { setAuth, wrapRequest } from '../../api'
import {emailRegex} from "../../utils"

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
    const router = useRouter()

    const form = reactive({
      username: '',
      email: '',
      password: '',
    })

    const formErrors = reactive({
      username: null as string|null,
      email: null as string|null,
      password: null as string|null,
    })

    const loading = ref(false)

    const validate = () => {
      formErrors.username =
        !form.username || form.username.trim().length < 3
          ? 'Username must be at least 3 characters long.'
          : null

      formErrors.email =
        !form.email || !emailRegex.test(form.email)
          ? 'A valid email must be entered.'
          : null

      formErrors.password =
        !form.password || form.password.trim().length < 4
          ? 'Password must be at least 4 characters long.'
          : null

      return !formErrors.username && !formErrors.password && !formErrors.email;
    }

    const submit = async () => {
      if (loading.value) return
      loading.value = true

      const ok = await wrapRequest(() => register(form))
      loading.value = false

      if (ok) {
        setAuth(ok.auth);
        await router.push('/dashboard')
      }
    }

    return {
      form,
      formErrors,
      loading,
      validate,
      submit,
    }
  },
})
</script>
