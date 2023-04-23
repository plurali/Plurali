<template>
  <div class="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
    <img
      v-if="currentSystem.avatar"
      :src="currentSystem.avatar"
      :alt="currentSystem.username"
      class="flex-shrink-0 w-32 h-32 rounded-full object-cover"
    />
    <Color v-else :color="currentSystem.color ?? '#e2e8f0'" class="flex-shrink-0 w-32 h-32 opacity-25" />
    <div>
      <p class="text-sm text-gray-700" v-if="isDashboard">SID: {{ currentSystem.id }}</p>
      <PageTitle class="inline-flex flex-col sm:flex-row items-center justify-center gap-3">
        {{ currentSystem.username }}
        <VisibilityTag
          v-if="isDashboard"
          :disabled="loading"
          :visible="currentSystem.data.visible"
          @click.prevent="toggleVisibility"
        />
        <a
          v-if="isDashboard && currentSystem.data.visible"
          :href="`/${currentSystem.data.slug}`"
          class="text-sm text-gray-700 font-normal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <u>Open public view</u>
        </a>
      </PageTitle>
      <Subtitle class="mb-3">{{ currentSystem.description ?? 'No description' }}</Subtitle>
      <span v-if="currentSystem.color" class="inline-flex text-gray-700 items-center gap-1">
        Color: {{ currentSystem.color }}
        <ColorCircle :color="currentSystem.color" />
      </span>
    </div>
  </div>

  <CustomFields :fields="currentSystem.fields" :modifiable="isDashboard" />

  <Editor
    v-if="isDashboard"
    :id="`${currentSystem.id}-customDescription`"
    :initial-value="currentSystem.data.customDescription"
    :placeholder="`Add custom description for ${currentSystem.username}...`"
    @save="updateCustomDescription"
  />
  <UserContent class="mb-5" v-else-if="currentSystem.data.customDescription">
    <Sanitized :value="currentSystem.data.customDescription" />
  </UserContent> 
</template>
<script lang="ts">
import PageTitle from '../../Title.vue';
import Color from '../color/ColorCircle.vue';
import Subtitle from '../../Subtitle.vue';
import ColorCircle from '../color/ColorCircle.vue';
import { computed, defineComponent, PropType, ref } from 'vue';
import { System } from '@plurali/common/src/system';
import { useRoute } from 'vue-router';
import VisibilityTag from '../visibility/VisibilityTag.vue';
import { wrapRequest } from '../../../api';
import { updateSystem } from '../../../api/system';
import { Editor as EditorType } from 'tinymce';
import CustomFields from '../fields/CustomFields.vue';
import UserContent from '../UserContent.vue';
import Sanitized from '../Sanitized.vue';
import Editor from '../../dashboard/Editor.vue';

export default defineComponent({
  components: {
    VisibilityTag,
    PageTitle,
    Color,
    Subtitle,
    ColorCircle,
    CustomFields,
    Editor,
    UserContent,
    Sanitized,
  },
  props: {
    system: {
      type: Object as PropType<System>,
      required: true,
    },
  },
  setup({ system: _system }) {
    const route = useRoute();

    const loading = ref(false);

    const currentSystem = ref(_system);

    const toggleVisibility = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() =>
        updateSystem(currentSystem.value.id, {
          visible: !currentSystem.value.data.visible,
        })
      );

      // fail??? refresh
      if (!res) return (window.location.href = '');

      currentSystem.value = res.system;
      loading.value = false;
    };

    const updateCustomDescription = async (editor: EditorType) => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!currentSystem.value) return null;

        editor.readonly = true;
        let customDescription: string | null = editor.getContent({ format: 'html' });

        if (editor.getContent({ format: 'text' }).trim().length < 1) {
          customDescription = null;
        }

        return updateSystem(currentSystem.value.id, {
          customDescription,
        });
      });

      if (res) {
        currentSystem.value = res.system;
      }

      loading.value = false;
    };

    return {
      currentSystem,
      toggleVisibility,
      updateCustomDescription,
      loading,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
    };
  },
});
</script>
