import {
  matchQuery,
  queryOptions as queryOptionsBuilder,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  MutationFunctionContext,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult
} from '@tanstack/react-query';

import type {
  BlockadeResponse,
  CreateRequest,
  CruiseResponse,
  ExportCruisesParams,
  ExportResponse,
  GetCruiseBlockadesParams,
  ProblemDetails,
  UpdateRequest
} from '../schemas';

import { customFetch } from '../../client/custom-fetch.ts';
import type { ErrorType } from '../../client/custom-fetch.ts';


type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



const withQueryKey = <T extends object, K>(query: T, queryKey: K): T & { queryKey: K } => {
  const result = { queryKey } as T & { queryKey: K };
  for (const key of Object.keys(query)) {
    // The explicit queryKey always wins, matching the previous
    // `{ ...query, queryKey }` spread where it was set last.
    if (key === 'queryKey') continue;
    Object.defineProperty(result, key, {
      enumerable: true,
      configurable: true,
      get: () => (query as Record<string, unknown>)[key],
    });
  }
  return result;
};

export const getGetCruisesUrl = () => {




  return `/v2/cruises`
}

/**
 * @summary Get visible cruises.
 */
export const getCruises = async ( options?: Parameters<typeof customFetch>[1]): Promise<CruiseResponse[]> => {

  return customFetch<CruiseResponse[]>(getGetCruisesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCruisesQueryKey = () => {
    return [
    'v2','cruises'
    ] as const;
    }


export const getGetCruisesSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getCruises>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruises>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCruisesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCruises>>> = ({ signal }) => getCruises({ signal, ...requestOptions });





   return  queryOptionsBuilder({ queryKey, ...queryOptions, queryFn: queryOptions?.queryFn ?? queryFn}) as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruises>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> } & { throwOnError?: ((this: never, error: TError) => boolean) & { readonly __inferenceOnly: never } }
}

export type GetCruisesSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCruises>>>
export type GetCruisesSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetCruisesSuspense<TData = Awaited<ReturnType<typeof getCruises>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruises>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCruisesSuspense<TData = Awaited<ReturnType<typeof getCruises>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruises>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCruisesSuspense<TData = Awaited<ReturnType<typeof getCruises>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruises>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get visible cruises.
 */

export function useGetCruisesSuspense<TData = Awaited<ReturnType<typeof getCruises>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruises>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCruisesSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getCreateCruiseUrl = () => {




  return `/v2/cruises`
}

/**
 * @summary Create a cruise.
 */
export const createCruise = async (createRequest: CreateRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

    const getHeaders = (h?: NonNullable<RequestInit['headers']>): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h as Iterable<Iterable<string>>, (entry) => Array.from(entry) as [string, string]),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<string | readonly string[] | undefined>(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
return customFetch<void>(getCreateCruiseUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(createRequest)
  }
);}





export const getCreateCruiseMutationKey = () => ['createCruise'] as const;

