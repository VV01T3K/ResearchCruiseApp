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

import {
  CruiseStatus
} from '../../schemas';
import type {
  AutoPlanResponse,
  BlockadeResponse,
  CruiseResponse,
  ExportResponse,
  RevisionResponse
} from '../../schemas';


export const getGetCruisesResponseMock = (): CruiseResponse[] => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), number: faker.string.alpha({length: {min: 10, max: 20}}), startDate: faker.string.alpha({length: {min: 10, max: 20}}), endDate: faker.string.alpha({length: {min: 10, max: 20}}), mainManager: {id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), firstName: faker.string.alpha({length: {min: 10, max: 20}}), lastName: faker.string.alpha({length: {min: 10, max: 20}})}, deputyManager: {id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), firstName: faker.string.alpha({length: {min: 10, max: 20}}), lastName: faker.string.alpha({length: {min: 10, max: 20}})}, applications: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), cruiseManagerId: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), deputyManagerId: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), number: faker.string.alpha({length: {min: 10, max: 20}}), points: faker.string.alpha({length: {min: 10, max: 20}})})), status: faker.helpers.arrayElement(Object.values(CruiseStatus)), title: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), shipUnavailable: faker.datatype.boolean(), revision: faker.string.alpha({length: {min: 10, max: 20}})})))

export const getGetCruiseResponseMock = (overrideResponse: Partial<Extract<CruiseResponse, object>> = {}): CruiseResponse => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), number: faker.string.alpha({length: {min: 10, max: 20}}), startDate: faker.string.alpha({length: {min: 10, max: 20}}), endDate: faker.string.alpha({length: {min: 10, max: 20}}), mainManager: {id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), firstName: faker.string.alpha({length: {min: 10, max: 20}}), lastName: faker.string.alpha({length: {min: 10, max: 20}})}, deputyManager: {id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), firstName: faker.string.alpha({length: {min: 10, max: 20}}), lastName: faker.string.alpha({length: {min: 10, max: 20}})}, applications: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), cruiseManagerId: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), deputyManagerId: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), number: faker.string.alpha({length: {min: 10, max: 20}}), points: faker.string.alpha({length: {min: 10, max: 20}})})), status: faker.helpers.arrayElement(Object.values(CruiseStatus)), title: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), shipUnavailable: faker.datatype.boolean(), revision: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getUpdateCruiseResponseMock = (overrideResponse: Partial<Extract<RevisionResponse, object>> = {}): RevisionResponse => ({revision: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getAutoPlanCruisesResponseMock = (overrideResponse: Partial<Extract<AutoPlanResponse, object>> = {}): AutoPlanResponse => ({plannedCount: faker.number.int(), skipped: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({applicationId: faker.helpers.fromRegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"), applicationNumber: faker.string.alpha({length: {min: 10, max: 20}}), reason: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getGetCruiseBlockadesResponseMock = (): BlockadeResponse[] => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({startDate: faker.date.past().toISOString().slice(0, 19) + 'Z', endDate: faker.date.past().toISOString().slice(0, 19) + 'Z', title: faker.string.alpha({length: {min: 10, max: 20}})})))

export const getExportCruisesResponseMock = (overrideResponse: Partial<Extract<ExportResponse, object>> = {}): ExportResponse => ({name: faker.string.alpha({length: {min: 10, max: 20}}), content: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})


export const getGetCruisesMockHandler = (overrideResponse?: CruiseResponse[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CruiseResponse[]> | CruiseResponse[]), options?: RequestHandlerOptions) => {
  return http.get('*/v2/cruises', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetCruisesResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCreateCruiseMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.post('*/v2/cruises', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 201
      })
  }, options)
}

export const getGetCruiseMockHandler = (overrideResponse?: CruiseResponse | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CruiseResponse> | CruiseResponse), options?: RequestHandlerOptions) => {
  return http.get('*/v2/cruises/:cruiseId', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetCruiseResponseMock(),
      { status: 200
      })
  }, options)
}

export const getUpdateCruiseMockHandler = (overrideResponse?: RevisionResponse | ((info: Parameters<Parameters<typeof http.patch>[1]>[0]) => Promise<RevisionResponse> | RevisionResponse), options?: RequestHandlerOptions) => {
  return http.patch('*/v2/cruises/:cruiseId', async (info: Parameters<Parameters<typeof http.patch>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getUpdateCruiseResponseMock(),
      { status: 200
      })
  }, options)
}

export const getDeleteCruiseMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.delete('*/v2/cruises/:cruiseId', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getConfirmCruiseMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/v2/cruises/:cruiseId/confirmation', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getRemoveCruiseConfirmationMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.delete('*/v2/cruises/:cruiseId/confirmation', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getCompleteCruiseMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.put('*/v2/cruises/:cruiseId/completion', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 204
      })
  }, options)
}

export const getAutoPlanCruisesMockHandler = (overrideResponse?: AutoPlanResponse | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<AutoPlanResponse> | AutoPlanResponse), options?: RequestHandlerOptions) => {
  return http.post('*/v2/cruises/auto-plan', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getAutoPlanCruisesResponseMock(),
      { status: 200
      })
  }, options)
}

export const getGetCruiseBlockadesMockHandler = (overrideResponse?: BlockadeResponse[] | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<BlockadeResponse[]> | BlockadeResponse[]), options?: RequestHandlerOptions) => {
  return http.get('*/v2/cruises/blockades', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getGetCruiseBlockadesResponseMock(),
      { status: 200
      })
  }, options)
}

export const getExportCruisesMockHandler = (overrideResponse?: ExportResponse | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ExportResponse> | ExportResponse), options?: RequestHandlerOptions) => {
  return http.get('*/v2/cruises/export', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {


    return HttpResponse.json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getExportCruisesResponseMock(),
      { status: 200
      })
  }, options)
}
export const getCruisesMock = () => [
  getGetCruisesMockHandler(),
  getCreateCruiseMockHandler(),
  getGetCruiseMockHandler(),
  getUpdateCruiseMockHandler(),
  getDeleteCruiseMockHandler(),
  getConfirmCruiseMockHandler(),
  getRemoveCruiseConfirmationMockHandler(),
  getCompleteCruiseMockHandler(),
  getAutoPlanCruisesMockHandler(),
  getGetCruiseBlockadesMockHandler(),
  getExportCruisesMockHandler()
]
