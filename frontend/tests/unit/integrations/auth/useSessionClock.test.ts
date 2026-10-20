import { afterEach, expect, it, vi } from 'vite-plus/test';
import { subscribeToPageResume } from '@/integrations/auth/useSessionClock';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('reads the current time when a backgrounded page becomes visible or regains focus', () => {
  vi.useFakeTimers({ now: new Date('2026-06-01T12:00:00Z') });
  const document = Object.assign(new EventTarget(), { visibilityState: 'hidden' });
  const window = new EventTarget();
  vi.stubGlobal('document', document);
  vi.stubGlobal('window', window);
  const resumedAt: number[] = [];
  const unsubscribe = subscribeToPageResume(() => resumedAt.push(Date.now()));

  vi.setSystemTime(new Date('2026-06-01T12:10:00Z'));
  document.dispatchEvent(new Event('visibilitychange'));
  document.visibilityState = 'visible';
  document.dispatchEvent(new Event('visibilitychange'));
  vi.setSystemTime(new Date('2026-06-01T12:20:00Z'));
  window.dispatchEvent(new Event('focus'));
  unsubscribe();
  window.dispatchEvent(new Event('focus'));

  expect(resumedAt).toEqual([Date.parse('2026-06-01T12:10:00Z'), Date.parse('2026-06-01T12:20:00Z')]);
});
