import XCircleIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import ClockIcon from 'bootstrap-icons/icons/clock.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';

type Props = {
  expirationDate: Date;
  onRefresh?: () => void | Promise<void>;
};

type TimerState = {
  timeRemaining: string;
  isWarning: boolean;
};

type TimerAction = { type: 'EXPIRED' } | { type: 'UPDATE'; minutes: number; seconds: number };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'EXPIRED':
      return { timeRemaining: 'Twoja sesja wygasła', isWarning: true };
    case 'UPDATE':
      return {
        timeRemaining: `Twoja sesja wygaśnie za: ${action.minutes}:${action.seconds.toString().padStart(2, '0')}s`,
        isWarning: action.minutes < 5,
      };
    default:
      return state;
  }
}

export function SessionTimer({ expirationDate, onRefresh }: Props) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);
  const [state, dispatch] = React.useReducer(timerReducer, {
    timeRemaining: '',
    isWarning: false,
  });

  const updateTimer = React.useCallback(() => {
    const now = new Date();
    const expiryTime = expirationDate instanceof Date ? expirationDate.getTime() : new Date(expirationDate).getTime();
    const diff = expiryTime - now.getTime();

    if (diff <= 0) {
      dispatch({ type: 'EXPIRED' });
      return;
    }

    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dispatch({ type: 'UPDATE', minutes, seconds });
  }, [expirationDate]);

  React.useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [updateTimer]);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium ${
        state.isWarning ? 'bg-red-100 text-red-700' : 'bg-opacity-20 bg-white text-blue-600'
      }`}
    >
      <div title="Czas wygaśnięcia sesji" className="flex items-center gap-2">
        <ClockIcon className="h-4 w-4" />
        <span>{state.timeRemaining}</span>
      </div>
      {onRefresh && (
        <div title="Odśwież licznik sesji" className="flex items-center">
          <AppButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="plain"
            className="ml-1 p-0 opacity-70 transition-opacity hover:opacity-100"
          >
            <XCircleIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </AppButton>
        </div>
      )}
    </div>
  );
}
