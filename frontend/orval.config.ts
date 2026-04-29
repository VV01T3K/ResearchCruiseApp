import { defineConfig } from 'orval';

export default defineConfig({
  researchCruiseApi: {
    input: '../backend/openapi/ResearchCruiseApp.json',
    output: {
      target: './endpoints',
      schemas: {
        path: './model',
        type: 'zod',
      },
      workspace: './src/api/orval/',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags-split',
      fileExtension: '.gen.ts',
      formatter: 'prettier',
      indexFiles: true,
      clean: ['./endpoints', './model', './zod', './index.ts'],
      tsconfig: './tsconfig.json',
      override: {
        mutator: {
          path: './fetch.ts',
          name: 'orvalFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
          runtimeValidation: false,
        },
        enumGenerationType: 'union',
        useTypeOverInterfaces: true,
        zod: {
          strict: {
            body: true,
            header: true,
            param: true,
            query: true,
            response: false,
          },
          generate: {
            body: true,
            header: true,
            param: true,
            query: true,
            response: false,
          },
          generateEachHttpStatus: false,
        },
        query: {
          version: 5,
          useQuery: false,
          useMutation: true,
          useSuspenseQuery: true,
          useInfinite: false,
          useSuspenseInfiniteQuery: false,
          usePrefetch: false,
          useInvalidate: false,
          useSetQueryData: false,
          useGetQueryData: false,
          signal: true,
          shouldExportMutatorHooks: false,
          shouldExportQueryKey: false,
          shouldSplitQueryKey: false,
        },
      },
    },
  },
});
