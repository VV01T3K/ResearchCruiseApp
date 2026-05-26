import HyperDX from '@hyperdx/browser';

import config from '@/config';
import { User } from '@/models/shared/User';

export function initializeHyperDX() {
  if (!config.hyperdxApiKey) return;

  HyperDX.init({
    apiKey: config.hyperdxApiKey,
    service: config.otelServiceName,
    url: config.hyperdxApiUrl,
    tracePropagationTargets: [/.*/],
    consoleCapture: true,
    advancedNetworkCapture: true,
  });

  HyperDX.setGlobalAttributes({
    environment: config.environment,
    version: config.version,
  });
}

export function setHyperDXUser(user: User) {
  if (!config.hyperdxApiKey) return;

  HyperDX.setGlobalAttributes({
    userId: user.id,
    userEmail: user.email,
    userName: `${user.firstName} ${user.lastName}`,
    userRoles: user.roles.join(','),
  });
}
