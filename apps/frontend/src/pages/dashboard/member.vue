<template>
  <Fetchable :result="data.member" :retry="fetchAll">
    <div v-if="data.member && data.system">
      <div class="mb-5 flex justify-between items-start">
        <div class="flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
          <img v-if="data.member.avatar" :src="data.member.avatar" :alt="data.member.name"
            class="flex-shrink-0 w-32 h-32 rounded-full object-cover" />
          <Color v-else :color="data.member.color ?? '#e2e8f0'" class="flex-shrink-0 w-32 h-32 opacity-25" />
          <div>
            <p class="text-sm text-gray-700">SID: {{ data.member.id }}</p>
            <PageTitle class="text-violet-700 inline-flex items-center justify-center gap-3">
              {{ data.member.name }}
              <span class="inline-flex items-center justify-center gap-3">
                <VisibilityTag v-if="isDashboard" :disabled="loading" :visibility="data.member.data.visibility"
                  @click.prevent="toggleVisibility" />
                <a v-if="isDashboard && data.member.data.visibility"
                  :href="`/${data.system.data.slug}/m/${data.member.data.slug}`" class="text-sm text-gray-700 font-normal"
                  target="_blank" rel="noopener noreferrer">
                  <u>Open public view</u>
                </a>
              </span>
            </PageTitle>
            <Subtitle class="mb-3" v-if="data.member.description">
              <Sanitized :value="formatString(data.member.description, true)" />
            </Subtitle>
            <span v-if="data.member.color" class="inline-flex text-gray-700 items-center gap-1">
              Color: {{ data.member.color }}
              <ColorCircle :color="data.member.color" />
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <BackgroundChooser v-model:entity="data.member" type="member" />
          <ButtonLink :to="{ name: 'dashboard:member:page:create', params: $route.params }"
            class="border-[2.5px] bg-white bg-opacity-25 border-violet-300 text-black inline-flex justify-center items-center gap-1">
            <DocumentIcon class="w-8 h-8 -ml-1" />
            <span>New Page</span>
          </ButtonLink>
        </div>
      </div>

      <Editor :id="`${data.member.id}_customDescription`" :initial-value="data.member.data.description"
        :placeholder="`Add custom description for ${data.member.name}...`" @save="updateCustomDescription" />

      <CustomFields :fields="data.fields" :modifiable="true" :hide-no-values="true"
        title="System-wide Custom Fields" />

      <Fetchable :result="data.pages" :retry="fetchAll">
        <PageFields v-if="data.pages" :pages="data.pages" :modifiable="true" />
      </Fetchable>
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getRouteParam, toggleVisibilityState, isVisibilityPublic } from '@plurali/common';
import { TinyEditorType } from '@plurali/editor';
import { wrapRequest } from '../../utils/api';
import { useGoBack } from '../../composables/goBack';
import { withBackground } from '../../composables/background';
import PageTitle from '../../components/Title.vue';
import Subtitle from '../../components/Subtitle.vue';
import ButtonLink from '../../components/ButtonLink.vue';
import Button from '../../components/Button.vue';
import Color from '../../components/global/color/ColorCircle.vue';
import Fetchable from '../../components/global/Fetchable.vue';
import CustomFields from '../../components/global/fields/CustomFields.vue';
import ColorCircle from '../../components/global/color/ColorCircle.vue';
import VisibilityTag from '../../components/global/visibility/VisibilityTag.vue';
import Editor from '../../components/dashboard/Editor.vue';
import BackgroundChooser from '../../components/global/BackgroundChooser.vue';
import PageFields from '../../components/global/page/PageFields.vue';
import { DocumentIcon } from '@heroicons/vue/24/outline';
import { $member, $memberField, $memberPage, $system, FieldDtoInterface, MemberDtoInterface, PageDtoInterface, SystemDtoInterface } from '@plurali/api-client';
import { FlashType, flash } from '../../store';
import { formatString } from '@plurali/common';

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
  },
  setup() {
    // TODO
    const data = reactive({
      system: false as SystemDtoInterface | null | false,
      member: false as MemberDtoInterface | null | false,
      fields: false as FieldDtoInterface[] | null | false,
      pages: false as PageDtoInterface[] | null | false,
    });

    const route = useRoute();

    const loading = ref(false);

    const memberId = computed(() => getRouteParam(route.params.id));

    useGoBack('/dashboard/system');

    const fetchAll = async () => {
      if (data.system === null || data.member === null || data.pages === null) return;
      data.system = data.member = null;

      let system = await wrapRequest(() => $system.getSystem());
      data.system = system;

      if (data.system) {
        let member = await wrapRequest(() => $member.getMember(memberId.value));
        data.member = member;

        if (data.member) {
          wrapRequest(() => $memberField.getFields(memberId.value)).then((fields) => (data.fields = fields));
          wrapRequest(() => $memberPage.getMemberPages(memberId.value)).then((pages) => (data.pages = pages));
        }
      }
    };

    withBackground(() => data.member);

    const toggleVisibility = async () => {
      if (loading.value || !data.member) return;
      loading.value = true;

      const newVisibility = toggleVisibilityState(data.member.data.visibility);

      const updatedMember = await wrapRequest(() => $member.updateMember(memberId.value, {
        visibility: newVisibility,
      }));

      loading.value = false;

      if (!updatedMember) {
        flash("An error has occured while changing visibility state.", FlashType.Danger);
        return;
      }

      data.member = updatedMember;
    };

    const updateCustomDescription = async (editor: TinyEditorType) => {
      if (loading.value) return;
      loading.value = true;

      const updatedMember = await wrapRequest(() => {
        if (!data.member) return null;

        editor.readonly = true;
        let description: string | null = editor.getContent({ format: 'html' });

        if (editor.getContent({ format: 'text' }).trim().length < 1) {
          description = null;
        }

        return $member.updateMember(data.member.pluralId, {
          description,
        });
      });

      loading.value = false;

      if (!updatedMember) {
        flash("An error has occurred while updating the description.", FlashType.Danger);
        return;
      }

      data.member = updatedMember;
    };

    onMounted(() => fetchAll());

    return {
      fetchAll,
      data,
      loading,
      toggleVisibility,
      isDashboard: computed(() => route.path.startsWith('/dashboard')),
      isPublic: computed(() => data.member && isVisibilityPublic(data.member)),
      updateCustomDescription,
      formatString,
    };
  },
});
</script>
