import {  WatchSource, watch } from 'vue';
import { background } from '../store';
import { Background, BackgroundData, WithBackground } from '@plurali/common/src/data';
import { onBeforeRouteLeave } from 'vue-router';

export const parseBackground = (data: BackgroundData): string | null => {
  if (!data.backgroundImage) return null;
  if (data.backgroundImage.startsWith("http")) return data.backgroundImage;
  

  return `https://cdn.plurali.icu/v1/${data.backgroundImage}?ltas=${Math.floor(new Date(data.lastTimeAssetChanged).getTime() / 1000)}`;
}

export const withBackground = <T extends WithBackground = WithBackground>(obj: WatchSource<T | null | false>) => {
  const reset = () => (background.value = null);

  const stop = watch(
    obj,
    val => {
      if (!val) return reset();

      switch (val?.data?.backgroundType) {
        case Background.Image:
          background.value = parseBackground(val.data) ?? val.data.backgroundColor ?? val.color ?? null;
          break;
        case Background.Color:
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
