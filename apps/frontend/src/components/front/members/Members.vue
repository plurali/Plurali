<template>
  <Fetchable :result="members" retry-text="Load members" :retry="fetchMembers">
    <div v-if="members" class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
      <MemberSmallCard v-for="member of members" :member="member" />
    </div>

    <nav v-if="pagination" class="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 gap-4" aria-label="Pagination">
    <div>
      <p class="text-sm text-gray-700">
        Page <b>{{ pagination.current }}</b> out of <b>{{ pagination.total }}</b>
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end gap-2">
      <button v-if="pagination.current !== 1" @click="onPrevious" class="relative inline-flex items-center rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Previous</button>
      <input
        type="number"
        :min="1"
        :max="pagination.total"
        v-model="paginationInput"
        @keyup.enter="onPaginationInput"
        class="w-24 pl-6 pr-4 py-1.5 border rounded-xl border-gray-400 text-center"
        placeholder=".."
      />
      <button v-if="pagination.current < pagination.total" @click="onNext" class="relative inline-flex items-center rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Next</button>
    </div>
  </nav>
  </Fetchable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto'
import { flash, FlashType } from '../../../store'
import { formatError } from '../../../api'
import { getMembers } from '../../../api/public'
import Fetchable from '../../global/Fetchable.vue'
import Color from '../../global/color/ColorCircle.vue'
import MemberSmallCard from '../../global/members/MemberSmallCard.vue'
import { getRouteParam } from '../../../utils'
import { useRoute } from 'vue-router'
import { PaginationData } from "@app/v1/dto/Status";

export default defineComponent({
  components: { MemberSmallCard, Color, Fetchable },
  setup() {
    const members = ref<UserMemberDto[] | null | false>(false);
    const pagination = ref<PaginationData|null>(null);
    const paginationInput = ref<number>(pagination?.value?.current ?? 1);

    const route = useRoute()

    const fetchMembers = async (page = 1) => {
      if (members.value === null) return
      members.value = null
      try {
        const res = (await getMembers(getRouteParam(route.params.systemId), page)).data
        if (!res.success) throw new Error(res.error)

        members.value = res.data.members;
        pagination.value = res.pagination;
        paginationInput.value = pagination.value.current;
      } catch (e) {
        members.value = false;
        pagination.value = null;
        flash(formatError(e), FlashType.Danger, true)
      }
    }

    const onPrevious = async () => {
      if (!pagination.value) return;
      const newPage = pagination.value.current-1;
      await fetchMembers(newPage < 1 ? 1 : newPage);
    }

    const onNext = async () => {
      if (!pagination.value) return;
      const newPage = pagination.value.current+1;
      await fetchMembers(newPage > pagination.value.total ? pagination.value.total : newPage);
    }

    const onPaginationInput = async () => {
      await fetchMembers(paginationInput.value);
    }

    onMounted(() => fetchMembers())

    return {
      members,
      fetchMembers,
      pagination,
      paginationInput,
      onNext,
      onPrevious,
      onPaginationInput,
    }
  },
})
</script>
