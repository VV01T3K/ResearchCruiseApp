import {
  useMutation
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query';

import type {
  ConfirmEmailParams,
  HttpValidationProblemDetails,
  LoginRequest,
  ProblemDetails,
  RefreshTokensRequest,
  RegisterAccountRequest,
  RequestPasswordResetRequest,
  ResendConfirmationEmailRequest,
  ResetPasswordRequest,
  TokenResponse
} from '../schemas';

import { customFetch } from '../../../lib/custom-fetch.ts';
import type { ErrorType } from '../../../lib/custom-fetch.ts';


type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getLoginUrl = () => {




  return `/v2/auth/login`
}

/**
 * @summary Sign in with an account.
 */
export const login = async (loginRequest: LoginRequest, options?: RequestInit): Promise<TokenResponse> => {

  return customFetch<TokenResponse>(getLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(loginRequest)
  }
);}





export const getLoginMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: LoginRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: LoginRequest}, TContext> => {

const mutationKey = ['login'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof login>>, {data: LoginRequest}> = (props) => {
          const {data} = props ?? {};

          return  login(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>
    export type LoginMutationBody = LoginRequest
    export type LoginMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>

    /**
 * @summary Sign in with an account.
 */
export const useLogin = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: LoginRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof login>>,
        TError,
        {data: LoginRequest},
        TContext
      > => {
      return useMutation(getLoginMutationOptions(options), queryClient);
    }
    export const getRefreshTokensUrl = () => {




  return `/v2/auth/refresh`
}

/**
 * @summary Refresh account tokens.
 */
export const refreshTokens = async (refreshTokensRequest: RefreshTokensRequest, options?: RequestInit): Promise<TokenResponse> => {

  return customFetch<TokenResponse>(getRefreshTokensUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(refreshTokensRequest)
  }
);}



export const getRegisterAccountUrl = () => {




  return `/v2/auth/register`
}

/**
 * @summary Register a new account.
 */
export const registerAccount = async (registerAccountRequest: RegisterAccountRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRegisterAccountUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(registerAccountRequest)
  }
);}





export const getRegisterAccountMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError,{data: RegisterAccountRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError,{data: RegisterAccountRequest}, TContext> => {

const mutationKey = ['registerAccount'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof registerAccount>>, {data: RegisterAccountRequest}> = (props) => {
          const {data} = props ?? {};

          return  registerAccount(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RegisterAccountMutationResult = NonNullable<Awaited<ReturnType<typeof registerAccount>>>
    export type RegisterAccountMutationBody = RegisterAccountRequest
    export type RegisterAccountMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>

    /**
 * @summary Register a new account.
 */
export const useRegisterAccount = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError,{data: RegisterAccountRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof registerAccount>>,
        TError,
        {data: RegisterAccountRequest},
        TContext
      > => {
      return useMutation(getRegisterAccountMutationOptions(options), queryClient);
    }
    export const getConfirmEmailUrl = (params: ConfirmEmailParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/v2/auth/confirm-email?${stringifiedParams}` : `/v2/auth/confirm-email`
}

/**
 * @summary Confirm an account email.
 */
export const confirmEmail = async (params: ConfirmEmailParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getConfirmEmailUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}



export const getResendConfirmationEmailUrl = () => {




  return `/v2/auth/resend-confirmation-email`
}

/**
 * @summary Resend an account confirmation email.
 */
export const resendConfirmationEmail = async (resendConfirmationEmailRequest: ResendConfirmationEmailRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getResendConfirmationEmailUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(resendConfirmationEmailRequest)
  }
);}





export const getResendConfirmationEmailMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resendConfirmationEmail>>, TError,{data: ResendConfirmationEmailRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof resendConfirmationEmail>>, TError,{data: ResendConfirmationEmailRequest}, TContext> => {

const mutationKey = ['resendConfirmationEmail'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof resendConfirmationEmail>>, {data: ResendConfirmationEmailRequest}> = (props) => {
          const {data} = props ?? {};

          return  resendConfirmationEmail(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ResendConfirmationEmailMutationResult = NonNullable<Awaited<ReturnType<typeof resendConfirmationEmail>>>
    export type ResendConfirmationEmailMutationBody = ResendConfirmationEmailRequest
    export type ResendConfirmationEmailMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>

    /**
 * @summary Resend an account confirmation email.
 */
export const useResendConfirmationEmail = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resendConfirmationEmail>>, TError,{data: ResendConfirmationEmailRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof resendConfirmationEmail>>,
        TError,
        {data: ResendConfirmationEmailRequest},
        TContext
      > => {
      return useMutation(getResendConfirmationEmailMutationOptions(options), queryClient);
    }
    export const getRequestPasswordResetUrl = () => {




  return `/v2/auth/password-reset-request`
}

/**
 * @summary Request a password reset email.
 */
export const requestPasswordReset = async (requestPasswordResetRequest: RequestPasswordResetRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRequestPasswordResetUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(requestPasswordResetRequest)
  }
);}





export const getRequestPasswordResetMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof requestPasswordReset>>, TError,{data: RequestPasswordResetRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof requestPasswordReset>>, TError,{data: RequestPasswordResetRequest}, TContext> => {

const mutationKey = ['requestPasswordReset'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof requestPasswordReset>>, {data: RequestPasswordResetRequest}> = (props) => {
          const {data} = props ?? {};

          return  requestPasswordReset(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RequestPasswordResetMutationResult = NonNullable<Awaited<ReturnType<typeof requestPasswordReset>>>
    export type RequestPasswordResetMutationBody = RequestPasswordResetRequest
    export type RequestPasswordResetMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>

    /**
 * @summary Request a password reset email.
 */
export const useRequestPasswordReset = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof requestPasswordReset>>, TError,{data: RequestPasswordResetRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof requestPasswordReset>>,
        TError,
        {data: RequestPasswordResetRequest},
        TContext
      > => {
      return useMutation(getRequestPasswordResetMutationOptions(options), queryClient);
    }
    export const getResetPasswordUrl = () => {




  return `/v2/auth/password-reset`
}

/**
 * @summary Reset an account password.
 */
export const resetPassword = async (resetPasswordRequest: ResetPasswordRequest, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getResetPasswordUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(resetPasswordRequest)
  }
);}





export const getResetPasswordMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError,{data: ResetPasswordRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError,{data: ResetPasswordRequest}, TContext> => {

const mutationKey = ['resetPassword'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof resetPassword>>, {data: ResetPasswordRequest}> = (props) => {
          const {data} = props ?? {};

          return  resetPassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ResetPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof resetPassword>>>
    export type ResetPasswordMutationBody = ResetPasswordRequest
    export type ResetPasswordMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>

    /**
 * @summary Reset an account password.
 */
export const useResetPassword = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError,{data: ResetPasswordRequest}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof resetPassword>>,
        TError,
        {data: ResetPasswordRequest},
        TContext
      > => {
      return useMutation(getResetPasswordMutationOptions(options), queryClient);
    }
