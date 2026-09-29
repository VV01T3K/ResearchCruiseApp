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
  RegisterAccountRequest,
  RequestPasswordResetRequest,
  ResendConfirmationEmailRequest,
  ResetPasswordRequest,
  TokenResponse
} from '../schemas';

import { customFetch } from '../../client/custom-fetch.ts';
import type { ErrorType } from '../../client/custom-fetch.ts';


type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getLoginUrl = () => {




  return `/v2/auth/login`
}

/**
 * @summary Sign in with an account.
 */
export const login = async (loginRequest: LoginRequest, options?: Parameters<typeof customFetch>[1]): Promise<TokenResponse> => {

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
return customFetch<TokenResponse>(getLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(loginRequest)
  }
);}





export const getLoginMutationKey = () => ['login'] as const;

export const getLoginMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,LoginMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,LoginMutationVariables, TContext> => {

const mutationKey = getLoginMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof login>>, LoginMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  login(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>
    export type LoginMutationBody = LoginRequest
    export type LoginMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>
    export type LoginMutationVariables = {data: LoginRequest}

    /**
 * @summary Sign in with an account.
 */
export const useLogin = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,LoginMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof login>>,
        TError,
        LoginMutationVariables,
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
export const refreshTokens = async ( options?: Parameters<typeof customFetch>[1]): Promise<TokenResponse> => {

  return customFetch<TokenResponse>(getRefreshTokensUrl(),
  {
    ...options,
    method: 'POST'


  }
);}



export const getLogoutUrl = () => {




  return `/v2/auth/logout`
}

/**
 * @summary Revoke the current refresh session.
 */
export const logout = async ( options?: Parameters<typeof customFetch>[1]): Promise<void> => {

  return customFetch<void>(getLogoutUrl(),
  {
    ...options,
    method: 'POST'


  }
);}





export const getLogoutMutationKey = () => ['logout'] as const;

export const getLogoutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext> => {

const mutationKey = getLogoutMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof logout>>, void> = () => {


          return  logout(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>

    export type LogoutMutationError = ErrorType<unknown>


    /**
 * @summary Revoke the current refresh session.
 */
export const useLogout = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof logout>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getLogoutMutationOptions(options), queryClient);
    }
    export const getRegisterAccountUrl = () => {




  return `/v2/auth/register`
}

/**
 * @summary Register a new account.
 */
export const registerAccount = async (registerAccountRequest: RegisterAccountRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getRegisterAccountUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(registerAccountRequest)
  }
);}





export const getRegisterAccountMutationKey = () => ['registerAccount'] as const;

export const getRegisterAccountMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError,RegisterAccountMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError,RegisterAccountMutationVariables, TContext> => {

const mutationKey = getRegisterAccountMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof registerAccount>>, RegisterAccountMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  registerAccount(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RegisterAccountMutationResult = NonNullable<Awaited<ReturnType<typeof registerAccount>>>
    export type RegisterAccountMutationBody = RegisterAccountRequest
    export type RegisterAccountMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>
    export type RegisterAccountMutationVariables = {data: RegisterAccountRequest}

    /**
 * @summary Register a new account.
 */
export const useRegisterAccount = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError,RegisterAccountMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof registerAccount>>,
        TError,
        RegisterAccountMutationVariables,
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
export const confirmEmail = async (params: ConfirmEmailParams, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
export const resendConfirmationEmail = async (resendConfirmationEmailRequest: ResendConfirmationEmailRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getResendConfirmationEmailUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(resendConfirmationEmailRequest)
  }
);}





export const getResendConfirmationEmailMutationKey = () => ['resendConfirmationEmail'] as const;

export const getResendConfirmationEmailMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resendConfirmationEmail>>, TError,ResendConfirmationEmailMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof resendConfirmationEmail>>, TError,ResendConfirmationEmailMutationVariables, TContext> => {

const mutationKey = getResendConfirmationEmailMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof resendConfirmationEmail>>, ResendConfirmationEmailMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  resendConfirmationEmail(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ResendConfirmationEmailMutationResult = NonNullable<Awaited<ReturnType<typeof resendConfirmationEmail>>>
    export type ResendConfirmationEmailMutationBody = ResendConfirmationEmailRequest
    export type ResendConfirmationEmailMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>
    export type ResendConfirmationEmailMutationVariables = {data: ResendConfirmationEmailRequest}

    /**
 * @summary Resend an account confirmation email.
 */
export const useResendConfirmationEmail = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resendConfirmationEmail>>, TError,ResendConfirmationEmailMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof resendConfirmationEmail>>,
        TError,
        ResendConfirmationEmailMutationVariables,
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
export const requestPasswordReset = async (requestPasswordResetRequest: RequestPasswordResetRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getRequestPasswordResetUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(requestPasswordResetRequest)
  }
);}





export const getRequestPasswordResetMutationKey = () => ['requestPasswordReset'] as const;

export const getRequestPasswordResetMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof requestPasswordReset>>, TError,RequestPasswordResetMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof requestPasswordReset>>, TError,RequestPasswordResetMutationVariables, TContext> => {

const mutationKey = getRequestPasswordResetMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof requestPasswordReset>>, RequestPasswordResetMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  requestPasswordReset(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RequestPasswordResetMutationResult = NonNullable<Awaited<ReturnType<typeof requestPasswordReset>>>
    export type RequestPasswordResetMutationBody = RequestPasswordResetRequest
    export type RequestPasswordResetMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>
    export type RequestPasswordResetMutationVariables = {data: RequestPasswordResetRequest}

    /**
 * @summary Request a password reset email.
 */
export const useRequestPasswordReset = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof requestPasswordReset>>, TError,RequestPasswordResetMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof requestPasswordReset>>,
        TError,
        RequestPasswordResetMutationVariables,
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
export const resetPassword = async (resetPasswordRequest: ResetPasswordRequest, options?: Parameters<typeof customFetch>[1]): Promise<void> => {

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
return customFetch<void>(getResetPasswordUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(options?.headers) },
    body: JSON.stringify(resetPasswordRequest)
  }
);}





export const getResetPasswordMutationKey = () => ['resetPassword'] as const;

export const getResetPasswordMutationOptions = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError,ResetPasswordMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError,ResetPasswordMutationVariables, TContext> => {

const mutationKey = getResetPasswordMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof resetPassword>>, ResetPasswordMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  resetPassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ResetPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof resetPassword>>>
    export type ResetPasswordMutationBody = ResetPasswordRequest
    export type ResetPasswordMutationError = ErrorType<HttpValidationProblemDetails | ProblemDetails>
    export type ResetPasswordMutationVariables = {data: ResetPasswordRequest}

    /**
 * @summary Reset an account password.
 */
export const useResetPassword = <TError = ErrorType<HttpValidationProblemDetails | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError,ResetPasswordMutationVariables, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof resetPassword>>,
        TError,
        ResetPasswordMutationVariables,
        TContext
      > => {
      return useMutation(getResetPasswordMutationOptions(options), queryClient);
    }
