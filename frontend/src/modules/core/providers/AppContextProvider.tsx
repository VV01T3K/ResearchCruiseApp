import React from 'react';

import { AppAlert, AppContext, AppContextType } from '@/core/contexts/AppContext';

type Props = {
  children: React.ReactNode;
};
export function AppContextProvider({ children }: Props) {
  const [alerts, setAlerts] = React.useState<AppAlert[]>([]);

  function getLatestAlert(source: AppAlert[]): AppAlert | undefined {
    return source.reduce((prev: AppAlert | undefined, curr) => {
      if (!prev || prev.id < curr.id) {
        return curr;
      }
      return prev;
    }, undefined);
  }

  const context: AppContextType = {
    alert: getLatestAlert(alerts),
    showAlert: (alert) => {
      setAlerts((prev) => [...prev, { ...alert, id: (getLatestAlert(prev)?.id ?? -1) + 1 }]);
    },
    hideAlert: (id) => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    },
  };

  return <AppContext value={context}>{children}</AppContext>;
}
