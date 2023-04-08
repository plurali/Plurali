<template>
  <div class="mb-5">
    <Title>Plurali</Title>
    <Subtitle
      >Informative page about your system and it's members you can share with people!</Subtitle
    >
  </div>

  <div class="inline-flex items-center gap-2">
    <ButtonLink to="/dashboard" class="text-white bg-violet-700"> Dashboard </ButtonLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Title from '../components/Title.vue'
import Subtitle from '../components/Subtitle.vue'
import ButtonLink from '../components/ButtonLink.vue'

export default defineComponent({
  components: {
    Title,
    Subtitle,
    ButtonLink,
  },
})
</script>
