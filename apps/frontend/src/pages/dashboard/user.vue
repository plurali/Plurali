<template>
  <div class="mb-5">
    <Title>Account settings</Title>
    <Subtitle>Settings of your Plurali account</Subtitle>
  </div>

  <form class="mb-4 w-full" @submit.prevent="submit">
    <div class="mb-3.5">
      <Label>Email</Label>
      <input :disabled="loading" v-model="form.email" @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400" placeholder="Email address" />
    </div>

    <div class="mb-3.5">
      <Label>Simply Plural API key</Label>
      <input :disabled="loading" v-model="form.accessToken" @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400" placeholder="Simply Plural API key" />
    </div>

    <div class="mb-3.5" v-if="isAdmin">
      <Label>Override Plural ID</Label>
      <input :disabled="loading" v-model="form.systemIdOverride" @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400" placeholder="Override Plural ID" />
    </div>

    <Button :disabled="loading" type="submit"
      class="w-full border border-violet-700 text-violet-700 mb-1 inline-flex justify-between items-center">
      <p>Update user settings</p>
      <Spinner v-if="loading" class="!text-violet-700" />
    </Button>

    <p class="text-sm text-gray-700 mb-3.5">
      *The "Update user settings" button also works as "clear cache" for now, same as re-authenticating.
    </p>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import Title from '../../components/Title.vue'
import Subtitle from '../../components/Subtitle.vue'
import Button from '../../components/Button.vue'
import Label from '../../components/Label.vue'
import { flash, FlashType, user } from '../../store'
import Spinner from '../../components/Spinner.vue'
import { wrapRequest } from '../../utils/api'
import { useGoBack } from '../../composables/goBack'
import { emailRegex } from '@plurali/common'
import { UserRole } from "@plurali/common";
import { $user } from '@plurali/api-client'

export default defineComponent({
  components: {
    Spinner,
    Title,
    Subtitle,
    Button,
    Label,
  },
  setup() {
    const form = reactive({
      accessToken: user.value?.accessToken ?? '',
      email: user.value?.email ?? '',
      systemIdOverride: user.value?.systemIdOverride ?? '',
    })

    const formErrors = reactive({
      accessToken: null as string | null,
      email: null as string | null,
    })

    const loading = ref(false)

    const isAdmin = computed(() => user.value?.role === UserRole.Admin);

    useGoBack('/dashboard')

    const validate = () => {
      formErrors.email =
        !form.email || !emailRegex.test(form.email)
          ? 'A valid email must be entered.'
          : null

      formErrors.accessToken =
        !form.accessToken || form.accessToken.trim().length < 32
          ? 'Key must be at least 32 characters long.'
          : null

      return !formErrors.accessToken
    }

    const submit = async () => {
      if (loading.value) return
      loading.value = true

      const updatedUser = await wrapRequest(() => $user.updateUser(form))
      if (updatedUser) {
        user.value = updatedUser;
        flash('Changes saved!', FlashType.Success, true)
      }

      loading.value = false
    }

    return {
      form,
      formErrors,
      loading,
      validate,
      submit,
      user,
      isAdmin,
    }
  },
})
</script>
