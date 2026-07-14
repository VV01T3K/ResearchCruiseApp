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
  ApplicationCruiseResponse,
  ApplicationDecisionRequest,
  ApplicationResponse,
  CruiseApplicationEvaluation,
  CruiseApplicationSummary,
  FormAFields,
  FormAOptions,
  FormAWriteRequest,
  FormBFields,
  FormBOptions,
  FormBWriteRequest,
  FormCFields,
  FormCWriteRequest,
  GetApplicationSupervisorReviewParams,
  ProblemDetails,
  SupervisorDecisionRequest,
  SupervisorReviewResponse
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

export const getGetApplicationsUrl = () => {




  return `/v2/applications`
}

/**
 * @summary Get visible applications.
 */
export const getApplications = async ( options?: RequestInit): Promise<ApplicationResponse[]> => {

  return customFetch<ApplicationResponse[]>(getGetApplicationsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationsQueryKey = () => {
    return [
    'v2','applications'
    ] as const;
    }


export const getGetApplicationsSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplications>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplications>>> = ({ signal }) => getApplications({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplications>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationsSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplications>>>
export type GetApplicationsSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationsSuspense<TData = Awaited<ReturnType<typeof getApplications>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationsSuspense<TData = Awaited<ReturnType<typeof getApplications>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationsSuspense<TData = Awaited<ReturnType<typeof getApplications>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get visible applications.
 */

export function useGetApplicationsSuspense<TData = Awaited<ReturnType<typeof getApplications>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplications>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationsSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getCreateApplicationUrl = () => {




  return `/v2/applications`
}

/**
 * @summary Create an application from Form A.
 */
export const createApplication = async (formAWriteRequest: FormAWriteRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCreateApplicationUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(formAWriteRequest)
  }
);}





export const getCreateApplicationMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError,{data: FormAWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError,{data: FormAWriteRequest}, TContext> => {

const mutationKey = ['createApplication'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createApplication>>, {data: FormAWriteRequest}> = (props) => {
          const {data} = props ?? {};

          return  createApplication(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateApplicationMutationResult = NonNullable<Awaited<ReturnType<typeof createApplication>>>
    export type CreateApplicationMutationBody = FormAWriteRequest
    export type CreateApplicationMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Create an application from Form A.
 */
export const useCreateApplication = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError,{data: FormAWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createApplication>>,
        TError,
        {data: FormAWriteRequest},
        TContext
      > => {
      return useMutation(getCreateApplicationMutationOptions(options), queryClient);
    }
    export const getGetApplicationUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}`
}

/**
 * @summary Get one visible application.
 */
export const getApplication = async (applicationId: string, options?: RequestInit): Promise<ApplicationResponse> => {

  return customFetch<ApplicationResponse>(getGetApplicationUrl(applicationId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationQueryKey = (applicationId: string,) => {
    return [
    'v2','applications',applicationId
    ] as const;
    }


export const getGetApplicationSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplication>>, TError = ErrorType<ProblemDetails>>(applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationQueryKey(applicationId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplication>>> = ({ signal }) => getApplication(applicationId, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplication>>>
export type GetApplicationSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationSuspense<TData = Awaited<ReturnType<typeof getApplication>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationSuspense<TData = Awaited<ReturnType<typeof getApplication>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationSuspense<TData = Awaited<ReturnType<typeof getApplication>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get one visible application.
 */

export function useGetApplicationSuspense<TData = Awaited<ReturnType<typeof getApplication>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationSuspenseQueryOptions(applicationId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getGetApplicationCruiseUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/cruise`
}

/**
 * @summary Get the visible cruise linked to an application.
 */
export const getApplicationCruise = async (applicationId: string, options?: RequestInit): Promise<ApplicationCruiseResponse> => {

  return customFetch<ApplicationCruiseResponse>(getGetApplicationCruiseUrl(applicationId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationCruiseQueryKey = (applicationId: string,) => {
    return [
    'v2','applications',applicationId,'cruise'
    ] as const;
    }


export const getGetApplicationCruiseSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationCruise>>, TError = ErrorType<ProblemDetails>>(applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationCruiseQueryKey(applicationId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationCruise>>> = ({ signal }) => getApplicationCruise(applicationId, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationCruise>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationCruiseSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationCruise>>>
export type GetApplicationCruiseSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationCruiseSuspense<TData = Awaited<ReturnType<typeof getApplicationCruise>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationCruiseSuspense<TData = Awaited<ReturnType<typeof getApplicationCruise>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationCruiseSuspense<TData = Awaited<ReturnType<typeof getApplicationCruise>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get the visible cruise linked to an application.
 */

export function useGetApplicationCruiseSuspense<TData = Awaited<ReturnType<typeof getApplicationCruise>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationCruise>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationCruiseSuspenseQueryOptions(applicationId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getGetApplicationEvaluationUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/evaluation`
}

/**
 * @summary Get application evaluation details.
 */
export const getApplicationEvaluation = async (applicationId: string, options?: RequestInit): Promise<CruiseApplicationEvaluation> => {

  return customFetch<CruiseApplicationEvaluation>(getGetApplicationEvaluationUrl(applicationId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationEvaluationQueryKey = (applicationId: string,) => {
    return [
    'v2','applications',applicationId,'evaluation'
    ] as const;
    }


export const getGetApplicationEvaluationSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationEvaluation>>, TError = ErrorType<ProblemDetails>>(applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationEvaluation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationEvaluationQueryKey(applicationId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationEvaluation>>> = ({ signal }) => getApplicationEvaluation(applicationId, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationEvaluation>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationEvaluationSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationEvaluation>>>
export type GetApplicationEvaluationSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationEvaluationSuspense<TData = Awaited<ReturnType<typeof getApplicationEvaluation>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationEvaluation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationEvaluationSuspense<TData = Awaited<ReturnType<typeof getApplicationEvaluation>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationEvaluation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationEvaluationSuspense<TData = Awaited<ReturnType<typeof getApplicationEvaluation>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationEvaluation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get application evaluation details.
 */

export function useGetApplicationEvaluationSuspense<TData = Awaited<ReturnType<typeof getApplicationEvaluation>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationEvaluation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationEvaluationSuspenseQueryOptions(applicationId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getUpdateApplicationDecisionUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/decision`
}

/**
 * @summary Accept or reject an application.
 */
export const updateApplicationDecision = async (applicationId: string,
    applicationDecisionRequest: ApplicationDecisionRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUpdateApplicationDecisionUrl(applicationId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(applicationDecisionRequest)
  }
);}





export const getUpdateApplicationDecisionMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(queryClient: QueryClient, options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationDecision>>, TError,{applicationId: string;data: ApplicationDecisionRequest}, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateApplicationDecision>>, TError,{applicationId: string;data: ApplicationDecisionRequest}, TContext> => {

const mutationKey = ['updateApplicationDecision'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateApplicationDecision>>, {applicationId: string;data: ApplicationDecisionRequest}> = (props) => {
          const {applicationId,data} = props ?? {};

          return  updateApplicationDecision(applicationId,data,requestOptions)
        }

  const onSuccess = (data: Awaited<ReturnType<typeof updateApplicationDecision>>, variables: {applicationId: string;data: ApplicationDecisionRequest}, onMutateResult: TContext, context: MutationFunctionContext) => {
        if (!options?.skipInvalidation) {
        queryClient.invalidateQueries({ queryKey: getGetApplicationQueryKey(variables.applicationId) });
        }
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      };




  return  { ...mutationOptions, mutationFn, onSuccess }}

    export type UpdateApplicationDecisionMutationResult = NonNullable<Awaited<ReturnType<typeof updateApplicationDecision>>>
    export type UpdateApplicationDecisionMutationBody = ApplicationDecisionRequest
    export type UpdateApplicationDecisionMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Accept or reject an application.
 */
export const useUpdateApplicationDecision = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationDecision>>, TError,{applicationId: string;data: ApplicationDecisionRequest}, TContext>, skipInvalidation?: boolean, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateApplicationDecision>>,
        TError,
        {applicationId: string;data: ApplicationDecisionRequest},
        TContext
      > => {
      const backupQueryClient = useQueryClient();
      return useMutation(getUpdateApplicationDecisionMutationOptions(queryClient ?? backupQueryClient, options), queryClient);
    }
    export const getGetApplicationsForCruisePlanningUrl = () => {




  return `/v2/applications/for-cruise-planning`
}

/**
 * @summary Get applications eligible for cruise planning.
 */
export const getApplicationsForCruisePlanning = async ( options?: RequestInit): Promise<CruiseApplicationSummary[]> => {

  return customFetch<CruiseApplicationSummary[]>(getGetApplicationsForCruisePlanningUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationsForCruisePlanningQueryKey = () => {
    return [
    'v2','applications','for-cruise-planning'
    ] as const;
    }


export const getGetApplicationsForCruisePlanningSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationsForCruisePlanningQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>> = ({ signal }) => getApplicationsForCruisePlanning({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationsForCruisePlanningSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>>
export type GetApplicationsForCruisePlanningSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationsForCruisePlanningSuspense<TData = Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationsForCruisePlanningSuspense<TData = Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationsForCruisePlanningSuspense<TData = Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get applications eligible for cruise planning.
 */

export function useGetApplicationsForCruisePlanningSuspense<TData = Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationsForCruisePlanning>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationsForCruisePlanningSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getGetApplicationFormAContextUrl = () => {




  return `/v2/applications/form-a/context`
}

/**
 * @summary Get authenticated Form A context.
 */
export const getApplicationFormAContext = async ( options?: RequestInit): Promise<FormAOptions> => {

  return customFetch<FormAOptions>(getGetApplicationFormAContextUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationFormAContextQueryKey = () => {
    return [
    'v2','applications','form-a','context'
    ] as const;
    }


export const getGetApplicationFormAContextSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationFormAContext>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormAContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationFormAContextQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationFormAContext>>> = ({ signal }) => getApplicationFormAContext({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormAContext>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationFormAContextSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationFormAContext>>>
export type GetApplicationFormAContextSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationFormAContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormAContext>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormAContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormAContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormAContext>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormAContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormAContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormAContext>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormAContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get authenticated Form A context.
 */

export function useGetApplicationFormAContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormAContext>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormAContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationFormAContextSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getGetApplicationFormBContextUrl = () => {




  return `/v2/applications/form-b/context`
}

/**
 * @summary Get authenticated Form B context.
 */
export const getApplicationFormBContext = async ( options?: RequestInit): Promise<FormBOptions> => {

  return customFetch<FormBOptions>(getGetApplicationFormBContextUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationFormBContextQueryKey = () => {
    return [
    'v2','applications','form-b','context'
    ] as const;
    }


export const getGetApplicationFormBContextSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationFormBContext>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormBContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationFormBContextQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationFormBContext>>> = ({ signal }) => getApplicationFormBContext({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormBContext>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationFormBContextSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationFormBContext>>>
export type GetApplicationFormBContextSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationFormBContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormBContext>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormBContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormBContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormBContext>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormBContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormBContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormBContext>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormBContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get authenticated Form B context.
 */

export function useGetApplicationFormBContextSuspense<TData = Awaited<ReturnType<typeof getApplicationFormBContext>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormBContext>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationFormBContextSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getGetApplicationFormAUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-a`
}

/**
 * @summary Get Form A.
 */
export const getApplicationFormA = async (applicationId: string, options?: RequestInit): Promise<FormAFields> => {

  return customFetch<FormAFields>(getGetApplicationFormAUrl(applicationId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationFormAQueryKey = (applicationId: string,) => {
    return [
    'v2','applications',applicationId,'form-a'
    ] as const;
    }


export const getGetApplicationFormASuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationFormA>>, TError = ErrorType<ProblemDetails>>(applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormA>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationFormAQueryKey(applicationId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationFormA>>> = ({ signal }) => getApplicationFormA(applicationId, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormA>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationFormASuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationFormA>>>
export type GetApplicationFormASuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationFormASuspense<TData = Awaited<ReturnType<typeof getApplicationFormA>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormA>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormASuspense<TData = Awaited<ReturnType<typeof getApplicationFormA>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormA>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormASuspense<TData = Awaited<ReturnType<typeof getApplicationFormA>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormA>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get Form A.
 */

export function useGetApplicationFormASuspense<TData = Awaited<ReturnType<typeof getApplicationFormA>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormA>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationFormASuspenseQueryOptions(applicationId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getUpdateApplicationFormAUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-a`
}

/**
 * @summary Update Form A.
 */
export const updateApplicationFormA = async (applicationId: string,
    formAWriteRequest: FormAWriteRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUpdateApplicationFormAUrl(applicationId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(formAWriteRequest)
  }
);}





export const getUpdateApplicationFormAMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormA>>, TError,{applicationId: string;data: FormAWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormA>>, TError,{applicationId: string;data: FormAWriteRequest}, TContext> => {

const mutationKey = ['updateApplicationFormA'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateApplicationFormA>>, {applicationId: string;data: FormAWriteRequest}> = (props) => {
          const {applicationId,data} = props ?? {};

          return  updateApplicationFormA(applicationId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateApplicationFormAMutationResult = NonNullable<Awaited<ReturnType<typeof updateApplicationFormA>>>
    export type UpdateApplicationFormAMutationBody = FormAWriteRequest
    export type UpdateApplicationFormAMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Update Form A.
 */
export const useUpdateApplicationFormA = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormA>>, TError,{applicationId: string;data: FormAWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateApplicationFormA>>,
        TError,
        {applicationId: string;data: FormAWriteRequest},
        TContext
      > => {
      return useMutation(getUpdateApplicationFormAMutationOptions(options), queryClient);
    }
    export const getGetApplicationFormBUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-b`
}

/**
 * @summary Get Form B.
 */
export const getApplicationFormB = async (applicationId: string, options?: RequestInit): Promise<FormBFields> => {

  return customFetch<FormBFields>(getGetApplicationFormBUrl(applicationId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationFormBQueryKey = (applicationId: string,) => {
    return [
    'v2','applications',applicationId,'form-b'
    ] as const;
    }


export const getGetApplicationFormBSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationFormB>>, TError = ErrorType<ProblemDetails>>(applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormB>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationFormBQueryKey(applicationId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationFormB>>> = ({ signal }) => getApplicationFormB(applicationId, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormB>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationFormBSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationFormB>>>
export type GetApplicationFormBSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationFormBSuspense<TData = Awaited<ReturnType<typeof getApplicationFormB>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormB>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormBSuspense<TData = Awaited<ReturnType<typeof getApplicationFormB>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormB>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormBSuspense<TData = Awaited<ReturnType<typeof getApplicationFormB>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormB>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get Form B.
 */

export function useGetApplicationFormBSuspense<TData = Awaited<ReturnType<typeof getApplicationFormB>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormB>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationFormBSuspenseQueryOptions(applicationId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getUpdateApplicationFormBUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-b`
}

/**
 * @summary Create or replace Form B.
 */
export const updateApplicationFormB = async (applicationId: string,
    formBWriteRequest: FormBWriteRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUpdateApplicationFormBUrl(applicationId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(formBWriteRequest)
  }
);}





export const getUpdateApplicationFormBMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormB>>, TError,{applicationId: string;data: FormBWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormB>>, TError,{applicationId: string;data: FormBWriteRequest}, TContext> => {

const mutationKey = ['updateApplicationFormB'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateApplicationFormB>>, {applicationId: string;data: FormBWriteRequest}> = (props) => {
          const {applicationId,data} = props ?? {};

          return  updateApplicationFormB(applicationId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateApplicationFormBMutationResult = NonNullable<Awaited<ReturnType<typeof updateApplicationFormB>>>
    export type UpdateApplicationFormBMutationBody = FormBWriteRequest
    export type UpdateApplicationFormBMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Create or replace Form B.
 */
export const useUpdateApplicationFormB = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormB>>, TError,{applicationId: string;data: FormBWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateApplicationFormB>>,
        TError,
        {applicationId: string;data: FormBWriteRequest},
        TContext
      > => {
      return useMutation(getUpdateApplicationFormBMutationOptions(options), queryClient);
    }
    export const getRefillApplicationFormBUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-b/refill`
}

/**
 * @summary Return Form B to editable state.
 */
export const refillApplicationFormB = async (applicationId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRefillApplicationFormBUrl(applicationId),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getRefillApplicationFormBMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof refillApplicationFormB>>, TError,{applicationId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof refillApplicationFormB>>, TError,{applicationId: string}, TContext> => {

const mutationKey = ['refillApplicationFormB'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof refillApplicationFormB>>, {applicationId: string}> = (props) => {
          const {applicationId} = props ?? {};

          return  refillApplicationFormB(applicationId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RefillApplicationFormBMutationResult = NonNullable<Awaited<ReturnType<typeof refillApplicationFormB>>>

    export type RefillApplicationFormBMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Return Form B to editable state.
 */
export const useRefillApplicationFormB = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof refillApplicationFormB>>, TError,{applicationId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof refillApplicationFormB>>,
        TError,
        {applicationId: string},
        TContext
      > => {
      return useMutation(getRefillApplicationFormBMutationOptions(options), queryClient);
    }
    export const getGetApplicationFormCUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-c`
}

/**
 * @summary Get Form C.
 */
export const getApplicationFormC = async (applicationId: string, options?: RequestInit): Promise<FormCFields> => {

  return customFetch<FormCFields>(getGetApplicationFormCUrl(applicationId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationFormCQueryKey = (applicationId: string,) => {
    return [
    'v2','applications',applicationId,'form-c'
    ] as const;
    }


export const getGetApplicationFormCSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationFormC>>, TError = ErrorType<ProblemDetails>>(applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormC>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationFormCQueryKey(applicationId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationFormC>>> = ({ signal }) => getApplicationFormC(applicationId, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormC>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationFormCSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationFormC>>>
export type GetApplicationFormCSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationFormCSuspense<TData = Awaited<ReturnType<typeof getApplicationFormC>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormC>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormCSuspense<TData = Awaited<ReturnType<typeof getApplicationFormC>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormC>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationFormCSuspense<TData = Awaited<ReturnType<typeof getApplicationFormC>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormC>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get Form C.
 */

export function useGetApplicationFormCSuspense<TData = Awaited<ReturnType<typeof getApplicationFormC>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationFormC>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationFormCSuspenseQueryOptions(applicationId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getUpdateApplicationFormCUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-c`
}

/**
 * @summary Create or replace Form C.
 */
export const updateApplicationFormC = async (applicationId: string,
    formCWriteRequest: FormCWriteRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUpdateApplicationFormCUrl(applicationId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(formCWriteRequest)
  }
);}





export const getUpdateApplicationFormCMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormC>>, TError,{applicationId: string;data: FormCWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormC>>, TError,{applicationId: string;data: FormCWriteRequest}, TContext> => {

const mutationKey = ['updateApplicationFormC'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateApplicationFormC>>, {applicationId: string;data: FormCWriteRequest}> = (props) => {
          const {applicationId,data} = props ?? {};

          return  updateApplicationFormC(applicationId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateApplicationFormCMutationResult = NonNullable<Awaited<ReturnType<typeof updateApplicationFormC>>>
    export type UpdateApplicationFormCMutationBody = FormCWriteRequest
    export type UpdateApplicationFormCMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Create or replace Form C.
 */
export const useUpdateApplicationFormC = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationFormC>>, TError,{applicationId: string;data: FormCWriteRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateApplicationFormC>>,
        TError,
        {applicationId: string;data: FormCWriteRequest},
        TContext
      > => {
      return useMutation(getUpdateApplicationFormCMutationOptions(options), queryClient);
    }
    export const getRefillApplicationFormCUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/form-c/refill`
}

/**
 * @summary Return Form C to editable state.
 */
export const refillApplicationFormC = async (applicationId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRefillApplicationFormCUrl(applicationId),
  {
    ...options,
    method: 'PUT'


  }
);}



export const getGetApplicationSupervisorReviewUrl = (applicationId: string,
    params: GetApplicationSupervisorReviewParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/v2/applications/${applicationId}/supervisor-review?${stringifiedParams}` : `/v2/applications/${applicationId}/supervisor-review`
}

/**
 * @summary Get the anonymous supervisor review view.
 */
export const getApplicationSupervisorReview = async (applicationId: string,
    params: GetApplicationSupervisorReviewParams, options?: RequestInit): Promise<SupervisorReviewResponse> => {

  return customFetch<SupervisorReviewResponse>(getGetApplicationSupervisorReviewUrl(applicationId,params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetApplicationSupervisorReviewQueryKey = (applicationId: string,
    params?: GetApplicationSupervisorReviewParams,) => {
    return [
    'v2','applications',applicationId,'supervisor-review', ...(params ? [params] : [])
    ] as const;
    }


export const getGetApplicationSupervisorReviewSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError = ErrorType<ProblemDetails>>(applicationId: string,
    params: GetApplicationSupervisorReviewParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApplicationSupervisorReviewQueryKey(applicationId,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApplicationSupervisorReview>>> = ({ signal }) => getApplicationSupervisorReview(applicationId,params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApplicationSupervisorReviewSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getApplicationSupervisorReview>>>
export type GetApplicationSupervisorReviewSuspenseQueryError = ErrorType<ProblemDetails>


export function useGetApplicationSupervisorReviewSuspense<TData = Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string,
    params: GetApplicationSupervisorReviewParams, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationSupervisorReviewSuspense<TData = Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string,
    params: GetApplicationSupervisorReviewParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApplicationSupervisorReviewSuspense<TData = Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string,
    params: GetApplicationSupervisorReviewParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get the anonymous supervisor review view.
 */

export function useGetApplicationSupervisorReviewSuspense<TData = Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError = ErrorType<ProblemDetails>>(
 applicationId: string,
    params: GetApplicationSupervisorReviewParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getApplicationSupervisorReview>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApplicationSupervisorReviewSuspenseQueryOptions(applicationId,params,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const getUpdateApplicationSupervisorReviewDecisionUrl = (applicationId: string,) => {




  return `/v2/applications/${applicationId}/supervisor-review/decision`
}

/**
 * @summary Accept or reject an application as the anonymous supervisor.
 */
export const updateApplicationSupervisorReviewDecision = async (applicationId: string,
    supervisorDecisionRequest: SupervisorDecisionRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUpdateApplicationSupervisorReviewDecisionUrl(applicationId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(supervisorDecisionRequest)
  }
);}





export const getUpdateApplicationSupervisorReviewDecisionMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationSupervisorReviewDecision>>, TError,{applicationId: string;data: SupervisorDecisionRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateApplicationSupervisorReviewDecision>>, TError,{applicationId: string;data: SupervisorDecisionRequest}, TContext> => {

const mutationKey = ['updateApplicationSupervisorReviewDecision'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateApplicationSupervisorReviewDecision>>, {applicationId: string;data: SupervisorDecisionRequest}> = (props) => {
          const {applicationId,data} = props ?? {};

          return  updateApplicationSupervisorReviewDecision(applicationId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateApplicationSupervisorReviewDecisionMutationResult = NonNullable<Awaited<ReturnType<typeof updateApplicationSupervisorReviewDecision>>>
    export type UpdateApplicationSupervisorReviewDecisionMutationBody = SupervisorDecisionRequest
    export type UpdateApplicationSupervisorReviewDecisionMutationError = ErrorType<ProblemDetails>

    /**
 * @summary Accept or reject an application as the anonymous supervisor.
 */
export const useUpdateApplicationSupervisorReviewDecision = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateApplicationSupervisorReviewDecision>>, TError,{applicationId: string;data: SupervisorDecisionRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateApplicationSupervisorReviewDecision>>,
        TError,
        {applicationId: string;data: SupervisorDecisionRequest},
        TContext
      > => {
      return useMutation(getUpdateApplicationSupervisorReviewDecisionMutationOptions(options), queryClient);
    }