export const getCreateCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCruise>>, TError,CreateCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createCruise>>, TError,CreateCruiseMutationVariables, TContext> => {

const mutationKey = getCreateCruiseMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createCruise>>, CreateCruiseMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  createCruise(data,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof createCruise>>, variables: CreateCruiseMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type CreateCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof createCruise>>>
    export type CreateCruiseMutationBody = CreateRequest
    export type CreateCruiseMutationError = ErrorType<ProblemDetails>
    export type CreateCruiseMutationVariables = {data: CreateRequest}

    /**
 * @summary Create a cruise.
 */
export const useCreateCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCruise>>, TError,CreateCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createCruise>>,
        TError,
        CreateCruiseMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getCreateCruiseMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getGetCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}`
}

/**
 * @summary Get one visible cruise.
 */
export const getCruise = async (cruiseId: string, options?: Parameters<typeof customFetch>[1]): Promise<CruiseResponse> => {

  return customFetch<CruiseResponse>(getGetCruiseUrl(cruiseId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCruiseQueryKey = (cruiseId: string,) => {
    return [
    'v2','cruises',cruiseId
    ] as const;
    }


export const getGetCruiseSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getCruise>>, TError = ErrorType<ProblemDetails>>(cruiseId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCruiseQueryKey(cruiseId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCruise>>> = ({ signal }) => getCruise(cruiseId, { signal, ...requestOptions });





   return  queryOptionsBuilder({ queryKey, ...queryOptions, queryFn: queryOptions?.queryFn ?? queryFn}) as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruise>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> } & { throwOnError?: ((this: never, error: TError) => boolean) & { readonly __inferenceOnly: never } }
}

export type GetCruiseSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCruise>>>
export type GetCruiseSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetCruiseSuspense<TData = Awaited<ReturnType<typeof getCruise>>, TError = ErrorType<ProblemDetails>>(
 cruiseId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCruiseSuspense<TData = Awaited<ReturnType<typeof getCruise>>, TError = ErrorType<ProblemDetails>>(
 cruiseId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCruiseSuspense<TData = Awaited<ReturnType<typeof getCruise>>, TError = ErrorType<ProblemDetails>>(
 cruiseId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get one visible cruise.
 */

export function useGetCruiseSuspense<TData = Awaited<ReturnType<typeof getCruise>>, TError = ErrorType<ProblemDetails>>(
 cruiseId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCruiseSuspenseQueryOptions(cruiseId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getUpdateCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}`
}

/**
 * @summary Update a cruise.
 */
export const updateCruise = async (cruiseId: string,
    updateRequest: UpdateRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

    const getHeaders = (h?: NonNullable<RequestInit['headers']>): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h as Iterable<Iterable<string>>, (entry) => Array.from(entry) as [string, string]),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<string | readonly string[] | undefined>(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
return customFetch<void>(getUpdateCruiseUrl(cruiseId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(updateRequest)
  }
);}





export const getUpdateCruiseMutationKey = () => ['updateCruise'] as const;

export const getUpdateCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCruise>>, TError,UpdateCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateCruise>>, TError,UpdateCruiseMutationVariables, TContext> => {

const mutationKey = getUpdateCruiseMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateCruise>>, UpdateCruiseMutationVariables> = (props) => {
          const {cruiseId,data} = props ?? {};

          return  updateCruise(cruiseId,data,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof updateCruise>>, variables: UpdateCruiseMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCruiseQueryKey(variables.cruiseId) });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type UpdateCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof updateCruise>>>
    export type UpdateCruiseMutationBody = UpdateRequest
    export type UpdateCruiseMutationError = ErrorType<ProblemDetails>
    export type UpdateCruiseMutationVariables = {cruiseId: string;data: UpdateRequest}

    /**
 * @summary Update a cruise.
 */
export const useUpdateCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCruise>>, TError,UpdateCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateCruise>>,
        TError,
        UpdateCruiseMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getUpdateCruiseMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getDeleteCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}`
}

/**
 * @summary Delete a cruise.
 */
export const deleteCruise = async (cruiseId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getDeleteCruiseUrl(cruiseId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteCruiseMutationKey = () => ['deleteCruise'] as const;

export const getDeleteCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCruise>>, TError,DeleteCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteCruise>>, TError,DeleteCruiseMutationVariables, TContext> => {

const mutationKey = getDeleteCruiseMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteCruise>>, DeleteCruiseMutationVariables> = (props) => {
          const {cruiseId} = props ?? {};

          return  deleteCruise(cruiseId,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof deleteCruise>>, variables: DeleteCruiseMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type DeleteCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCruise>>>

    export type DeleteCruiseMutationError = ErrorType<ProblemDetails>
    export type DeleteCruiseMutationVariables = {cruiseId: string}

    /**
 * @summary Delete a cruise.
 */
export const useDeleteCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCruise>>, TError,DeleteCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteCruise>>,
        TError,
        DeleteCruiseMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getDeleteCruiseMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getConfirmCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}/confirmation`
}

