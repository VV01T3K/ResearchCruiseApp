import {
  faker
} from '@faker-js/faker';

import {
  HttpResponse,
  http
} from 'msw';
import type {
  RequestHandlerOptions
} from 'msw';

import type {
  TokenResponse
} from '../../schemas';


export const getLoginResponseMock = (overrideResponse: Partial<Extract<TokenResponse, object>> = {}): TokenResponse => ({accessToken: faker.string.alpha({length: {min: 10, max: 20}}), accessTokenExpirationDate: faker.date.past().toISOString().slice(0, 19) + 'Z', refreshTokenExpirationDate: faker.date.past().toISOString().slice(0, 19) + 'Z', ...overrideResponse})

export const getRefreshTokensResponseMock = (overrideResponse: Partial<Extract<TokenResponse, object>> = {}): TokenResponse => ({accessToken: faker.string.alpha({length: {min: 10, max: 20}}), accessTokenExpirationDate: faker.date.past().toISOString().slice(0, 19) + 'Z', refreshTokenExpirationDate: faker.date.past().toISOString().slice(0, 19) + 'Z', ...overrideResponse})


export const getLoginMockHandler = (overrideResponse?: TokenResponse | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<TokenResponse> | TokenResponse), options?: RequestHandlerOptions) => {
  return http.post('*/v2/auth/login', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoginResponseMock(),
      { status: 200
      })
  }, options)
}

export const getRefreshTokensMockHandler = (overrideResponse?: TokenResponse | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<TokenResponse> | TokenResponse), options?: RequestHandlerOptions) => {
  return http.post('*/v2/auth/refresh', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getRefreshTokensResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLogoutMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/auth/logout', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getRegisterAccountMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/auth/register', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 201
      })
  }, options)
}

export const getConfirmEmailMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/v2/auth/confirm-email', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getResendConfirmationEmailMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/auth/resend-confirmation-email', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getRequestPasswordResetMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/auth/password-reset-request', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getResetPasswordMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/auth/password-reset', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}
export const getAuthMock = () => [
  getLoginMockHandler(),
  getRefreshTokensMockHandler(),
  getLogoutMockHandler(),
  getRegisterAccountMockHandler(),
  getConfirmEmailMockHandler(),
  getResendConfirmationEmailMockHandler(),
  getRequestPasswordResetMockHandler(),
  getResetPasswordMockHandler()
]
