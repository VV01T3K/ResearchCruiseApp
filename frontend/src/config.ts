export default {
  dev: import.meta.env.DEV,

  apiUrl: API_URL ?? 'http://localhost:3000',
  version: APP_VERSION,
  environment: APP_ENVIRONMENT ?? 'local',
  otelServiceName: 'research-cruise-app-frontend',
  hyperdxApiKey: HYPERDX_API_KEY ?? '',
  hyperdxApiUrl: HYPERDX_API_URL ?? 'https://otel.wsiwiec.com',
};