/**
 * @summary Confirm a cruise.
 */
export const confirmCruise = async (cruiseId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getConfirmCruiseUrl(cruiseId),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getConfirmCruiseMutationKey = () => ['confirmCruise'] as const;

export const getConfirmCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof confirmCruise>>, TError,ConfirmCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof confirmCruise>>, TError,ConfirmCruiseMutationVariables, TContext> => {

const mutationKey = getConfirmCruiseMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof confirmCruise>>, ConfirmCruiseMutationVariables> = (props) => {
          const {cruiseId} = props ?? {};

          return  confirmCruise(cruiseId,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof confirmCruise>>, variables: ConfirmCruiseMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCruiseQueryKey(variables.cruiseId) });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type ConfirmCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof confirmCruise>>>

    export type ConfirmCruiseMutationError = ErrorType<ProblemDetails>
    export type ConfirmCruiseMutationVariables = {cruiseId: string}

    /**
 * @summary Confirm a cruise.
 */
export const useConfirmCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof confirmCruise>>, TError,ConfirmCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof confirmCruise>>,
        TError,
        ConfirmCruiseMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getConfirmCruiseMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getRemoveCruiseConfirmationUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}/confirmation`
}

/**
 * @summary Revert the latest cruise lifecycle state.
 */
export const removeCruiseConfirmation = async (cruiseId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getRemoveCruiseConfirmationUrl(cruiseId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getRemoveCruiseConfirmationMutationKey = () => ['removeCruiseConfirmation'] as const;

export const getRemoveCruiseConfirmationMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeCruiseConfirmation>>, TError,RemoveCruiseConfirmationMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof removeCruiseConfirmation>>, TError,RemoveCruiseConfirmationMutationVariables, TContext> => {

const mutationKey = getRemoveCruiseConfirmationMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof removeCruiseConfirmation>>, RemoveCruiseConfirmationMutationVariables> = (props) => {
          const {cruiseId} = props ?? {};

          return  removeCruiseConfirmation(cruiseId,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof removeCruiseConfirmation>>, variables: RemoveCruiseConfirmationMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ predicate: (query) => [getGetCruisesQueryKey(), getGetCruiseQueryKey(variables.cruiseId)].some((queryKey) => matchQuery({ queryKey }, query)) });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type RemoveCruiseConfirmationMutationResult = NonNullable<Awaited<ReturnType<typeof removeCruiseConfirmation>>>

    export type RemoveCruiseConfirmationMutationError = ErrorType<ProblemDetails>
    export type RemoveCruiseConfirmationMutationVariables = {cruiseId: string}

    /**
 * @summary Revert the latest cruise lifecycle state.
 */
export const useRemoveCruiseConfirmation = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeCruiseConfirmation>>, TError,RemoveCruiseConfirmationMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof removeCruiseConfirmation>>,
        TError,
        RemoveCruiseConfirmationMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getRemoveCruiseConfirmationMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getCompleteCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}/completion`
}

/**
 * @summary Mark a cruise as completed.
 */
