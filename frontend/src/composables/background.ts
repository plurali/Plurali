import { WatchSource, watch } from 'vue';
import { background } from '../store';
import { HasBackground } from '@domain/common/types';
import { onBeforeRouteLeave } from 'vue-router';
import { BackgroundType } from '@prisma/client';

export interface Assetable {
  lastTimeAssetChanged: Date;
}

export const parseBackground = (data: HasBackground & Assetable): string | null => {
  if (!data.backgroundImage) return null;
  if (data.backgroundImage.startsWith('http')) return data.backgroundImage;

  return `https://cdn.plurali.icu/v1/${data.backgroundImage}?ltas=${Math.floor(
    new Date(data.lastTimeAssetChanged).getTime() / 1000
  )}`;
};

export const withBackground = <
  T extends { color: string | null; data: HasBackground & Assetable } = {
    color: string | null;
    data: HasBackground & Assetable;
  }
>(
  obj: WatchSource<T | null | false>
) => {
  const reset = () => (background.value = null);

  const stop = watch(
    obj,
    val => {
      if (!val) return reset();

      switch (val?.data?.backgroundType) {
        case BackgroundType.Image:
          background.value = parseBackground(val.data) ?? val.data.backgroundColor ?? val.color ?? null;
          break;
        case BackgroundType.Color:
        default:
          background.value = val?.data?.backgroundColor ?? val.color ?? parseBackground(val?.data) ?? null;
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
