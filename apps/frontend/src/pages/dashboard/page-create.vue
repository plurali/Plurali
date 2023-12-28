<template>
  <div class="flex items-center gap-2 my-5">
    <h1 class="text-2xl font-medium">Create new {{ isMember ? 'member' : 'system' }} content page</h1>
    <VisibilityTag :visible="visible" @click="visible = !visible" />
  </div>
  <input :disabled="loading" type="text" class="w-full p-6 py-3 border rounded-xl border-gray-400 mb-5" v-model="name"
    placeholder="Enter page name..." />

  <UserContent>
    <Editor id="page--content" :placeholder="`Enter page content...`" initial-value="" @save="createPage" />
  </UserContent>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Title from '../../components/Title.vue';
import Subtitle from '../../components/Subtitle.vue';
import ButtonLink from '../../components/ButtonLink.vue';
import Button from '../../components/Button.vue';
import Spinner from '../../components/Spinner.vue';
import { wrapRequest } from '../../api';
import { createMemberPage, createSystemPage } from '../../api/page';
import Color from '../../components/global/color/ColorCircle.vue';
import { useGoBack } from '../../composables/goBack';
import Fetchable from '../../components/global/Fetchable.vue';
import CustomFields from '../../components/global/fields/CustomFields.vue';
import ColorCircle from '../../components/global/color/ColorCircle.vue';
import { getRouteParam } from '../../utils';
import MemberSummary from '../../components/global/members/MemberSummary.vue';
import UserContent from '../../components/global/UserContent.vue';
import Editor from '../../components/dashboard/Editor.vue';
import VisibilityTag from '../../components/global/visibility/VisibilityTag.vue';
import { TinyEditorType } from '@plurali/editor';
import { $memberPage, $systemPage } from '@plurali/api-client';
import { parseVisibility } from '@plurali/common';

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
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const name = ref('');
    const visible = ref(false);

    const loading = ref(false);

    const isMember = computed(() => String(route.name).includes('dashboard:member'));

    const memberId = computed(() => getRouteParam(route.params.memberId));

    const parentRoute = computed(() => (isMember.value ? `/dashboard/member/${memberId.value}` : `/dashboard/system`));

    useGoBack(parentRoute.value);

    const createPage = async (editor: TinyEditorType) => {
      if (loading.value) return;
      loading.value = true;

      editor.readonly = true;
      let content: string = editor.getContent({ format: 'html' });

      const data = {
        name: name.value,
        content,
        visibility: parseVisibility(visible.value),
      };

      const page = await wrapRequest(() =>
        isMember.value
          ? $memberPage.createMemberPage(memberId.value ?? '', data)
          : $systemPage.createSystemPage(data)
        );

      if (page) {
        router.push(`${parentRoute.value}/page-edit/${page.id}`);
      }

      loading.value = false;
    };

    return {
      createPage,
      name,
      loading,
      visible,
      isMember,
    };
  },
});
</script>
