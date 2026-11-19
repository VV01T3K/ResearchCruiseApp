import { expect, it } from 'vite-plus/test';
import { connectionStatus } from '@/features/connection/status';

it('applies a health result only to the outage it was checking', () => {
  connectionStatus.suspect();
  const first = connectionStatus.get().outage;
  connectionStatus.recover();
  connectionStatus.suspect();
  connectionStatus.report(first, 'healthy');
  expect(connectionStatus.get().problem).toBe('checking');

  connectionStatus.report(connectionStatus.get().outage, 'unhealthy');
  expect(connectionStatus.get().problem).toBe('unhealthy');
  connectionStatus.report(connectionStatus.get().outage, 'healthy');
  expect(connectionStatus.get().problem).toBeNull();
});

it('keeps the offline warning until a health check answers', () => {
  connectionStatus.suspect('offline');
  connectionStatus.suspect();
  expect(connectionStatus.get().problem).toBe('offline');
  connectionStatus.report(connectionStatus.get().outage, 'unhealthy');
  expect(connectionStatus.get().problem).toBe('unhealthy');
  connectionStatus.recover();
});
