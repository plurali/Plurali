import { useState } from 'react';
import { createContainer } from 'react-tracked';

export enum AlertType {
  Danger = 'danger',
  Warning = 'warning',
  Success = 'success',
  Info = 'info',
}

export const AlertMap = {
  [AlertType.Danger]: 'bg-red-700 text-white',
  [AlertType.Warning]: 'bg-yellow-600 text-white',
  [AlertType.Success]: 'bg-green-700 text-white',
  [AlertType.Info]: 'bg-blue-700 text-white',
};

export interface Alert {
  type: AlertType;
  message: string;
  removeOnNextRedirect: boolean;
}

export const { Provider: AlertStateProvider, useTracked: useAlertState } = createContainer(() => useState<Alert[]>([]));
