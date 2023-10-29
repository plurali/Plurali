import { Ref, WatchSource, watch } from 'vue';
import { background } from '../store';
import { onBeforeRouteLeave } from 'vue-router';
import { BackgroundDataInterface, BackgroundType, cdnUrl } from '@plurali/api-client';

export interface HasBackground {
  data: {
    background: BackgroundDataInterface;
    assetsUpdatedAt: string;
  }
};

export type HasBackgroundWithColor = HasBackground & { color?: string | null };

export const getBackgroundImageUrl = ({ data: { background: backgroundData, assetsUpdatedAt } }: HasBackground): string | null => {
  if (!backgroundData.image) return null;

  // TODO: image proxy
  if (backgroundData.image.startsWith('http')) return backgroundData.image;

  return `${cdnUrl}/${backgroundData.image}?v=${Math.floor(
    new Date(assetsUpdatedAt).getTime() / 1000
  )}`;
};

export const withBackground = (
  obj: WatchSource<HasBackgroundWithColor | null | false> | Ref<HasBackgroundWithColor | null | false>
) => {
  const reset = () => (background.value = null);

  const stop = watch(
    obj,
    val => {
      if (!val) return reset();

      switch (val?.data.background.type) {
        case BackgroundType.Image:
          background.value = getBackgroundImageUrl(val) ?? val.data.background.color ?? val.color ?? null;
          break;
        case BackgroundType.Color:
        default:
          background.value = val?.data?.background.color ?? val.color ?? getBackgroundImageUrl(val) ?? null;
          break;
      }
    },
    { immediate: true }
  );

  onBeforeRouteLeave(() => {
    stop();
    reset();
  });

  return reset;
};
