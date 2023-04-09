<template>
  <div class="mb-5">
    <Title>Account settings</Title>
    <Subtitle>Settings of your Plurali account</Subtitle>
  </div>

  <form class="mb-4 w-full" @submit.prevent="submit">
    <div class="mb-3.5">
      <Label>Simply Plural API key</Label>
      <input
        :disabled="loading"
        v-model="form.pluralKey"
        @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="Simply Plural API key"
      />
    </div>

    <div class="mb-3.5" v-if="user!.admin">
      <Label>Override Plural ID</Label>
      <input
        :disabled="loading"
        v-model="form.overridePluralId"
        @keyup="validate"
        class="w-full p-2.5 border rounded-xl border-gray-400"
        placeholder="Override Plural ID"
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

    <p class="text-sm text-gray-700 mb-3.5">
      *The "Update user settings" button also works as "clear cache" for now, same as re-authenticating.
    </p>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import Title from '../../components/Title.vue'
import Subtitle from '../../components/Subtitle.vue'
import Button from '../../components/Button.vue'
import Label from '../../components/Label.vue'
import { updateUser } from '../../api/user'
import { flash, FlashType, user } from '../../store'
import Spinner from '../../components/Spinner.vue'
import { wrapRequest } from '../../api'
import { useGoBack } from '../../composables/goBack'

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
      pluralKey: user.value?.pluralKey ?? '',
      overridePluralId: user.value?.overridePluralId ?? '',
    })

    const formErrors = reactive({
      pluralKey: null as string | null,
    })

    const loading = ref(false)

    useGoBack('/dashboard')

    const validate = () => {
      formErrors.pluralKey =
        !form.pluralKey || form.pluralKey.trim().length < 32
          ? 'Key must be at least 32 characters long.'
          : null

      return !formErrors.pluralKey
    }

    const submit = async () => {
      if (loading.value) return
      loading.value = true

      const ok = await wrapRequest(() => updateUser(form))
      if (ok) {
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
    }
  },
})
</script>
