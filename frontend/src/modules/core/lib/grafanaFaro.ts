import config from '@config';
import { getWebInstrumentations, initializeFaro as initializeFaroSdk } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export function initializeFaro() {
  initializeFaroSdk({
    url: config.grafanaFaroUrl,
    instrumentations: [...getWebInstrumentations({ captureConsole: true }), new TracingInstrumentation()],
    app: {
      name: config.otelServiceName,
      version: config.version,
      environment: config.environment,
    },
  });
}
