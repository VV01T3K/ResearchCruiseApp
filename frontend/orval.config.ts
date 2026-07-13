import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: '../backend/openapi/v2.json',
    output: {
      target: './src/api/generated/endpoints.ts',
      schemas: {
        path: './src/api/generated/model',
        type: 'zod',
      },
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'single',
      clean: true,
      formatter: 'prettier',
      override: {
        mutator: {
          path: './src/api/fetch.ts',
          name: 'apiFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          version: 5,
          signal: true,
          useQuery: false,
          useSuspenseQuery: true,
        },
        zod: {
          generate: {
            body: true,
            header: true,
            param: true,
            query: true,
            response: false,
          },
          strict: {
            body: true,
            header: true,
            param: true,
            query: true,
            response: false,
          },
        },
      },
    },
  },
});