export const completeCruise = async (cruiseId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getCompleteCruiseUrl(cruiseId),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getCompleteCruiseMutationKey = () => ['completeCruise'] as const;

export const getCompleteCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof completeCruise>>, TError,CompleteCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof completeCruise>>, TError,CompleteCruiseMutationVariables, TContext> => {

const mutationKey = getCompleteCruiseMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof completeCruise>>, CompleteCruiseMutationVariables> = (props) => {
          const {cruiseId} = props ?? {};

          return  completeCruise(cruiseId,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof completeCruise>>, variables: CompleteCruiseMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCruiseQueryKey(variables.cruiseId) });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type CompleteCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof completeCruise>>>

    export type CompleteCruiseMutationError = ErrorType<ProblemDetails>
    export type CompleteCruiseMutationVariables = {cruiseId: string}

    /**
 * @summary Mark a cruise as completed.
 */
export const useCompleteCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof completeCruise>>, TError,CompleteCruiseMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof completeCruise>>,
        TError,
        CompleteCruiseMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getCompleteCruiseMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getAutoPlanCruisesUrl = () => {




  return `/v2/cruises/auto-plan`
}

/**
 * @summary Automatically plan eligible cruises.
 */
export const autoPlanCruises = async ( options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getAutoPlanCruisesUrl(),
  {
    ...options,
    method: 'POST'


  }
);}





export const getAutoPlanCruisesMutationKey = () => ['autoPlanCruises'] as const;

export const getAutoPlanCruisesMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof autoPlanCruises>>, TError,void, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof autoPlanCruises>>, TError,void, TContext> => {

const mutationKey = getAutoPlanCruisesMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof autoPlanCruises>>, void> = () => {


          return  autoPlanCruises(requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof autoPlanCruises>>, variables: void, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type AutoPlanCruisesMutationResult = NonNullable<Awaited<ReturnType<typeof autoPlanCruises>>>

    export type AutoPlanCruisesMutationError = ErrorType<ProblemDetails>


    /**
 * @summary Automatically plan eligible cruises.
 */
export const useAutoPlanCruises = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof autoPlanCruises>>, TError,void, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof autoPlanCruises>>,
        TError,
        void,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getAutoPlanCruisesMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getGetCruiseBlockadesUrl = (params: GetCruiseBlockadesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/v2/cruises/blockades?${stringifiedParams}` : `/v2/cruises/blockades`
}

/**
 * @summary Get blockade periods for a year.
 */
export const getCruiseBlockades = async (params: GetCruiseBlockadesParams, options?: Parameters<typeof customFetch>[1]): Promise<BlockadeResponse[]> => {

  return customFetch<BlockadeResponse[]>(getGetCruiseBlockadesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCruiseBlockadesQueryKey = (params?: GetCruiseBlockadesParams,) => {
    return [
    'v2','cruises','blockades', ...(params ? [params] : [])
    ] as const;
    }


export const getGetCruiseBlockadesQueryOptions = <TData = Awaited<ReturnType<typeof getCruiseBlockades>>, TError = ErrorType<ProblemDetails>>(params: GetCruiseBlockadesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCruiseBlockades>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCruiseBlockadesQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCruiseBlockades>>> = ({ signal }) => getCruiseBlockades(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getCruiseBlockades>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetCruiseBlockadesQueryResult = NonNullable<Awaited<ReturnType<typeof getCruiseBlockades>>>
export type GetCruiseBlockadesQueryError = ErrorType<ProblemDetails>


export function useGetCruiseBlockades<TData = Awaited<ReturnType<typeof getCruiseBlockades>>, TError = ErrorType<ProblemDetails>>(
 params: GetCruiseBlockadesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCruiseBlockades>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCruiseBlockades>>,
          TError,
          Awaited<ReturnType<typeof getCruiseBlockades>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCruiseBlockades<TData = Awaited<ReturnType<typeof getCruiseBlockades>>, TError = ErrorType<ProblemDetails>>(
 params: GetCruiseBlockadesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCruiseBlockades>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCruiseBlockades>>,
          TError,
          Awaited<ReturnType<typeof getCruiseBlockades>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCruiseBlockades<TData = Awaited<ReturnType<typeof getCruiseBlockades>>, TError = ErrorType<ProblemDetails>>(
 params: GetCruiseBlockadesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCruiseBlockades>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get blockade periods for a year.
 */

export function useGetCruiseBlockades<TData = Awaited<ReturnType<typeof getCruiseBlockades>>, TError = ErrorType<ProblemDetails>>(
 params: GetCruiseBlockadesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCruiseBlockades>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCruiseBlockadesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getExportCruisesUrl = (params: ExportCruisesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/v2/cruises/export?${stringifiedParams}` : `/v2/cruises/export`
}

/**
 * @summary Export visible cruises for a year.
 */
export const exportCruises = async (params: ExportCruisesParams, options?: Parameters<typeof customFetch>[1]): Promise<ExportResponse> => {

  return customFetch<ExportResponse>(getExportCruisesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}



