<template>
  <Button
    @click="open = !open"
    class="border-[2.5px] bg-white bg-opacity-25 border-violet-300 text-black inline-flex justify-center items-center gap-1"
  >
    <PhotoIcon class="w-8 h-8" />
    <span>Background</span>
  </Button>
  <Modal
    v-model="open"
    :title="`Background ${backgroundType} for ${(entity as any).username ?? (entity as any).name}`"
    color="bg-violet-100"
    :loading="loading"
    :go-back="hasProperData ? 'Cancel' : undefined"
  >
    <template #icon>
      <Component
        :is="backgroundType === BackgroundType.Image ? 'PhotoIcon' : 'SwatchIcon'"
        class="w-8 h-8 text-violet-600"
      />
    </template>

    <template #header>
      <div class="rounded-2xl bg-gray-100 p-1">
        <Button
          v-for="type of types"
          :key="type"
          @click="() => setType(type)"
          class="text-lg transition duration-500 ease-in-out"
          :class="backgroundType === type && `bg-white shadow-md font-medium`"
        >
          {{ type }}
        </Button>
      </div>
    </template>

    <form @submit.prevent="onSubmit" :enctype="backgroundType !== BackgroundType.Image ? 'multipart/form-data' : ''">
      <Uploader v-if="backgroundType === BackgroundType.Image" v-model="backgroundImage" />
      <Palette v-else v-model="backgroundColor" />
      <Button
        v-if="hasProperData"
        :disabled="loading"
        type="submit"
        class="mt-5 w-full border border-violet-700 hover:bg-violet-700 hover:bg-opacity-10 text-violet-700 mb-1 inline-flex justify-between items-center"
      >
        <p class="font-semibold">Submit</p>
        <Spinner v-if="loading" class="!text-violet-700" />
      </Button>
    </form>
  </Modal>
</template>

<script lang="ts">
import type { HasBackground } from '@domain/common/types';
import { isHex } from '../../utils';
import { PropType, computed, defineComponent, ref } from 'vue';
import { PhotoIcon, SwatchIcon } from '@heroicons/vue/24/outline';
import { wrapRequest } from '../../api';
import { updateMember, updateSystem } from '../../api/system';
import { flash } from '../../store'; 
import Button from '../Button.vue';
import Modal from './Modal.vue';
import Uploader from './Uploader.vue';
import Palette from './Palette.vue';
import Spinner from '../Spinner.vue';
import { updateMemberBackgroundImage, updateSystemBackgroundImage } from '../../api/system';
import { BackgroundType } from '../../../../src/domain/common';
import type { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse';
import type { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';

export default defineComponent({
  props: {
    entity: {
      type: Object as PropType<{ id: string, color: string|null, data: HasBackground }>,
      required: true,
    },
    type: {
      type: String as PropType<'member' | 'system'>,
      required: true,
    },
  },
  components: {
    Button,
    Modal,
    Uploader,
    Palette,
    PhotoIcon,
    SwatchIcon,
    Spinner,
  },
  emits: ['update:entity'],
  setup(props, { emit }) {
    const initialColor = props.entity.data.backgroundColor ?? props.entity.color ?? 'rgb(109, 40, 217)';

    const open = ref(false);

    const loading = ref(false);

    const backgroundType = ref<BackgroundType>(props.entity.data.backgroundType);

    const backgroundImage = ref<Blob | null>(null);

    const backgroundColor = ref<string | null>(initialColor);

    const hasProperData = computed(() => {
      if (backgroundType.value === BackgroundType.Image) return !!backgroundImage.value;
      else return !!backgroundColor.value && backgroundColor.value !== initialColor;
    });

    const setType = (type: BackgroundType) => (backgroundType.value = type);

    const updateColor = async (color: string | null) => {
      if (!color || !isHex(color)) return flash('The specified color needs to be a valid Hex value.');

      const data = { backgroundColor: color };

      const res = await wrapRequest<SystemResponse | SystemMemberResponse>(() =>
        props.type === 'member' ? updateMember(props.entity.id, data) : updateSystem(data)
      );

      if (!res) {
        return flash();
      }

      emit('update:entity', (res as any)[props.type]);
    };

    const updateImage = async (image: Blob | null) => {
      if (!image) return flash("An error occurred with processing your file.");

      const res = await wrapRequest<SystemResponse | SystemMemberResponse>(() =>
        props.type === 'member' ? updateMemberBackgroundImage(props.entity.id, image) : updateSystemBackgroundImage(image)
      );

      if (!res) {
        return flash();
      }

      emit('update:entity', (res as any)[props.type]);
    };

    const onSubmit = async () => {
      if (loading.value) return;
      loading.value = true;

      if (backgroundType.value === BackgroundType.Image && !!backgroundImage.value) {
        await updateImage(backgroundImage.value);
      } else if (!!backgroundColor.value) {
        await updateColor(backgroundColor.value);
      }

      loading.value = false;
      open.value = false;
    };

    return {
      backgroundType,
      backgroundImage,
      backgroundColor,
      types: Object.keys(BackgroundType) as BackgroundType[],
      setType,
      updateColor,
      updateImage,
      open,
      BackgroundType,
      loading,
      onSubmit,
      hasProperData,
    };
  },
});
</script>
