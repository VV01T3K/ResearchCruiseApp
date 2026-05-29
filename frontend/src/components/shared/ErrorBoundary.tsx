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

  componentDidCatch() {
    // HyperDX patches this method and calls the original after reporting.
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
