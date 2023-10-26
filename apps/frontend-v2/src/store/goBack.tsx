import { useEffect, useState } from 'react';
import { createContainer } from 'react-tracked';

export const { Provider: GoBackStateProvider, useTracked: useGoBackState } = createContainer(() =>
  useState<string | null>(null),
);

export const useGoBack = (goBack: string | null) => {
  const [, setGoBack] = useGoBackState();

  useEffect(() => {
    setGoBack(goBack);

    return () => setGoBack(null);
  }, []);
};
