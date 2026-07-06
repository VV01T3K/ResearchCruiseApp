import React from 'react';

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

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Console fallback: onCaughtError on createRoot replaces React's default
    // logging, so without this nothing is logged when Sentry is disabled.
    console.error('ErrorBoundary caught:', error, info.componentStack);
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
