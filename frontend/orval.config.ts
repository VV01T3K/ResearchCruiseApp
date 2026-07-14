import { defineConfig } from 'orval';

export default defineConfig({
  backend: {
    input: {
      target: '../backend/ResearchCruiseApp/openapi/ResearchCruiseApp_v2.json',
    },
    output: {
      target: 'src/api/gen/endpoints',
      schemas: {
        path: 'src/api/gen/model',
        type: 'zod',
      },
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags',
      clean: true,
      indexFiles: true,
      fileExtension: '.gen.ts',
      override: {
        mutator: {
          path: 'src/lib/custom-fetch.ts',
          name: 'customFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          useQuery: false,
          useSuspenseQuery: true,
        },
        operations: {
          GetCruiseBlockades: {
            query: {
              useQuery: true,
              useSuspenseQuery: false,
            },
          },
        },
      },
    },
  },
});
