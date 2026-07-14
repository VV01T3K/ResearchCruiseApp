import { defineConfig } from 'orval';

const dotNetGuidPattern = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

export default defineConfig({
  backend: {
    input: {
      target: '../backend/ResearchCruiseApp/openapi/ResearchCruiseApp_v2.json',
      unsafeDisableValidation: false,
      override: {
        transformer: (spec) =>
          JSON.parse(
            JSON.stringify(spec, (_key, value) =>
              value && typeof value === 'object' && value.format === 'uuid'
                ? { ...value, format: undefined, pattern: dotNetGuidPattern }
                : value
            )
          ) as typeof spec,
      },
    },
    output: {
      target: 'src/api/generated/endpoints',
      schemas: {
        path: 'src/api/generated/schemas',
        type: 'zod',
        splitByTags: true,
      },
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags',
      baseUrl: '',
      clean: true,
      mock: false,
      docs: false,
      headers: false,
      indexFiles: true,
      fileExtension: '.gen.ts',
      schemaFileExtension: '.gen.ts',
      allParamsOptional: false,
      optionsParamRequired: false,
      urlEncodeParameters: false,
      override: {
        mutator: {
          path: 'src/lib/custom-fetch.ts',
          name: 'customFetch',
        },
        requestOptions: true,
        useDates: false,
        useDeprecatedOperations: true,
        enumGenerationType: 'const',
        zod: {
          version: 4,
          variant: 'classic',
          strict: {
            param: false,
            query: false,
            header: false,
            body: false,
            response: false,
          },
          generate: {
            param: true,
            query: true,
            header: true,
            body: false,
            response: true,
          },
          coerce: {
            param: false,
            query: false,
            header: false,
            body: false,
            response: false,
          },
          generateEachHttpStatus: false,
          generateReusableSchemas: true,
          generateMeta: false,
          generateDiscriminatedUnion: false,
          useBrandedTypes: false,
        },
        fetch: {
          includeHttpResponseReturnType: false,
          forceSuccessResponse: false,
          runtimeValidation: false,
          useRuntimeFetcher: false,
        },
        query: {
          useQuery: false,
          // Intentionally unset useMutation: Orval infers mutations from the HTTP method.
          useSuspenseQuery: true,
          useInfinite: false,
          useSuspenseInfiniteQuery: false,
          usePrefetch: false,
          useInvalidate: false,
          useSetQueryData: false,
          useGetQueryData: false,
          shouldExportMutatorHooks: true,
          shouldExportHttpClient: true,
          shouldExportQueryKey: true,
          shouldFilterQueryKey: false,
          shouldSplitQueryKey: false,
          useOperationIdAsQueryKey: false,
          signal: true,
          version: 5,
          runtimeValidation: false,
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
