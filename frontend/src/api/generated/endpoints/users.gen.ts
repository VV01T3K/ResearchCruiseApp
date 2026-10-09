import {
  queryOptions as queryOptionsBuilder,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  MutationFunction,
  MutationFunctionContext,
  QueryClient,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult
} from '@tanstack/react-query';

import type {
  ChangePasswordRequest,
  CreateUserRequest,
  CruiseEffectResponse,
  CruiseManagerResponse,
  CurrentUserResponse,
  ImportPublicationRequest,
  ProblemDetails,
  PublicationResponse,
  UpdateUserRequest,
  UserResponse
} from '../schemas';

import { customFetch } from '../../fetch.ts';
import type { ErrorType } from '../../fetch.ts';


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

export const getGetCurrentUserUrl = () => {




  return `/v2/users/me`
}

/**
 * @summary Get the current account.
 */
export const getCurrentUser = async ( options?: Parameters<typeof customFetch>[1]): Promise<CurrentUserResponse> => {

  return customFetch<CurrentUserResponse>(getGetCurrentUserUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCurrentUserQueryKey = () => {
    return [
    'v2','users','me'
    ] as const;
    }


export const getGetCurrentUserSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCurrentUserQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCurrentUser>>> = ({ signal }) => getCurrentUser({ signal, ...requestOptions });





   return  queryOptionsBuilder({ queryKey, ...queryOptions, queryFn: queryOptions?.queryFn ?? queryFn}) as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> } & { throwOnError?: ((this: never, error: TError) => boolean) & { readonly __inferenceOnly: never } }
}

export type GetCurrentUserSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
export type GetCurrentUserSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetCurrentUserSuspense<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCurrentUserSuspense<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCurrentUserSuspense<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get the current account.
 */

export function useGetCurrentUserSuspense<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCurrentUserSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getChangeCurrentUserPasswordUrl = () => {




  return `/v2/users/me/password`
}

/**
 * @summary Change the current account password.
 */
export const changeCurrentUserPassword = async (changePasswordRequest: ChangePasswordRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getChangeCurrentUserPasswordUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(changePasswordRequest)
  }
);}





export const getChangeCurrentUserPasswordMutationKey = () => ['changeCurrentUserPassword'] as const;

export const getChangeCurrentUserPasswordMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof changeCurrentUserPassword>>, TError,ChangeCurrentUserPasswordMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof changeCurrentUserPassword>>, TError,ChangeCurrentUserPasswordMutationVariables, TContext> => {

const mutationKey = getChangeCurrentUserPasswordMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof changeCurrentUserPassword>>, ChangeCurrentUserPasswordMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  changeCurrentUserPassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ChangeCurrentUserPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof changeCurrentUserPassword>>>
    export type ChangeCurrentUserPasswordMutationBody = ChangePasswordRequest
    export type ChangeCurrentUserPasswordMutationError = ErrorType<ProblemDetails>
    export type ChangeCurrentUserPasswordMutationVariables = {data: ChangePasswordRequest}

    /**
 * @summary Change the current account password.
 */
export const useChangeCurrentUserPassword = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof changeCurrentUserPassword>>, TError,ChangeCurrentUserPasswordMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof changeCurrentUserPassword>>,
        TError,
        ChangeCurrentUserPasswordMutationVariables,
        TContext
      > => {
      return useMutation(getChangeCurrentUserPasswordMutationOptions(options), queryClient);
    }
    export const getGetCurrentUserCruiseEffectsUrl = () => {




  return `/v2/users/me/cruise-effects`
}

/**
 * @summary Get cruise effects for the current user.
 */
export const getCurrentUserCruiseEffects = async ( options?: Parameters<typeof customFetch>[1]): Promise<CruiseEffectResponse[]> => {

  return customFetch<CruiseEffectResponse[]>(getGetCurrentUserCruiseEffectsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCurrentUserCruiseEffectsQueryKey = () => {
    return [
    'v2','users','me','cruise-effects'
    ] as const;
    }


export const getGetCurrentUserCruiseEffectsSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCurrentUserCruiseEffectsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>> = ({ signal }) => getCurrentUserCruiseEffects({ signal, ...requestOptions });





   return  queryOptionsBuilder({ queryKey, ...queryOptions, queryFn: queryOptions?.queryFn ?? queryFn}) as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> } & { throwOnError?: ((this: never, error: TError) => boolean) & { readonly __inferenceOnly: never } }
}

export type GetCurrentUserCruiseEffectsSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>>
export type GetCurrentUserCruiseEffectsSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetCurrentUserCruiseEffectsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCurrentUserCruiseEffectsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCurrentUserCruiseEffectsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get cruise effects for the current user.
 */

export function useGetCurrentUserCruiseEffectsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCurrentUserCruiseEffectsSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getGetCurrentUserPublicationsUrl = () => {




  return `/v2/users/me/publications`
}

/**
 * @summary Get the current user's publications.
 */
export const getCurrentUserPublications = async ( options?: Parameters<typeof customFetch>[1]): Promise<PublicationResponse[]> => {

  return customFetch<PublicationResponse[]>(getGetCurrentUserPublicationsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCurrentUserPublicationsQueryKey = () => {
    return [
    'v2','users','me','publications'
    ] as const;
    }


export const getGetCurrentUserPublicationsSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getCurrentUserPublications>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserPublications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCurrentUserPublicationsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCurrentUserPublications>>> = ({ signal }) => getCurrentUserPublications({ signal, ...requestOptions });





   return  queryOptionsBuilder({ queryKey, ...queryOptions, queryFn: queryOptions?.queryFn ?? queryFn}) as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserPublications>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> } & { throwOnError?: ((this: never, error: TError) => boolean) & { readonly __inferenceOnly: never } }
}

export type GetCurrentUserPublicationsSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentUserPublications>>>
export type GetCurrentUserPublicationsSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetCurrentUserPublicationsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserPublications>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserPublications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCurrentUserPublicationsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserPublications>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserPublications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetCurrentUserPublicationsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserPublications>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserPublications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get the current user's publications.
 */

export function useGetCurrentUserPublicationsSuspense<TData = Awaited<ReturnType<typeof getCurrentUserPublications>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserPublications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCurrentUserPublicationsSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getDeleteAllCurrentUserPublicationsUrl = () => {




  return `/v2/users/me/publications`
}

/**
 * @summary Delete all publications from the current user.
 */
export const deleteAllCurrentUserPublications = async ( options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getDeleteAllCurrentUserPublicationsUrl(),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteAllCurrentUserPublicationsMutationKey = () => ['deleteAllCurrentUserPublications'] as const;

export const getDeleteAllCurrentUserPublicationsMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>, TError,void, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>, TError,void, TContext> => {

const mutationKey = getDeleteAllCurrentUserPublicationsMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>, void> = () => {


          return  deleteAllCurrentUserPublications(requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>, variables: void, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type DeleteAllCurrentUserPublicationsMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>>

    export type DeleteAllCurrentUserPublicationsMutationError = ErrorType<ProblemDetails>


    /**
 * @summary Delete all publications from the current user.
 */
export const useDeleteAllCurrentUserPublications = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>, TError,void, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>,
        TError,
        void,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getDeleteAllCurrentUserPublicationsMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getImportCurrentUserPublicationsUrl = () => {




  return `/v2/users/me/publications/import`
}

/**
 * @summary Import publications for the current user.
 */
export const importCurrentUserPublications = async (importPublicationRequest: ImportPublicationRequest[], options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getImportCurrentUserPublicationsUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(importPublicationRequest)
  }
);}





export const getImportCurrentUserPublicationsMutationKey = () => ['importCurrentUserPublications'] as const;

export const getImportCurrentUserPublicationsMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof importCurrentUserPublications>>, TError,ImportCurrentUserPublicationsMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof importCurrentUserPublications>>, TError,ImportCurrentUserPublicationsMutationVariables, TContext> => {

const mutationKey = getImportCurrentUserPublicationsMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof importCurrentUserPublications>>, ImportCurrentUserPublicationsMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  importCurrentUserPublications(data,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof importCurrentUserPublications>>, variables: ImportCurrentUserPublicationsMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type ImportCurrentUserPublicationsMutationResult = NonNullable<Awaited<ReturnType<typeof importCurrentUserPublications>>>
    export type ImportCurrentUserPublicationsMutationBody = ImportPublicationRequest[]
    export type ImportCurrentUserPublicationsMutationError = ErrorType<ProblemDetails>
    export type ImportCurrentUserPublicationsMutationVariables = {data: ImportPublicationRequest[]}

    /**
 * @summary Import publications for the current user.
 */
export const useImportCurrentUserPublications = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof importCurrentUserPublications>>, TError,ImportCurrentUserPublicationsMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof importCurrentUserPublications>>,
        TError,
        ImportCurrentUserPublicationsMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getImportCurrentUserPublicationsMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getDeleteCurrentUserPublicationUrl = (publicationId: string,) => {




  return `/v2/users/me/publications/${publicationId}`
}

/**
 * @summary Delete one publication from the current user.
 */
export const deleteCurrentUserPublication = async (publicationId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getDeleteCurrentUserPublicationUrl(publicationId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteCurrentUserPublicationMutationKey = () => ['deleteCurrentUserPublication'] as const;

export const getDeleteCurrentUserPublicationMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, TError,DeleteCurrentUserPublicationMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, TError,DeleteCurrentUserPublicationMutationVariables, TContext> => {

const mutationKey = getDeleteCurrentUserPublicationMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, DeleteCurrentUserPublicationMutationVariables> = (props) => {
          const {publicationId} = props ?? {};

          return  deleteCurrentUserPublication(publicationId,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof deleteCurrentUserPublication>>, variables: DeleteCurrentUserPublicationMutationVariables, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type DeleteCurrentUserPublicationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCurrentUserPublication>>>

    export type DeleteCurrentUserPublicationMutationError = ErrorType<ProblemDetails>
    export type DeleteCurrentUserPublicationMutationVariables = {publicationId: string}

    /**
 * @summary Delete one publication from the current user.
 */
export const useDeleteCurrentUserPublication = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, TError,DeleteCurrentUserPublicationMutationVariables, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteCurrentUserPublication>>,
        TError,
        DeleteCurrentUserPublicationMutationVariables,
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getDeleteCurrentUserPublicationMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getGetUsersUrl = () => {




  return `/v2/users`
}

/**
 * @summary Get manageable users.
 */
export const getUsers = async ( options?: Parameters<typeof customFetch>[1]): Promise<UserResponse[]> => {

  return customFetch<UserResponse[]>(getGetUsersUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetUsersQueryKey = () => {
    return [
    'v2','users'
    ] as const;
    }


export const getGetUsersSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUsersQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({ signal }) => getUsers({ signal, ...requestOptions });





   return  queryOptionsBuilder({ queryKey, ...queryOptions, queryFn: queryOptions?.queryFn ?? queryFn}) as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> } & { throwOnError?: ((this: never, error: TError) => boolean) & { readonly __inferenceOnly: never } }
}

export type GetUsersSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getUsers>>>
export type GetUsersSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get manageable users.
 */

export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUsersSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getCreateUserUrl = () => {




  return `/v2/users`
}

/**
 * @summary Create a user account.
 */
export const createUser = async (createUserRequest: CreateUserRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getCreateUserUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(createUserRequest)
  }
);}





export const getCreateUserMutationKey = () => ['createUser'] as const;

export const getCreateUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,CreateUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,CreateUserMutationVariables, TContext> => {

const mutationKey = getCreateUserMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createUser>>, CreateUserMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  createUser(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>
    export type CreateUserMutationBody = CreateUserRequest
    export type CreateUserMutationError = ErrorType<ProblemDetails>
    export type CreateUserMutationVariables = {data: CreateUserRequest}

    /**
 * @summary Create a user account.
 */
export const useCreateUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,CreateUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createUser>>,
        TError,
        CreateUserMutationVariables,
        TContext
      > => {
      return useMutation(getCreateUserMutationOptions(options), queryClient);
    }
    export const getGetAvailableCruiseManagersUrl = () => {




  return `/v2/users/available-cruise-managers`
}

/**
 * @summary Get users available as cruise managers.
 */
export const getAvailableCruiseManagers = async ( options?: Parameters<typeof customFetch>[1]): Promise<CruiseManagerResponse[]> => {

  return customFetch<CruiseManagerResponse[]>(getGetAvailableCruiseManagersUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetAvailableCruiseManagersQueryKey = () => {
    return [
    'v2','users','available-cruise-managers'
    ] as const;
    }


export const getGetAvailableCruiseManagersSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAvailableCruiseManagersQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAvailableCruiseManagers>>> = ({ signal }) => getAvailableCruiseManagers({ signal, ...requestOptions });





   return  queryOptionsBuilder({ queryKey, ...queryOptions, queryFn: queryOptions?.queryFn ?? queryFn}) as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> } & { throwOnError?: ((this: never, error: TError) => boolean) & { readonly __inferenceOnly: never } }
}

export type GetAvailableCruiseManagersSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getAvailableCruiseManagers>>>
export type GetAvailableCruiseManagersSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetAvailableCruiseManagersSuspense<TData = Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAvailableCruiseManagersSuspense<TData = Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAvailableCruiseManagersSuspense<TData = Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get users available as cruise managers.
 */

export function useGetAvailableCruiseManagersSuspense<TData = Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAvailableCruiseManagersSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getUpdateUserUrl = (userId: string,) => {




  return `/v2/users/${userId}`
}

/**
 * @summary Update a managed user.
 */
export const updateUser = async (userId: string,
    updateUserRequest: UpdateUserRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getUpdateUserUrl(userId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(updateUserRequest)
  }
);}





export const getUpdateUserMutationKey = () => ['updateUser'] as const;

export const getUpdateUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,UpdateUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,UpdateUserMutationVariables, TContext> => {

const mutationKey = getUpdateUserMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateUser>>, UpdateUserMutationVariables> = (props) => {
          const {userId,data} = props ?? {};

          return  updateUser(userId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>
    export type UpdateUserMutationBody = UpdateUserRequest
    export type UpdateUserMutationError = ErrorType<ProblemDetails>
    export type UpdateUserMutationVariables = {userId: string;data: UpdateUserRequest}

    /**
 * @summary Update a managed user.
 */
export const useUpdateUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,UpdateUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateUser>>,
        TError,
        UpdateUserMutationVariables,
        TContext
      > => {
      return useMutation(getUpdateUserMutationOptions(options), queryClient);
    }
    export const getDeleteUserUrl = (userId: string,) => {




  return `/v2/users/${userId}`
}

/**
 * @summary Delete a managed user.
 */
export const deleteUser = async (userId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getDeleteUserUrl(userId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteUserMutationKey = () => ['deleteUser'] as const;

export const getDeleteUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,DeleteUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,DeleteUserMutationVariables, TContext> => {

const mutationKey = getDeleteUserMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteUser>>, DeleteUserMutationVariables> = (props) => {
          const {userId} = props ?? {};

          return  deleteUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>

    export type DeleteUserMutationError = ErrorType<ProblemDetails>
    export type DeleteUserMutationVariables = {userId: string}

    /**
 * @summary Delete a managed user.
 */
export const useDeleteUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,DeleteUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteUser>>,
        TError,
        DeleteUserMutationVariables,
        TContext
      > => {
      return useMutation(getDeleteUserMutationOptions(options), queryClient);
    }
    export const getAcceptUserUrl = (userId: string,) => {




  return `/v2/users/${userId}/acceptance`
}

/**
 * @summary Accept a managed user.
 */
export const acceptUser = async (userId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getAcceptUserUrl(userId),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getAcceptUserMutationKey = () => ['acceptUser'] as const;

export const getAcceptUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof acceptUser>>, TError,AcceptUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof acceptUser>>, TError,AcceptUserMutationVariables, TContext> => {

const mutationKey = getAcceptUserMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof acceptUser>>, AcceptUserMutationVariables> = (props) => {
          const {userId} = props ?? {};

          return  acceptUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AcceptUserMutationResult = NonNullable<Awaited<ReturnType<typeof acceptUser>>>

    export type AcceptUserMutationError = ErrorType<ProblemDetails>
    export type AcceptUserMutationVariables = {userId: string}

    /**
 * @summary Accept a managed user.
 */
export const useAcceptUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof acceptUser>>, TError,AcceptUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof acceptUser>>,
        TError,
        AcceptUserMutationVariables,
        TContext
      > => {
      return useMutation(getAcceptUserMutationOptions(options), queryClient);
    }
    export const getDeactivateUserUrl = (userId: string,) => {




  return `/v2/users/${userId}/acceptance`
}

/**
 * @summary Deactivate a managed user.
 */
export const deactivateUser = async (userId: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getDeactivateUserUrl(userId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeactivateUserMutationKey = () => ['deactivateUser'] as const;

export const getDeactivateUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deactivateUser>>, TError,DeactivateUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deactivateUser>>, TError,DeactivateUserMutationVariables, TContext> => {

const mutationKey = getDeactivateUserMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deactivateUser>>, DeactivateUserMutationVariables> = (props) => {
          const {userId} = props ?? {};

          return  deactivateUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeactivateUserMutationResult = NonNullable<Awaited<ReturnType<typeof deactivateUser>>>

    export type DeactivateUserMutationError = ErrorType<ProblemDetails>
    export type DeactivateUserMutationVariables = {userId: string}

    /**
 * @summary Deactivate a managed user.
 */
export const useDeactivateUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deactivateUser>>, TError,DeactivateUserMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deactivateUser>>,
        TError,
        DeactivateUserMutationVariables,
        TContext
      > => {
      return useMutation(getDeactivateUserMutationOptions(options), queryClient);
    }
    export const getAddUserRoleUrl = (userId: string,
    roleName: string,) => {




  return `/v2/users/${userId}/roles/${roleName}`
}

/**
 * @summary Add a role to a managed user.
 */
export const addUserRole = async (userId: string,
    roleName: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getAddUserRoleUrl(userId,roleName),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getAddUserRoleMutationKey = () => ['addUserRole'] as const;

export const getAddUserRoleMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUserRole>>, TError,AddUserRoleMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof addUserRole>>, TError,AddUserRoleMutationVariables, TContext> => {

const mutationKey = getAddUserRoleMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addUserRole>>, AddUserRoleMutationVariables> = (props) => {
          const {userId,roleName} = props ?? {};

          return  addUserRole(userId,roleName,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AddUserRoleMutationResult = NonNullable<Awaited<ReturnType<typeof addUserRole>>>

    export type AddUserRoleMutationError = ErrorType<ProblemDetails>
    export type AddUserRoleMutationVariables = {userId: string;roleName: string}

    /**
 * @summary Add a role to a managed user.
 */
export const useAddUserRole = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUserRole>>, TError,AddUserRoleMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof addUserRole>>,
        TError,
        AddUserRoleMutationVariables,
        TContext
      > => {
      return useMutation(getAddUserRoleMutationOptions(options), queryClient);
    }
    export const getRemoveUserRoleUrl = (userId: string,
    roleName: string,) => {




  return `/v2/users/${userId}/roles/${roleName}`
}

/**
 * @summary Remove a role from a managed user.
 */
export const removeUserRole = async (userId: string,
    roleName: string, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getRemoveUserRoleUrl(userId,roleName),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getRemoveUserRoleMutationKey = () => ['removeUserRole'] as const;

export const getRemoveUserRoleMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeUserRole>>, TError,RemoveUserRoleMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof removeUserRole>>, TError,RemoveUserRoleMutationVariables, TContext> => {

const mutationKey = getRemoveUserRoleMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof removeUserRole>>, RemoveUserRoleMutationVariables> = (props) => {
          const {userId,roleName} = props ?? {};

          return  removeUserRole(userId,roleName,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RemoveUserRoleMutationResult = NonNullable<Awaited<ReturnType<typeof removeUserRole>>>

    export type RemoveUserRoleMutationError = ErrorType<ProblemDetails>
    export type RemoveUserRoleMutationVariables = {userId: string;roleName: string}

    /**
 * @summary Remove a role from a managed user.
 */
export const useRemoveUserRole = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeUserRole>>, TError,RemoveUserRoleMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof removeUserRole>>,
        TError,
        RemoveUserRoleMutationVariables,
        TContext
      > => {
      return useMutation(getRemoveUserRoleMutationOptions(options), queryClient);
    }
