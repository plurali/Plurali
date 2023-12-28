<template>
  <div v-if="data.member">
      <div
        class="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left sm:justify-between items-center gap-4">
        <div class="flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
          <img v-if="data.member.avatar" :src="data.member.avatar" :alt="data.member.name"
            class="flex-shrink-0 w-32 h-32 rounded-full object-cover" />
          <Color v-else :color="data.member.color ?? '#e2e8f0'" class="flex-shrink-0 w-32 h-32 opacity-25" />
          <div>
            <p v-if="isDashboard" class="text-sm text-gray-700">ID: {{ data.member.id }}</p>
            <PageTitle class="text-violet-700 inline-flex flex-col sm:flex-row items-center justify-center gap-3">
              {{ data.member.name }}
              <span v-if="isDashboard" class="inline-flex flex-col sm:flex-row sm:items-center justify-center gap-3">
                <VisibilityTag :disabled="loading" :visible="data.member.data.visible"
                  @click.prevent="toggleVisibility" />
                <a v-if="data.member.data.visible && data.system"
                  :href="`/${data.system.data.slug}/m/${data.member.data.slug}`" class="text-sm text-gray-700 font-normal"
                  target="_blank" rel="noopener noreferrer">
                  <u>Open public view</u>
                </a>
              </span>
            </PageTitle>
            <Subtitle class="mb-3" v-if="data.member.description">
              <Sanitized :value="string(data.member.description, true)" />
            </Subtitle>

            <div class="inline-flex flex-col md:flex-row justify-left md:justify-between md:items-center gap-2 text-gray-700">
              <span v-if="data.member.pronouns">
              {{ data.member.pronouns }}
              </span>
              <span class="hidden md:inline">&ndash;</span>
              <span v-if="data.member.color" class="inline-flex items-center gap-1">
                <ColorCircle :color="data.member.color" /> {{ data.member.color }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="isDashboard" class="flex flex-col sm:flex-row items-center gap-2">

          <BackgroundChooser v-model:entity="data.member" type="member" />
        </div>
      </div>

      <Editor v-if="isDashboard" :id="`${data.member.id}_customDescription`" :initial-value="data.member.data.customDescription"
        :placeholder="`Add custom description for ${data.member.name}...`" @save="updateCustomDescription" />

      <UserContent v-else-if="data.member.data.customDescription" class="mb-5 p-6">
        <Sanitized :value="data.member.data.customDescription" />
      </UserContent>

      <CustomFields :fields="data.member.fields" :modifiable="isDashboard" :hide-no-values="!isDashboard" title="Custom Fields" />

      <Fetchable :result="data.pages" :retry="refetch">
        <PageFields v-if="data.pages" :pages="data.pages" :modifiable="isDashboard" owner-type="member" :member-id="data.member.data.slug!" />
      </Fetchable>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { useRoute } from 'vue-router';
import { string } from '../../../api/fields';
import { PageDto } from '@app/v1/dto/page/PageDto';
import { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import { updateMember } from '../../../api/system';
import { wrapRequest } from '../../../api';
import { TinyEditorType } from '@plurali/editor';
import PageTitle from '../../Title.vue';
import Subtitle from '../../Subtitle.vue';
import ButtonLink from '../../ButtonLink.vue';
import Button from '../../Button.vue';
import Color from '../color/ColorCircle.vue';
import Fetchable from '../Fetchable.vue';
import CustomFields from '../fields/CustomFields.vue';
import ColorCircle from '../color/ColorCircle.vue';
import VisibilityTag from '../visibility/VisibilityTag.vue';
import Editor from '../../dashboard/Editor.vue';
import BackgroundChooser from '../BackgroundChooser.vue';
import PageFields from '../page/PageFields.vue';
import { DocumentIcon } from '@heroicons/vue/24/outline';
import Sanitized from '../Sanitized.vue';
import UserContent from '../UserContent.vue';

export default defineComponent({
  components: {
    VisibilityTag,
    ColorCircle,
    CustomFields,
    Fetchable,
    PageTitle,
    Subtitle,
    ButtonLink,
    Button,
    Color,
    Editor,
    BackgroundChooser,
    PageFields,
    DocumentIcon,
    Sanitized,
    UserContent
},
  props: {
    modelValue: {
      type: Object as PropType<{
        system: SystemDto | null | false,
        member: UserMemberDto | null | false,
        pages: PageDto[] | null | false,
      }>,
      required: true,
    },
    refetch: {
      type: Function,
      required: false,
    }
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const route = useRoute();

    const loading = ref(false);

    const data = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    });

    const toggleVisibility = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() =>
        data.value.member
          ? updateMember(data.value.member.id, {
            visible: !data.value.member.data.visible,
          })
          : null
      );

      data.value.member = res ? res.member : res;
      loading.value = false;
    };

    const updateCustomDescription = async (editor: TinyEditorType) => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!data.value.member) return null;

        editor.readonly = true;
        let customDescription: string | null = editor.getContent({ format: 'html' });

        if (editor.getContent({ format: 'text' }).trim().length < 1) {
          customDescription = null;
        }

        return updateMember(data.value.member.id, {
          customDescription,
        });
      });

      data.value.member = res ? res.member : res;
      loading.value = false;
    };

    return {
      data,
      loading,
      toggleVisibility,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
      updateCustomDescription,
      string,
    };
  },
});
</script>
