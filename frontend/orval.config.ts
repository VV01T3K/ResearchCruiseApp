import { defineConfig } from 'orval';

export default defineConfig({
  researchCruiseApi: {
    input: '../backend/openapi/ResearchCruiseApp.json',
    hooks: {
      // doesnt quite work (maybe files are just ommited from oxfmt)
      afterAllFilesWrite: {
        command: 'vp fmt ./src/api/orval/**/*.{ts,tsx} --write',
        injectGeneratedDirsAndFiles: false,
      },
    },
    output: {
      target: './endpoints',
      schemas: {
        path: './model',
        type: 'zod',
      },
      // formatter: 'oxfmt', // command failed
      workspace: './src/api/orval/',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags-split',
      // indexFiles: true, // not sure if needed with workspace
      fileExtension: '.gen.ts',
      clean: ['./endpoints', './model', './index.ts'],
      tsconfig: './tsconfig.json',
      override: {
        mutator: {
          path: './fetch.ts',
          name: 'orvalFetch',
        },
        fetch: {
          runtimeValidation: true,
        },
        zod: {
          // not quite sure what each does
          strict: {
            body: true,
            header: true,
            param: true,
            query: true,
            response: true,
          },
          generate: {
            body: true,
            header: true,
            param: true,
            query: true,
            response: true,
          },
        },
        query: {
          // not sure if we need all of these, maybe more endpoint specific overrides
          useQuery: true,
          useMutation: true,
          useSuspenseQuery: true,
          // usePrefetch: true,
          // useInvalidate: true,
          // shouldExportQueryKey: true,
          // signal: true,
        },
      },
    },
  },
});
