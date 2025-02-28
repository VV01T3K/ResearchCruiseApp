import React from 'react';

export type AppAlert = {
  id: number;
  title: string;
  message: React.ReactNode;
  variant: 'success' | 'danger';
};

export type AppContextType = {
  alert?: AppAlert;

  showAlert: (alert: Omit<AppAlert, 'id'>) => void;
  hideAlert: (id: number) => void;
};

export const AppContext = React.createContext<AppContextType | undefined>(undefined);
