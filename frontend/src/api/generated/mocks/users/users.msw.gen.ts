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
  CruiseEffectResponse,
  CruiseManagerResponse,
  CurrentUserResponse,
  PublicationResponse,
  UserResponse
} from '../../schemas';


export const getGetCurrentUserResponseMock = (overrideResponse: Partial<Extract<CurrentUserResponse, object>> = {}): CurrentUserResponse => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), email: faker.string.alpha({length: {min: 10, max: 20}}), firstName: faker.string.alpha({length: {min: 10, max: 20}}), lastName: faker.string.alpha({length: {min: 10, max: 20}}), roles: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.string.alpha({length: {min: 10, max: 20}}))), emailConfirmed: faker.datatype.boolean(), accepted: faker.datatype.boolean(), ...overrideResponse})

export const getGetCurrentUserCruiseEffectsResponseMock = (): CruiseEffectResponse[] => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), userId: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), effect: {type: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), magazine: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), author: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), institution: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), date: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), startDate: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), endDate: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), financingAmount: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), financingApproved: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), securedAmount: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), ministerialPoints: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), done: faker.string.alpha({length: {min: 10, max: 20}}), publicationMinisterialPoints: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), managerConditionMet: faker.string.alpha({length: {min: 10, max: 20}}), deputyConditionMet: faker.string.alpha({length: {min: 10, max: 20}})}, points: faker.string.alpha({length: {min: 10, max: 20}}), cruiseApplicationId: faker.string.alpha({length: {min: 10, max: 20}})})))

export const getGetCurrentUserPublicationsResponseMock = (): PublicationResponse[] => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), category: faker.string.alpha({length: {min: 10, max: 20}}), doi: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), authors: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), title: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), magazine: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), year: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), ministerialPoints: faker.string.alpha({length: {min: 10, max: 20}})})))

export const getGetUsersResponseMock = (): UserResponse[] => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), email: faker.string.alpha({length: {min: 10, max: 20}}), firstName: faker.string.alpha({length: {min: 10, max: 20}}), lastName: faker.string.alpha({length: {min: 10, max: 20}}), roles: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.string.alpha({length: {min: 10, max: 20}}))), emailConfirmed: faker.datatype.boolean(), accepted: faker.datatype.boolean()})))

export const getGetAvailableCruiseManagersResponseMock = (): CruiseManagerResponse[] => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), email: faker.string.alpha({length: {min: 10, max: 20}}), firstName: faker.string.alpha({length: {min: 10, max: 20}}), lastName: faker.string.alpha({length: {min: 10, max: 20}})})))


export const getGetCurrentUserMockHandler = (overrideResponse?: CurrentUserResponse | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CurrentUserResponse> | CurrentUserResponse), options?: RequestHandlerOptions) => {
  return http.get('*/v2/users/me', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetCurrentUserResponseMock(),
      { status: 200
      })
  }, options)
}

export const getChangeCurrentUserPasswordMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.patch>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.patch('*/v2/users/me/password', async (info: Parameters<Parameters<typeof http.patch>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getGetCurrentUserCruiseEffectsMockHandler = (overrideResponse?: CruiseEffectResponse[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CruiseEffectResponse[]> | CruiseEffectResponse[]), options?: RequestHandlerOptions) => {
  return http.get('*/v2/users/me/cruise-effects', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetCurrentUserCruiseEffectsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getGetCurrentUserPublicationsMockHandler = (overrideResponse?: PublicationResponse[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<PublicationResponse[]> | PublicationResponse[]), options?: RequestHandlerOptions) => {
  return http.get('*/v2/users/me/publications', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetCurrentUserPublicationsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getDeleteAllCurrentUserPublicationsMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.delete('*/v2/users/me/publications', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getImportCurrentUserPublicationsMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/users/me/publications/import', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getDeleteCurrentUserPublicationMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.delete('*/v2/users/me/publications/:publicationId', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getGetUsersMockHandler = (overrideResponse?: UserResponse[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<UserResponse[]> | UserResponse[]), options?: RequestHandlerOptions) => {
  return http.get('*/v2/users', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetUsersResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCreateUserMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/users', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 201
      })
  }, options)
}

export const getGetAvailableCruiseManagersMockHandler = (overrideResponse?: CruiseManagerResponse[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CruiseManagerResponse[]> | CruiseManagerResponse[]), options?: RequestHandlerOptions) => {
  return http.get('*/v2/users/available-cruise-managers', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetAvailableCruiseManagersResponseMock(),
      { status: 200
      })
  }, options)
}

export const getUpdateUserMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.patch>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.patch('*/v2/users/:userId', async (info: Parameters<Parameters<typeof http.patch>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getDeleteUserMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.delete('*/v2/users/:userId', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getAcceptUserMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/v2/users/:userId/acceptance', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getDeactivateUserMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.delete('*/v2/users/:userId/acceptance', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getAddUserRoleMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/v2/users/:userId/roles/:roleName', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getRemoveUserRoleMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.delete('*/v2/users/:userId/roles/:roleName', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}
export const getUsersMock = () => [
  getGetCurrentUserMockHandler(),
  getChangeCurrentUserPasswordMockHandler(),
  getGetCurrentUserCruiseEffectsMockHandler(),
  getGetCurrentUserPublicationsMockHandler(),
  getDeleteAllCurrentUserPublicationsMockHandler(),
  getImportCurrentUserPublicationsMockHandler(),
  getDeleteCurrentUserPublicationMockHandler(),
  getGetUsersMockHandler(),
  getCreateUserMockHandler(),
  getGetAvailableCruiseManagersMockHandler(),
  getUpdateUserMockHandler(),
  getDeleteUserMockHandler(),
  getAcceptUserMockHandler(),
  getDeactivateUserMockHandler(),
  getAddUserRoleMockHandler(),
  getRemoveUserRoleMockHandler()
]
