import * as Sentry from '@sentry/react';
import React from 'react';

import { isSentryEnabled } from '@/lib/sentry';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (isSentryEnabled()) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex h-screen items-center justify-center">
            <p>Wystąpił nieoczekiwany błąd. Odśwież stronę.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
