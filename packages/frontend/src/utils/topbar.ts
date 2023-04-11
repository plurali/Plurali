import topbar from 'topbar'

const bar = topbar;

export const $topbar = {
  ...bar,
  /**
   * Promised Topbar
   *
   * This is useful for eg. data fetching,
   * when this function is called, the topbar appears and
   * hides upon resolving of the promise passed in the "promise" parameter.
   *
   * @param {Promise<any>} promise Promise to toggle Topbar upon
   */
  promised<TPromise extends Promise<unknown> = Promise<unknown>>(promise: TPromise): TPromise {
    bar.show();
    promise.finally(() => bar.hide())
    return promise
  },
}
