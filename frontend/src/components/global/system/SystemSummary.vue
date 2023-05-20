<template>
  <div class="flex justify-between items-start">
    <div class="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
      <img
        v-if="system.avatar"
        :src="system.avatar"
        :alt="system.username"
        class="flex-shrink-0 w-32 h-32 rounded-full object-cover"
      />
      <Color v-else :color="system.color ?? '#e2e8f0'" class="flex-shrink-0 w-32 h-32 opacity-25" />
      <div>
        <p class="text-sm text-gray-700" v-if="isDashboard">SID: {{ system.id }}</p>
        <PageTitle class="inline-flex flex-col sm:flex-row items-center justify-center gap-3">
          {{ system.username }}
          <VisibilityTag
            v-if="isDashboard"
            :disabled="loading"
            :visible="system.data.visible"
            @click.prevent="toggleVisibility"
          />
          <a
            v-if="isDashboard && system.data.visible"
            :href="`/${system.data.slug}`"
            class="text-sm text-gray-700 font-normal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <u>Open public view</u>
          </a>
        </PageTitle>
        <Subtitle class="mb-3">{{ system.description ?? 'No description' }}</Subtitle>
        <span v-if="system.color" class="inline-flex text-gray-700 items-center gap-1">
          Color: {{ system.color }}
          <ColorCircle :color="system.color" />
        </span>
      </div>
    </div>

    <div v-if="isDashboard">
      <BackgroundChooser v-model:entity="system" type="system" />
    </div>
  </div>

  <CustomFields :fields="system.fields" :modifiable="isDashboard" />

  <Editor
    v-if="isDashboard"
    :id="`${system.id}_customDescription`"
    :initial-value="system.data.customDescription"
    :placeholder="`Add custom description for ${system.username}...`"
    @save="updateCustomDescription"
  />
  <UserContent class="mb-5" v-else-if="system.data.customDescription">
    <Sanitized :value="system.data.customDescription" />
  </UserContent>
</template>
<script lang="ts">
import PageTitle from '../../Title.vue';
import Color from '../color/ColorCircle.vue';
import Subtitle from '../../Subtitle.vue';
import ColorCircle from '../color/ColorCircle.vue';
import { computed, defineComponent, PropType, ref } from 'vue';
import type {SystemDto} from "@app/v1/dto/user/system/SystemDto";
import { useRoute } from 'vue-router';
import VisibilityTag from '../visibility/VisibilityTag.vue';
import { wrapRequest } from '../../../api';
import { updateSystem } from '../../../api/system';
import { Editor as EditorType } from 'tinymce';
import CustomFields from '../fields/CustomFields.vue';
import UserContent from '../UserContent.vue';
import Sanitized from '../Sanitized.vue';
import Editor from '../../dashboard/Editor.vue';
import BackgroundChooser from '../BackgroundChooser.vue';

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
    BackgroundChooser,
  },
  props: {
    entity: {
      type: Object as PropType<SystemDto>,
      required: true,
    },
  },
  emits: ['update:entity'],
  setup(props, { emit }) {
    const route = useRoute();

    const loading = ref(false);

    const system = computed({
      get() {
        return props.entity;
      },
      set(v) {
        emit('update:entity', v);
      },
    });

    const toggleVisibility = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() =>
        updateSystem({
          visible: !system.value.data.visible,
        })
      );

      // fail??? refresh
      if (!res) return (window.location.href = '');

      system.value = res.system;
      loading.value = false;
    };

    const updateCustomDescription = async (editor: EditorType) => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!system.value) return null;

        editor.readonly = true;
        let customDescription: string | null = editor.getContent({ format: 'html' });

        if (editor.getContent({ format: 'text' }).trim().length < 1) {
          customDescription = null;
        }

        return updateSystem({
          customDescription,
        });
      });

      if (res) {
        system.value = res.system;
      }

      loading.value = false;
    };

    return {
      toggleVisibility,
      updateCustomDescription,
      loading,
      system,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
    };
  },
});
</script>
