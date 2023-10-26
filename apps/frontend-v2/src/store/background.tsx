import { useState } from 'react';
import { createContainer } from 'react-tracked';

export const { Provider: BackgroundStateProvider, useTracked: useBackgroundState } = createContainer(() =>
  useState<string | null>(null)
);
