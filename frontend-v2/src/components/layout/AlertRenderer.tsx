import { AlertMap, useAlertState } from '@/store/alert';
import { Alert } from '../ui/elements/Alert';

export const AlertRenderer = () => {
  const [alerts] = useAlertState();

  return alerts.length >= 1 ? (
    <div className="inline-flex flex-col gap-0.5 w-full">
      {alerts.map((alert, i) => (
        <Alert key={i} className={AlertMap[alert.type]}>{alert.message}</Alert>
      ))}
    </div>
  ) : null;
};
