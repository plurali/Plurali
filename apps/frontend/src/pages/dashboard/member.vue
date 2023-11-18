<template>
  <Fetchable :result="data.member" :retry="fetchAll">
    <div v-if="data.member && data.system">
      <div class="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
        <div class="flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
          <img
            v-if="data.member.avatar"
            :src="data.member.avatar"
            :alt="data.member.name"
            class="flex-shrink-0 w-32 h-32 rounded-full object-cover"
          />
          <Color v-else :color="data.member.color ?? '#e2e8f0'" class="flex-shrink-0 w-32 h-32 opacity-25" />
          <div>
            <p class="text-sm text-gray-700">SID: {{ data.member.id }}</p>
            <PageTitle class="text-violet-700 inline-flex items-center justify-center gap-3">
              {{ data.member.name }}
              <span class="inline-flex items-center justify-center gap-3">
                <VisibilityTag
                  v-if="isDashboard"
                  :disabled="loading"
                  :visible="data.member.data.visible"
                  @click.prevent="toggleVisibility"
                />
                <a
                  v-if="isDashboard && data.member.data.visible"
                  :href="`/${data.system.data.slug}/m/${data.member.data.slug}`"
                  class="text-sm text-gray-700 font-normal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <u>Open public view</u>
                </a>
              </span>
            </PageTitle>
            <Subtitle class="mb-3" v-if="data.member.description">
              <Sanitized :value="string(data.member.description, true)" />
            </Subtitle>
            <span v-if="data.member.color" class="inline-flex text-gray-700 items-center gap-1">
              Color: {{ data.member.color }}
              <ColorCircle :color="data.member.color" />
            </span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-2">
          <BackgroundChooser v-model:entity="data.member" type="member" />
        </div>
      </div>

      <Editor
        :id="`${data.member.id}_customDescription`"
        :initial-value="data.member.data.customDescription"
        :placeholder="`Add custom description for ${data.member.name}...`"
        @save="updateCustomDescription"
      />

      <CustomFields
        :fields="data.member.fields"
        :modifiable="true"
        :hide-no-values="true"
        title="System-wide Custom Fields"
      />

      <Fetchable :result="data.pages" :retry="fetchAll">
        <PageFields v-if="data.pages" :pages="data.pages" :modifiable="true" />
      </Fetchable>
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Editor as EditorType } from 'tinymce';
import type { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { getRouteParam } from '../../utils';
import { wrapRequest } from '../../api';
import { getMember, getSystem, updateMember } from '../../api/system';
import { getMemberPages } from '../../api/page';
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
import type { PageDto } from '@app/v2/dto/page/PageDto';
import type { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';
import PageFields from '../../components/global/page/PageFields.vue';
import { DocumentIcon } from '@heroicons/vue/24/outline';
import { string } from '../../api/fields';

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
      system: false as SystemDto | null | false,
      member: false as UserMemberDto | null | false,
      pages: false as PageDto[] | null | false,
    });

    const route = useRoute();

    const loading = ref(false);

    useGoBack('/dashboard/system');

    const fetchAll = async () => {
      if (data.system === null || data.member === null || data.pages === null) return;
      data.system = data.member = null;

      let sys = await wrapRequest(getSystem);
      data.system = sys ? sys.system : sys;

      if (data.system) {
        let mem = await wrapRequest(() => getMember(getRouteParam(route.params.id)));
        data.member = mem ? mem.member : mem;

        if (data.member) {
          const id = data.member.id; // stupid ts
          const res = await wrapRequest<PagesResponse>(() => getMemberPages(id));
          data.pages = res ? res.pages : res;
        }
      }
    };

    withBackground(() => data.member);

    const toggleVisibility = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() =>
        data.member
          ? updateMember(data.member.id, {
              visible: !data.member.data.visible,
            })
          : null
      );

      data.member = res ? res.member : res;
      loading.value = false;
    };

    const updateCustomDescription = async (editor: EditorType) => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!data.member) return null;

        editor.readonly = true;
        let customDescription: string | null = editor.getContent({ format: 'html' });

        if (editor.getContent({ format: 'text' }).trim().length < 1) {
          customDescription = null;
        }

        return updateMember(data.member.id, {
          customDescription,
        });
      });

      data.member = res ? res.member : res;
      loading.value = false;
    };

    onMounted(() => fetchAll());

    // const onChooserCompleted = (res: SystemMemberData) => {
    //   if (res) {
    //     data.member = res.member;
    //   }
    // }

    return {
      fetchAll,
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
