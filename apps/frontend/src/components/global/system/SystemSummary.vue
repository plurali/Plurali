<template>
  <div class="flex justify-between items-start">
    <div class="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
      <img
        v-if="system.avatar"
        :src="system.avatar"
        :alt="system.name"
        class="flex-shrink-0 w-32 h-32 rounded-full object-cover"
      />
      <Color v-else :color="system.color ?? '#e2e8f0'" class="flex-shrink-0 !w-32 !h-32 opacity-25" />
      <div>
        <p class="text-sm text-gray-700" v-if="isDashboard">SID: {{ system.id }}</p>
        <PageTitle class="inline-flex flex-col sm:flex-row items-center justify-center gap-3">
          {{ system.name }}
          <VisibilityTag
            v-if="isDashboard"
            :disabled="loading"
            :visibility="system.data.visibility"
            @click.prevent="toggleVisibility"
          />
          <a
            v-if="isDashboard && isPublic"
            :href="`/${system.data.slug}`"
            class="text-sm text-gray-700 font-normal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <u>Open public view</u>
          </a>
        </PageTitle>
        <Subtitle class="mb-3" v-if="system.description">
          <Sanitized :value="formatString(system.description, true)"/>
        </Subtitle>
        <span v-if="system.color" class="inline-flex text-gray-700 items-center gap-1">
          Color: {{ system.color }}
          <ColorCircle :color="system.color" />
        </span>
      </div>
    </div>

    <div v-if="isDashboard" class="flex items-center gap-2">
      <BackgroundChooser v-model:entity="system" type="system" />
      <ButtonLink
        :to="{ name: 'dashboard:system:page:create', params: $route.params }"
        class="border-[2.5px] bg-white bg-opacity-25 border-violet-300 text-black inline-flex justify-center items-center gap-1"
      >
        <DocumentIcon class="w-8 h-8 -ml-1" />
        <span>New Page</span>
      </ButtonLink>
    </div>
  </div>

  <Editor
    v-if="isDashboard"
    :id="`${system.id}_customDescription`"
    :initial-value="system.data.description"
    :placeholder="`Add custom description for ${system.name}...`"
    @save="updateCustomDescription"
  />
  <UserContent class="mb-5 p-6" v-else-if="system.data.description">
    <Sanitized :value="system.data.description" />
  </UserContent>

  <Fetchable :result="fields">
    <CustomFields :fields="fields" :modifiable="isDashboard" />
  </Fetchable>
</template>
<script lang="ts">
import PageTitle from '../../Title.vue';
import Color from '../color/ColorCircle.vue';
import Subtitle from '../../Subtitle.vue';
import ColorCircle from '../color/ColorCircle.vue';
import { computed, defineComponent, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import VisibilityTag from '../visibility/VisibilityTag.vue';
import CustomFields from '../fields/CustomFields.vue';
import UserContent from '../UserContent.vue';
import Sanitized from '../Sanitized.vue';
import Editor from '../../dashboard/Editor.vue';
import BackgroundChooser from '../BackgroundChooser.vue';
import Fetchable from '../Fetchable.vue';
import ButtonLink from '../../ButtonLink.vue';
import { DocumentIcon } from '@heroicons/vue/24/outline';
import { $system, FieldDtoInterface, SystemDtoInterface } from '@plurali/api-client';
import { wrapRequest } from '../../../utils/api';
import { formatString, isVisibilityPublic, toggleVisibilityState } from '@plurali/common';
import { flash, FlashType } from '../../../store';
import { TinyEditorType } from '@plurali/editor';

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
    Fetchable,
    ButtonLink,
    DocumentIcon
},
  props: {
    entity: {
      type: Object as PropType<SystemDtoInterface>,
      required: true,
    },
    fields: {
      type: [Array, () => null, () => false] as PropType<FieldDtoInterface[] | null | false>
    }
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
      if (loading.value || !system.value) return;
      loading.value = true;

      const newVisibility = toggleVisibilityState(system.value.data.visibility);

      const updatedSystem = await wrapRequest(() =>
        $system.updateSystem({
          visibility: newVisibility,
        })
      );
   
      loading.value = false;

      if (!updatedSystem) {
        flash('An error has occurred while changing the visibility state.', FlashType.Danger);
        return;
      }

      system.value = updatedSystem;
    };

    const updateCustomDescription = async (editor: TinyEditorType) => {
      if (loading.value) return;
      loading.value = true;

      const updatedSystem = await wrapRequest(() => {
        if (!system.value) return null;

        editor.readonly = true;
        let customDescription: string | null = editor.getContent({ format: 'html' });

        if (editor.getContent({ format: 'text' }).trim().length < 1) {
          customDescription = null;
        }

        return $system.updateSystem({
          description: customDescription,
        });
      });

      loading.value = false;

      if (!updatedSystem) {
        flash('An error has occurred while updating the description.', FlashType.Danger);
        return;
      }

      system.value = updatedSystem;
    };

    return {
      toggleVisibility,
      updateCustomDescription,
      loading,
      system,
      formatString,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
      isPublic: computed(() => system.value && isVisibilityPublic(system.value)),
    };
  },
});
</script>
