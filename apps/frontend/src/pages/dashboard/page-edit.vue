<template>
  <Fetchable :result="page" :retry="fetchPage">
    <div v-if="page">
      <div class="flex items-center gap-2 my-5">
        <h1 class="text-2xl font-medium">Edit {{ isMember ? 'member' : 'system' }} content page</h1>
        <VisibilityTag :visible="page.visibility === Visibility.Public" @click="toggleVisibility" />
        <Button
          @click="deletePage"
          class="border-[2.5px] bg-white bg-opacity-25 border-violet-300 text-black inline-flex justify-center items-center gap-1 ml-4"
        >
          <TrashIcon class="w-5 h-5" />
        </Button>
      </div>
      <input
        :disabled="loading"
        type="text"
        class="w-full p-2.5 border rounded-xl border-gray-400 mb-5"
        v-model="name"
        placeholder="Enter page name..."
      />
      <UserContent>
        <Editor
          :id="`${page.id}_content`"
          :initial-value="page.content"
          :placeholder="`Enter page content...`"
          @save="updatePage"
          :force-save="page.name !== name"
        />
      </UserContent>
    </div>
  </Fetchable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Title from '../../components/Title.vue';
import Subtitle from '../../components/Subtitle.vue';
import ButtonLink from '../../components/ButtonLink.vue';
import Button from '../../components/Button.vue';
import Spinner from '../../components/Spinner.vue';
import { wrapRequest } from '../../api';
import Color from '../../components/global/color/ColorCircle.vue';
import { useGoBack } from '../../composables/goBack';
import Fetchable from '../../components/global/Fetchable.vue';
import CustomFields from '../../components/global/fields/CustomFields.vue';
import ColorCircle from '../../components/global/color/ColorCircle.vue';
import { getRouteParam } from '../../utils';
import MemberSummary from '../../components/global/members/MemberSummary.vue';
import UserContent from '../../components/global/UserContent.vue';
import Editor from '../../components/dashboard/Editor.vue';
import type { PageDto } from '@app/v2/dto/page/PageDto';
import VisibilityTag from '../../components/global/visibility/VisibilityTag.vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { OkResponse } from '@app/v1/dto/OkResponse';
import { toggleVisibilityState } from '@plurali/common';
import { $memberPage, $systemPage, Visibility } from '@plurali/api-client';
import { TinyEditorType } from '@plurali/editor';

export default defineComponent({
  components: {
    MemberSummary,
    ColorCircle,
    CustomFields,
    Fetchable,
    Spinner,
    Title,
    Subtitle,
    ButtonLink,
    Button,
    Color,
    UserContent,
    Editor,
    VisibilityTag,
    TrashIcon,
  },
  setup() {
    const page = ref<PageDto | null | false>(false);

    const router = useRouter();

    const route = useRoute();

    const name = ref('');

    const loading = ref(false);

    const isMember = computed(() => String(route.name).includes('dashboard:member'));

    const memberId = computed(() => getRouteParam(route.params.memberId));

    const parentRoute = computed(() => (isMember.value ? `/dashboard/member/${memberId.value}` : `/dashboard/system`));

    const pageId = computed(() => getRouteParam(route.params.pageId));

    useGoBack(parentRoute.value);

    const fetchPage = async () => {
      if (page.value === null) return;
      page.value = null;

      page.value = await wrapRequest(() =>
        isMember.value ? $memberPage.getMemberPage(memberId.value, pageId.value) : $systemPage.getSystemPage(pageId.value)
      );

      if (page.value) {
        name.value = page.value.name;
      }
    };

    const toggleVisibility = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!page.value) return null;

        const data = {
          visibility: toggleVisibilityState(page.value.visibility),
        };

        return isMember.value
          ? $memberPage.updateMemberPage(memberId.value, pageId.value, data)
          : $systemPage.updateSystemPage(pageId.value, data);
      });

      if (res && page.value) {
        page.value.visibility = res.visibility;
      }

      loading.value = false;
    };

    const updatePage = async (editor: TinyEditorType) => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest(() => {
        if (!page.value) return null;

        editor.readonly = true;
        let content: string = editor.getContent({ format: 'html' });

        const data = {
          name: name.value,
          content,
        };

        return isMember.value
          ? $memberPage.updateMemberPage(memberId.value, pageId.value, data)
          : $systemPage.updateSystemPage(pageId.value, data);
      });

      if (res) {
        page.value = res;
      }

      editor.readonly = false;

      loading.value = false;
    };

    const deletePage = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest<OkResponse>(() => isMember.value
          ? $memberPage.deleteMemberPage(memberId.value, pageId.value)
          : $systemPage.deleteSystemPage(pageId.value));

      if (res) {
        router.push(parentRoute.value);
      }

      loading.value = false;
    };

    onMounted(() => fetchPage());

    return {
      fetchPage,
      updatePage,
      deletePage,
      page,
      name,
      loading,
      isMember,
      toggleVisibility,
      Visibility
    };
  },
});
</script>
