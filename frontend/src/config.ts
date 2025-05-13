export default {
  dev: import.meta.env.DEV,

  apiUrl: API_URL ?? 'http://localhost:3000',
  version: APP_VERSION,
  environment: APP_ENVIRONMENT ?? 'local',
  otelServiceName: OTEL_SERVICE_NAME ?? 'research-cruise-app-frontend',
  grafanaFaroUrl: GRAFANA_FARO_URL ?? '/faro/collect',
};
