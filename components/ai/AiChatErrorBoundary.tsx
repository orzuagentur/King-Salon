"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type AiChatErrorBoundaryProps = {
  children: ReactNode;
};

type AiChatErrorBoundaryState = {
  hasError: boolean;
};

export class AiChatErrorBoundary extends Component<
  AiChatErrorBoundaryProps,
  AiChatErrorBoundaryState
> {
  state: AiChatErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AiChatErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AI chat render failed", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
          <p className="text-sm font-semibold text-foreground">Chat vorübergehend nicht verfügbar</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Bitte laden Sie die Seite neu. Wenn das Problem bleibt, kontaktieren Sie uns direkt.
          </p>
          <button
            className="mt-6 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-foreground transition hover:border-gold hover:text-gold"
            onClick={() => window.location.reload()}
            type="button"
          >
            Neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
