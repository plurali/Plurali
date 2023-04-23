import { Ref, WatchSource, onBeforeUnmount, ref, watch } from 'vue';
import { background } from '../store';
import { Background, WithBackground } from '@plurali/common/src/data';
import { onBeforeRouteLeave } from 'vue-router';

export const parseBackground = (url: string | null): string | null => url ? url.startsWith("http")? url : `https://cdn.plurali.icu/v1/${url}` : null;

export const withBackground = <T extends WithBackground = WithBackground>(obj: WatchSource<T | null | false>) => {
  const reset = () => (background.value = null);

  const stop = watch(
    obj,
    val => {
      if (!val) return reset();

      switch (val?.data?.backgroundType) {
        case Background.Image:
          background.value = parseBackground(val.data.backgroundImage) ?? val.data.backgroundColor ?? val.color ?? null;
          break;
        case Background.Color:
        default:
          background.value = val?.data?.backgroundColor ?? val.color ?? parseBackground(val?.data?.backgroundImage) ?? null;
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
