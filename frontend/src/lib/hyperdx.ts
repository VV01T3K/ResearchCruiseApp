import HyperDX from '@hyperdx/browser';

import config from '@/config';
import { User } from '@/models/shared/User';

type FieldMeta = { errors: Array<unknown> };

function extractFormErrors(fieldMeta: Partial<Record<string, FieldMeta>>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(fieldMeta)
      .map(([key, meta]) => [key, (meta?.errors ?? []).filter(Boolean).map(String)])
      .filter(([, errors]) => (errors as string[]).length > 0)
  );
}

export function initializeHyperDX() {
  if (!config.hyperdxApiKey) return;

  HyperDX.init({
    apiKey: config.hyperdxApiKey,
    service: config.otelServiceName,
    url: config.hyperdxApiUrl,
    tracePropagationTargets: [new RegExp(`^${config.apiUrl}`)],
    ignoreUrls: [/\/health$/],
    consoleCapture: true,
    advancedNetworkCapture: false,
    maskAllInputs: true,
    otelResourceAttributes: {
      'app.version': config.version,
      'deployment.environment': config.environment,
    },
  });

  HyperDX.setGlobalAttributes({
    environment: config.environment,
    version: config.version,
  });
}

export function attachErrorBoundary(boundary: object) {
  if (!config.hyperdxApiKey) return;
  HyperDX.attachToReactErrorBoundary(boundary);
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

export function trackFormSubmit(
  formName: string,
  outcome: 'valid' | 'invalid',
  formState: { fieldMeta: Partial<Record<string, FieldMeta>> }
) {
  if (!config.hyperdxApiKey) return;

  const errors = extractFormErrors(formState.fieldMeta);
  const attrs: Record<string, string> = { 'form.name': formName };

  if (outcome === 'invalid') {
    attrs['form.error_fields'] = Object.keys(errors).join(', ');
    attrs['form.error_count'] = String(Object.values(errors).flat().length);
    attrs['form.errors'] = JSON.stringify(errors);
  }

  HyperDX.addAction(`form.submit.${outcome}`, attrs);
}
