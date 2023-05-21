import topbar from 'topbar';

const bar = topbar;

bar.config({
  barColors: {
    '0.3': '#c084fc',
    '0.5': '#af74e8',
    '0.75': '#9e64d4',
    '0.95': '#8d54c0',
    '1': '#7c45ad',
  },
});

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
    promise.finally(() => bar.hide());
    return promise;
  },
};
