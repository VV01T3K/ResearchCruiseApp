import * as Sentry from '@sentry/react';
import type { RegisteredRouter } from '@tanstack/react-router';

import config from '@/config';
import { closeFeedback } from '@/integrations/sentry/feedback';
import { createFormBreadcrumb, parseSampleRate, scrubSensitiveUrls } from '@/integrations/sentry/utils';
import type { UserResponse } from '@/api/generated/schemas';

type FieldMeta = { errors: Array<unknown> };

function hasSensitiveUrl(url: string): boolean {
  return scrubSensitiveUrls(url) !== url;
}

export function initializeSentry(router: RegisteredRouter): void {
  if (!config.sentryDsn) return;
  // Replay snapshots record the page URL without an SDK hook to filter it, so token pages are never recorded.
  const recordReplay = !hasSensitiveUrl(window.location.href);

  Sentry.init({
    dsn: config.sentryDsn,
    // Sentry calls this option `tunnel`: events go to our own nginx proxy instead of the DSN host.
    tunnel: config.sentryProxy || undefined,
    environment: config.environment,
    release: `research-cruise-app-frontend@${config.version}`,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      ...(recordReplay
        ? [
            Sentry.replayIntegration({
              maskAllText: false,
              maskAllInputs: false,
              blockAllMedia: false,
              beforeAddRecordingEvent: scrubSensitiveUrls,
            }),
          ]
        : []),
      { name: 'ScrubSensitiveUrls', processEvent: scrubSensitiveUrls, processSpan: scrubSensitiveUrls },
    ],
    tracesSampleRate: parseSampleRate(config.sentryTracesSampleRate, 0.4),
    tracePropagationTargets: [config.apiUrl],
    replaysSessionSampleRate: parseSampleRate(config.sentryReplaysSessionSampleRate, 0.4),
    replaysOnErrorSampleRate: 1,
  });
  if (recordReplay) pauseReplayOnSensitiveUrls(router);
}

function pauseReplayOnSensitiveUrls(router: RegisteredRouter): void {
  let pausedMode: 'session' | 'buffer' | undefined;
  let stopping = Promise.resolve();
  const resume = async () => {
    const stop = stopping;
    await stop;
    const replay = Sentry.getReplay();
    if (stop !== stopping || !replay || !pausedMode || hasSensitiveUrl(window.location.href)) return;
    if (pausedMode === 'session') replay.start();
    else replay.startBuffering();
    pausedMode = undefined;
  };
  const sync = (url: string) => {
    const replay = Sentry.getReplay();
    if (!replay) return;
    if (hasSensitiveUrl(url)) {
      if (pausedMode) return;
      pausedMode = replay.getRecordingMode();
      stopping = replay.stop().catch(() => undefined);
    } else if (pausedMode) {
      setTimeout(() => void resume());
    }
  };
  // Router pushes notify before the URL changes, so pausing precedes it and resuming waits for it.
  router.history.subscribe(({ location }) => sync(location.href));
  window.addEventListener('popstate', () => sync(window.location.href));
}

export function setSentryUser(user: UserResponse | undefined): void {
  if (!user) {
    closeFeedback();
    Sentry.setUser(null);
    Sentry.setTag('user.roles', undefined);
    Sentry.setTag('user.multiple_roles', undefined);
    Sentry.getIsolationScope().removeAttribute('user.roles').removeAttribute('user.multiple_roles');
    return;
  }

  const roles = user.roles ?? [];
  // Flags the anomaly where a user unexpectedly holds more than one role.
  const roleTags = { 'user.roles': roles.join(','), 'user.multiple_roles': roles.length > 1 };
  Sentry.setUser({ id: String(user.id), roles });
  Sentry.setTags(roleTags);
  Sentry.setAttributes(roleTags);
}

export function trackFormSubmit(
  formName: string,
  outcome: 'valid' | 'invalid',
  formState: { fieldMeta: Partial<Record<string, FieldMeta>> }
): void {
  Sentry.addBreadcrumb(createFormBreadcrumb(formName, outcome, formState));
}
