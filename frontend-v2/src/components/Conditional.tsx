import { ReactNode } from 'react';
import { UseQueryResult } from 'react-query';
import { Loader } from './ui/elements/Loader';

export interface ConditionalProps<T, E> {
  query: UseQueryResult<T, E>;
  render: (data: T) => ReactNode;
  renderError?: (error: E) => ReactNode;
  renderLoad?: () => ReactNode;
}

export const DefaultLoader = () => (
  <div className="w-full flex justify-center items-center">
    <Loader className="w-10 h-10" />
  </div>
);

export const Conditional = <T, E>({ query, render, renderError, renderLoad = DefaultLoader }: ConditionalProps<T, E>) => {
  if (query.isError) {
    // TODO. default error
    return <>{renderError?.(query.error) ?? null}</>;
  }

  if (!query.isLoading && query.isSuccess) {
    return <>{render(query.data) ?? null}</>;
  }

  return <>{renderLoad?.() ?? null}</>; // TODO: default load
};
