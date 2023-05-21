import { useState } from 'react';
import { createContainer } from 'react-tracked';

export const { Provider: GoBackStateProvider, useTracked: useGoBackState } = createContainer(() =>
  useState<string | null>(null)
);
