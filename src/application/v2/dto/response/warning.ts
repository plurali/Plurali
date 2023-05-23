export enum ApiWarning {
  CacheDemand = 'cache_demand',
}

export const ApiWarningMessage: Record<ApiWarning, string> = {
  [ApiWarning.CacheDemand]:
    'Due to unexpected higher demand, we were not able to clear cached content, so your changes may not be visible immediately.',
};
