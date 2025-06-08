<template>
  <div class="mb-5">
    <Title>Plurali</Title>
    <Subtitle>Informative page about your system and it's members you can share with people!</Subtitle>
  </div>

  <div class="inline-flex items-center gap-2">
    <ButtonLink to="/dashboard/user" class="bg-violet-700 text-white">User settings</ButtonLink>

    <ButtonLink to="/dashboard/system" class="bg-violet-700 text-white">System</ButtonLink>

    <Button class="border border-violet-700 text-violet-700" @click.prevent="logout">Logout</Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import { setAuth } from "../../api";
import Button from "../../components/Button.vue";
import ButtonLink from "../../components/ButtonLink.vue";
import Subtitle from "../../components/Subtitle.vue";
import Title from "../../components/Title.vue";
import { useGoBack } from "../../composables/goBack";

export default defineComponent({
  components: {
    Title,
    Subtitle,
    ButtonLink,
    Button,
  },
  setup() {
    const router = useRouter();

    useGoBack(null);

    const logout = async () => {
      setAuth(null);
      await router.push("/auth/login");
    };

    return { logout };
  },
});
</script>
