import { $topbar } from '@plurali/common';
import { $api, ApiResponse } from "@plurali/api-client";
import { clearFlashes, flash, FlashType } from '../store';

export const wrapRequest = async <T extends object = {}>(
  fn: () => Promise<ApiResponse<T>> | null
): Promise<T | false> => {
  clearFlashes();

  const promise = fn();
  if (!promise) return false;

  try {
    const res = await $topbar.promised(promise);

    if (!res.success) {
      return false;
    }

    return res.data;
  } catch (e) {
    flash($api.handleException(e).error.message, FlashType.Danger, true);
    return false;
  }
};
