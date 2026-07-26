import {
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

export const getGetCurrentUserUrl = () => {




  return `/v2/users/me`
}

/**
 * @summary Get the current account.
 */
export const getCurrentUser = async ( options?: RequestInit): Promise<CurrentUserResponse> => {

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





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
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
export const changeCurrentUserPassword = async (changePasswordRequest: ChangePasswordRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getChangeCurrentUserPasswordUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(changePasswordRequest)
  }
);}





export const getChangeCurrentUserPasswordMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof changeCurrentUserPassword>>, TError,{data: ChangePasswordRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof changeCurrentUserPassword>>, TError,{data: ChangePasswordRequest}, TContext> => {

const mutationKey = ['changeCurrentUserPassword'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof changeCurrentUserPassword>>, {data: ChangePasswordRequest}> = (props) => {
          const {data} = props ?? {};

          return  changeCurrentUserPassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ChangeCurrentUserPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof changeCurrentUserPassword>>>
    export type ChangeCurrentUserPasswordMutationBody = ChangePasswordRequest
    export type ChangeCurrentUserPasswordMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Change the current account password.
 */
export const useChangeCurrentUserPassword = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof changeCurrentUserPassword>>, TError,{data: ChangePasswordRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof changeCurrentUserPassword>>,
        TError,
        {data: ChangePasswordRequest},
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
export const getCurrentUserCruiseEffects = async ( options?: RequestInit): Promise<CruiseEffectResponse[]> => {

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





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserCruiseEffects>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
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
export const getCurrentUserPublications = async ( options?: RequestInit): Promise<PublicationResponse[]> => {

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





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentUserPublications>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
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
export const deleteAllCurrentUserPublications = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getDeleteAllCurrentUserPublicationsUrl(),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteAllCurrentUserPublicationsMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>, TError,void, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteAllCurrentUserPublications>>, TError,void, TContext> => {

const mutationKey = ['deleteAllCurrentUserPublications'];
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
export const importCurrentUserPublications = async (importPublicationRequest: ImportPublicationRequest[], options?: RequestInit): Promise<void> => {

  return customFetch<void>(getImportCurrentUserPublicationsUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(importPublicationRequest)
  }
);}





export const getImportCurrentUserPublicationsMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof importCurrentUserPublications>>, TError,{data: ImportPublicationRequest[]}, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof importCurrentUserPublications>>, TError,{data: ImportPublicationRequest[]}, TContext> => {

const mutationKey = ['importCurrentUserPublications'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof importCurrentUserPublications>>, {data: ImportPublicationRequest[]}> = (props) => {
          const {data} = props ?? {};

          return  importCurrentUserPublications(data,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof importCurrentUserPublications>>, variables: {data: ImportPublicationRequest[]}, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type ImportCurrentUserPublicationsMutationResult = NonNullable<Awaited<ReturnType<typeof importCurrentUserPublications>>>
    export type ImportCurrentUserPublicationsMutationBody = ImportPublicationRequest[]
    export type ImportCurrentUserPublicationsMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Import publications for the current user.
 */
export const useImportCurrentUserPublications = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof importCurrentUserPublications>>, TError,{data: ImportPublicationRequest[]}, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof importCurrentUserPublications>>,
        TError,
        {data: ImportPublicationRequest[]},
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
export const deleteCurrentUserPublication = async (publicationId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getDeleteCurrentUserPublicationUrl(publicationId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteCurrentUserPublicationMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, TError,{publicationId: string}, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, TError,{publicationId: string}, TContext> => {

const mutationKey = ['deleteCurrentUserPublication'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, {publicationId: string}> = (props) => {
          const {publicationId} = props ?? {};

          return  deleteCurrentUserPublication(publicationId,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof deleteCurrentUserPublication>>, variables: {publicationId: string}, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserPublicationsQueryKey() });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type DeleteCurrentUserPublicationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCurrentUserPublication>>>

    export type DeleteCurrentUserPublicationMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Delete one publication from the current user.
 */
export const useDeleteCurrentUserPublication = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCurrentUserPublication>>, TError,{publicationId: string}, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteCurrentUserPublication>>,
        TError,
        {publicationId: string},
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
export const getUsers = async ( options?: RequestInit): Promise<UserResponse[]> => {

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





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
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
export const createUser = async (createUserRequest: CreateUserRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCreateUserUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createUserRequest)
  }
);}





export const getCreateUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: CreateUserRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: CreateUserRequest}, TContext> => {

const mutationKey = ['createUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createUser>>, {data: CreateUserRequest}> = (props) => {
          const {data} = props ?? {};

          return  createUser(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>
    export type CreateUserMutationBody = CreateUserRequest
    export type CreateUserMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Create a user account.
 */
export const useCreateUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: CreateUserRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createUser>>,
        TError,
        {data: CreateUserRequest},
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
export const getAvailableCruiseManagers = async ( options?: RequestInit): Promise<CruiseManagerResponse[]> => {

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





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAvailableCruiseManagers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
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
    updateUserRequest: UpdateUserRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUpdateUserUrl(userId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateUserRequest)
  }
);}





export const getUpdateUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{userId: string;data: UpdateUserRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{userId: string;data: UpdateUserRequest}, TContext> => {

const mutationKey = ['updateUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateUser>>, {userId: string;data: UpdateUserRequest}> = (props) => {
          const {userId,data} = props ?? {};

          return  updateUser(userId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>
    export type UpdateUserMutationBody = UpdateUserRequest
    export type UpdateUserMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Update a managed user.
 */
export const useUpdateUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{userId: string;data: UpdateUserRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateUser>>,
        TError,
        {userId: string;data: UpdateUserRequest},
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
export const deleteUser = async (userId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getDeleteUserUrl(userId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeleteUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{userId: string}, TContext> => {

const mutationKey = ['deleteUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteUser>>, {userId: string}> = (props) => {
          const {userId} = props ?? {};

          return  deleteUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>

    export type DeleteUserMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Delete a managed user.
 */
export const useDeleteUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteUser>>,
        TError,
        {userId: string},
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
export const acceptUser = async (userId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAcceptUserUrl(userId),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getAcceptUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof acceptUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof acceptUser>>, TError,{userId: string}, TContext> => {

const mutationKey = ['acceptUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof acceptUser>>, {userId: string}> = (props) => {
          const {userId} = props ?? {};

          return  acceptUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AcceptUserMutationResult = NonNullable<Awaited<ReturnType<typeof acceptUser>>>

    export type AcceptUserMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Accept a managed user.
 */
export const useAcceptUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof acceptUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof acceptUser>>,
        TError,
        {userId: string},
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
export const deactivateUser = async (userId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getDeactivateUserUrl(userId),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getDeactivateUserMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deactivateUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deactivateUser>>, TError,{userId: string}, TContext> => {

const mutationKey = ['deactivateUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deactivateUser>>, {userId: string}> = (props) => {
          const {userId} = props ?? {};

          return  deactivateUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeactivateUserMutationResult = NonNullable<Awaited<ReturnType<typeof deactivateUser>>>

    export type DeactivateUserMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Deactivate a managed user.
 */
export const useDeactivateUser = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deactivateUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deactivateUser>>,
        TError,
        {userId: string},
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
    roleName: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAddUserRoleUrl(userId,roleName),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getAddUserRoleMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUserRole>>, TError,{userId: string;roleName: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof addUserRole>>, TError,{userId: string;roleName: string}, TContext> => {

const mutationKey = ['addUserRole'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addUserRole>>, {userId: string;roleName: string}> = (props) => {
          const {userId,roleName} = props ?? {};

          return  addUserRole(userId,roleName,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AddUserRoleMutationResult = NonNullable<Awaited<ReturnType<typeof addUserRole>>>

    export type AddUserRoleMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Add a role to a managed user.
 */
export const useAddUserRole = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUserRole>>, TError,{userId: string;roleName: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof addUserRole>>,
        TError,
        {userId: string;roleName: string},
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
    roleName: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRemoveUserRoleUrl(userId,roleName),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getRemoveUserRoleMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeUserRole>>, TError,{userId: string;roleName: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof removeUserRole>>, TError,{userId: string;roleName: string}, TContext> => {

const mutationKey = ['removeUserRole'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof removeUserRole>>, {userId: string;roleName: string}> = (props) => {
          const {userId,roleName} = props ?? {};

          return  removeUserRole(userId,roleName,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RemoveUserRoleMutationResult = NonNullable<Awaited<ReturnType<typeof removeUserRole>>>

    export type RemoveUserRoleMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Remove a role from a managed user.
 */
export const useRemoveUserRole = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeUserRole>>, TError,{userId: string;roleName: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof removeUserRole>>,
        TError,
        {userId: string;roleName: string},
        TContext
      > => {
      return useMutation(getRemoveUserRoleMutationOptions(options), queryClient);
    }
