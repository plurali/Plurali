import { useAlertState } from '@/store/alert';

export const AlertRenderer = () => {
  const [alerts] = useAlertState();

  return alerts.length >= 1 ? (
    <div className="inline-flex flex-col gap-0.5 w-full">
      {alerts.map((alert, i) => (
        <div key={i}>{alert.message}</div>
      ))}
    </div>
  ) : null;
};
