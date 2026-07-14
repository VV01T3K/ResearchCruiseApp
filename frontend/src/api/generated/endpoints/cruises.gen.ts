import {
  useMutation,
  useQuery,
  useSuspenseQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
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

import { customFetch } from '../../../lib/custom-fetch.ts';
import type { ErrorType } from '../../../lib/custom-fetch.ts';


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
export const getCruises = async ( options?: RequestInit): Promise<CruiseResponse[]> => {

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





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruises>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
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
export const createCruise = async (createRequest: CreateRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCreateCruiseUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createRequest)
  }
);}





export const getCreateCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCruise>>, TError,{data: CreateRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createCruise>>, TError,{data: CreateRequest}, TContext> => {

const mutationKey = ['createCruise'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createCruise>>, {data: CreateRequest}> = (props) => {
          const {data} = props ?? {};

          return  createCruise(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof createCruise>>>
    export type CreateCruiseMutationBody = CreateRequest
    export type CreateCruiseMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Create a cruise.
 */
export const useCreateCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCruise>>, TError,{data: CreateRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createCruise>>,
        TError,
        {data: CreateRequest},
        TContext
      > => {
      return useMutation(getCreateCruiseMutationOptions(options), queryClient);
    }
    export const getGetCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}`
}

/**
 * @summary Get one visible cruise.
 */
export const getCruise = async (cruiseId: string, options?: RequestInit): Promise<CruiseResponse> => {

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





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCruise>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
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
    updateRequest: UpdateRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUpdateCruiseUrl(cruiseId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateRequest)
  }
);}





export const getUpdateCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCruise>>, TError,{cruiseId: string;data: UpdateRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateCruise>>, TError,{cruiseId: string;data: UpdateRequest}, TContext> => {

const mutationKey = ['updateCruise'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateCruise>>, {cruiseId: string;data: UpdateRequest}> = (props) => {
          const {cruiseId,data} = props ?? {};

          return  updateCruise(cruiseId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof updateCruise>>>
    export type UpdateCruiseMutationBody = UpdateRequest
    export type UpdateCruiseMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Update a cruise.
 */
export const useUpdateCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCruise>>, TError,{cruiseId: string;data: UpdateRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateCruise>>,
        TError,
        {cruiseId: string;data: UpdateRequest},
        TContext
      > => {
      return useMutation(getUpdateCruiseMutationOptions(options), queryClient);
    }
    export const getDeleteCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}`
}

/**
 * @summary Delete a cruise.
 */
export const deleteCruise = async (cruiseId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getDeleteCruiseUrl(cruiseId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCruise>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteCruise>>, TError,{cruiseId: string}, TContext> => {

const mutationKey = ['deleteCruise'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteCruise>>, {cruiseId: string}> = (props) => {
          const {cruiseId} = props ?? {};

          return  deleteCruise(cruiseId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeleteCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCruise>>>

    export type DeleteCruiseMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Delete a cruise.
 */
export const useDeleteCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCruise>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteCruise>>,
        TError,
        {cruiseId: string},
        TContext
      > => {
      return useMutation(getDeleteCruiseMutationOptions(options), queryClient);
    }
    export const getConfirmCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}/confirmation`
}

/**
 * @summary Confirm a cruise.
 */
export const confirmCruise = async (cruiseId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getConfirmCruiseUrl(cruiseId),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getConfirmCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof confirmCruise>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof confirmCruise>>, TError,{cruiseId: string}, TContext> => {

const mutationKey = ['confirmCruise'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof confirmCruise>>, {cruiseId: string}> = (props) => {
          const {cruiseId} = props ?? {};

          return  confirmCruise(cruiseId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ConfirmCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof confirmCruise>>>

    export type ConfirmCruiseMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Confirm a cruise.
 */
export const useConfirmCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof confirmCruise>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof confirmCruise>>,
        TError,
        {cruiseId: string},
        TContext
      > => {
      return useMutation(getConfirmCruiseMutationOptions(options), queryClient);
    }
    export const getRemoveCruiseConfirmationUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}/confirmation`
}

/**
 * @summary Revert the latest cruise lifecycle state.
 */
export const removeCruiseConfirmation = async (cruiseId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRemoveCruiseConfirmationUrl(cruiseId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getRemoveCruiseConfirmationMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeCruiseConfirmation>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof removeCruiseConfirmation>>, TError,{cruiseId: string}, TContext> => {

const mutationKey = ['removeCruiseConfirmation'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof removeCruiseConfirmation>>, {cruiseId: string}> = (props) => {
          const {cruiseId} = props ?? {};

          return  removeCruiseConfirmation(cruiseId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RemoveCruiseConfirmationMutationResult = NonNullable<Awaited<ReturnType<typeof removeCruiseConfirmation>>>

    export type RemoveCruiseConfirmationMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Revert the latest cruise lifecycle state.
 */
export const useRemoveCruiseConfirmation = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeCruiseConfirmation>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof removeCruiseConfirmation>>,
        TError,
        {cruiseId: string},
        TContext
      > => {
      return useMutation(getRemoveCruiseConfirmationMutationOptions(options), queryClient);
    }
    export const getCompleteCruiseUrl = (cruiseId: string,) => {




  return `/v2/cruises/${cruiseId}/completion`
}

/**
 * @summary Mark a cruise as completed.
 */
export const completeCruise = async (cruiseId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCompleteCruiseUrl(cruiseId),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getCompleteCruiseMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof completeCruise>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof completeCruise>>, TError,{cruiseId: string}, TContext> => {

const mutationKey = ['completeCruise'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof completeCruise>>, {cruiseId: string}> = (props) => {
          const {cruiseId} = props ?? {};

          return  completeCruise(cruiseId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompleteCruiseMutationResult = NonNullable<Awaited<ReturnType<typeof completeCruise>>>

    export type CompleteCruiseMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Mark a cruise as completed.
 */
export const useCompleteCruise = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof completeCruise>>, TError,{cruiseId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof completeCruise>>,
        TError,
        {cruiseId: string},
        TContext
      > => {
      return useMutation(getCompleteCruiseMutationOptions(options), queryClient);
    }
    export const getAutoPlanCruisesUrl = () => {




  return `/v2/cruises/auto-plan`
}

/**
 * @summary Automatically plan eligible cruises.
 */
export const autoPlanCruises = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAutoPlanCruisesUrl(),
  {
    ...options,
    method: 'POST'


  }
);}





export const getAutoPlanCruisesMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof autoPlanCruises>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof autoPlanCruises>>, TError,void, TContext> => {

const mutationKey = ['autoPlanCruises'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof autoPlanCruises>>, void> = () => {


          return  autoPlanCruises(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AutoPlanCruisesMutationResult = NonNullable<Awaited<ReturnType<typeof autoPlanCruises>>>

    export type AutoPlanCruisesMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Automatically plan eligible cruises.
 */
export const useAutoPlanCruises = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof autoPlanCruises>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof autoPlanCruises>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getAutoPlanCruisesMutationOptions(options), queryClient);
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
export const getCruiseBlockades = async (params: GetCruiseBlockadesParams, options?: RequestInit): Promise<BlockadeResponse[]> => {

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
export const exportCruises = async (params: ExportCruisesParams, options?: RequestInit): Promise<ExportResponse> => {

  return customFetch<ExportResponse>(getExportCruisesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}



