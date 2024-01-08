<template>
  <div class="flex my-4 items-center justify-start md:justify-end">
    <input v-model="search" class="p-2.5 border rounded-xl border-gray-400" placeholder="Search for a member..." />
  </div>
  
  <Fetchable :result="members" retry-text="Load members" :retry="fetchMembers">
    <div v-if="members" class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
      <MemberSmallCard v-for="member of members" :member="member" :modifiable="true" />
    </div>
  </Fetchable>

  <nav v-if="pagination"
    class="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 gap-4"
    aria-label="Pagination">
    <div>
      <p class="text-sm text-gray-700">
        Page <b>{{ pagination.current }}</b> out of <b>{{ pagination.total }}</b>
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end gap-2">
      <button v-if="pagination.current !== 1" @click="onPrevious"
        class="relative inline-flex items-center rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Previous</button>
      <input type="number" :min="1" :max="pagination.total" v-model="paginationInput" @keyup.enter="onPaginationInput"
        class="w-24 pl-6 pr-4 py-1.5 border rounded-xl border-gray-400 text-center" placeholder=".." />
      <button v-if="pagination.current < pagination.total" @click="onNext"
        class="relative inline-flex items-center rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Next</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto'
import { flash, FlashType } from '../../../store'
import { formatError } from '../../../api'
import { getMembers } from '../../../api/system'
import Fetchable from '../../../components/global/Fetchable.vue'
import Color from '../../../components/global/color/ColorCircle.vue'
import MemberSmallCard from '../../../components/global/members/MemberSmallCard.vue'
import { PaginationData } from '@app/v1/dto/Status'
import {debounce} from "../../../composables/debounce";

export default defineComponent({
  components: { MemberSmallCard, Color, Fetchable },
  setup() {
    const members = ref<UserMemberDto[] | null | false>(false);
    const search = ref<string>("");

    const pagination = ref<PaginationData | null>(null);
    const paginationInput = ref<number>(pagination?.value?.current ?? 1);

    const fetchMembers = async (page = 1, search?: string) => {
      if (members.value === null) return
      members.value = null
      try {
        const res = (await getMembers(page, search)).data
        if (!res.success) throw new Error(res.error)

        members.value = res.data.members;
        pagination.value = res.pagination;
        paginationInput.value = res.pagination.current;
      } catch (e) {
        members.value = false;
        pagination.value = null;
        flash(formatError(e), FlashType.Danger, true)
      }
    }

    const onSearch = debounce(async () => {
      await fetchMembers(1, search.value);
    }, 500);

    onMounted(() => fetchMembers());

    const stopSearchWatch = watch(search, () => onSearch());

    onBeforeUnmount(() => stopSearchWatch());

    const onPrevious = async () => {
      if (!pagination.value) return;
      const newPage = pagination.value.current - 1;
      await fetchMembers(newPage < 1 ? 1 : newPage);
    }

    const onNext = async () => {
      if (!pagination.value) return;
      const newPage = pagination.value.current + 1;
      await fetchMembers(newPage > pagination.value.total ? pagination.value.total : newPage);
    }

    const onPaginationInput = async () => {
      await fetchMembers(paginationInput.value);
    }

    return {
      members,
      fetchMembers,
      pagination,
      paginationInput,
      onPrevious,
      onNext,
      onPaginationInput,
      search,
      onSearch
    }
  },
})
</script>
