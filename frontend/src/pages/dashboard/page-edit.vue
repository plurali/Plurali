<template>
  <Fetchable :result="page" :retry="fetchPage">
    <div v-if="page">
      <div class="flex items-center gap-2 my-5">
        <h1 class="text-2xl font-medium">Edit {{ isMember ? 'member' : 'system' }} content page</h1>
        <VisibilityTag :visible="page.visible" @click="toggleVisibility" />
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
import { useRoute } from 'vue-router';
import Title from '../../components/Title.vue';
import Subtitle from '../../components/Subtitle.vue';
import ButtonLink from '../../components/ButtonLink.vue';
import Button from '../../components/Button.vue';
import Spinner from '../../components/Spinner.vue';
import { wrapRequest } from '../../api';
import { getSystemPage, getMemberPage, updateMemberPage, updateSystemPage } from '../../api/page';
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
import type { PageResponse } from '@app/v2/dto/page/response/PageResponse';
import type { Editor as EditorType } from 'tinymce';
import VisibilityTag from '../../components/global/visibility/VisibilityTag.vue';

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
    VisibilityTag
},
  setup() {
    const page = ref<PageDto | null | false>(false);

    const route = useRoute();

    const name = ref("");

    const loading = ref(false);

    const isMember = computed(() => String(route.name).includes('dashboard:member'));

    const memberId = computed(() => (isMember.value ?  getRouteParam(route.params.id) : null));

    const parentRoute = computed(() => (isMember.value ? `/dashboard/member/${memberId.value}` : `/dashboard/system`));

    const pageId = computed(() => getRouteParam(route.params.pageId));

    useGoBack(parentRoute.value);

    const fetchPage = async () => {
      if (page.value === null) return;
      page.value = null;

      const res = await wrapRequest<PageResponse>(() =>
        memberId.value ? getMemberPage(memberId.value, pageId.value) : getSystemPage(pageId.value)
      );
      page.value = res ? res.page : res;
      if (page.value) {
        name.value = page.value.name;
      }
    };

    const toggleVisibility = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest<PageResponse>(() => {
        if (!page.value) return null;

        const data = {
          visible: !page.value.visible,
        };

        return isMember.value
          ? updateMemberPage(memberId.value, pageId.value, data)
          : updateSystemPage(pageId.value, data);
      });

      if (res && page.value) {
        page.value.visible = res.page.visible;
      }

      loading.value = false;
    }

    const updatePage = async (editor: EditorType) => {
      if (loading.value) return;
      loading.value = true;

      const res = await wrapRequest<PageResponse>(() => {
        if (!page.value) return null;

        editor.readonly = true;
        let content: string = editor.getContent({ format: 'html' });

        const data = {
          name: name.value,
          content,
          visible: page.value.visible,
        };

        return isMember.value
          ? updateMemberPage(memberId.value, pageId.value, data)
          : updateSystemPage(pageId.value, data);
      });

      if (res) {
        page.value = res.page;
      }

      editor.readonly = false;

      loading.value = false;
    };

    onMounted(() => fetchPage());

    return {
      fetchPage,
      updatePage,
      page,
      name,
      loading,
      isMember,
      toggleVisibility,
    };
  },
});
</script>
