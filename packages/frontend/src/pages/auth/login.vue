<template>
  <div class="mb-5">
    <Title>Login</Title>
    <Subtitle>Login to your Plurali account</Subtitle>
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
      <p>Login</p>
      <Spinner v-if="loading" class="!text-violet-700" />
    </Button>

    <div class="inline-flex w-full justify-end items-center">
      <router-link to="/auth/register" class="text-gray-500"
        >Don't have an account yet?</router-link
      >
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
import { login } from '../../api/auth'
import InputError from '../../components/InputError.vue'
import Spinner from '../../components/Spinner.vue'
import { wrapRequest } from '../../api'

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
      password: '',
    })

    const formErrors = reactive({
      username: null as string | null,
      password: null as string | null,
    })

    const loading = ref(false)

    const validate = () => {
      formErrors.username =
        !form.username || form.username.trim().length < 3
          ? 'Username must be at least 3 characters long.'
          : null

      formErrors.password =
        !form.password || form.password.trim().length < 4
          ? 'Password must be at least 4 characters long.'
          : null

      return !formErrors.username && !formErrors.password
    }

    const submit = async () => {
      if (loading.value) return
      loading.value = true

      const ok = await wrapRequest(() => login(form))
      loading.value = false

      if (ok) {
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
