import { onBeforeUnmount, onMounted } from "vue";

import { goBack } from "../store";

export const useGoBack = (value?: string | null) => {
  const _prev = goBack.value;

  if (value !== undefined) {
    onMounted(() => (goBack.value = value));
    onBeforeUnmount(() => (goBack.value = _prev));
  }

  return goBack;
};
