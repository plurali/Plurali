import { ReactNode } from "react";
import { UseQueryResult } from "react-query";

export interface ConditionalProps<T, E> {
    query: UseQueryResult<T, E>,
    render: (data: T) => ReactNode;
    renderError?: (error: E) => ReactNode;
    renderLoad?: () => ReactNode;
}

export const Conditional = <T, E>({ query, render, renderError, renderLoad }: ConditionalProps<T, E>) => {
    if (query.isError) {
        // TODO. default error
        return (
            <>
                {renderError?.(query.error) ?? null}
            </>
        );
    }

    if (!query.isLoading && query.isSuccess) {
        return (
            <>
                {render(query.data) ?? null}
            </>
        )
    }

    return <>
        {renderLoad?.() ?? null}
    </>; // TODO: default load
}
