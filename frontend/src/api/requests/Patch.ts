import Api from "../Api"
import { AxiosRequestConfig } from "axios"
import { ChangePasswordData } from "ChangePasswordData"
import { Guid } from "Guid"
import { UserData } from "User/UserData"

const patch = (url: string, data: any, raw?: boolean) =>
  Api.patch(url, data, { raw: raw } as AxiosRequestConfig)

// TODO : Change to /api
export const changePassword = (data: ChangePasswordData) => patch("/account/password", data, true)

export const editCruise = (id: Guid, data: any) => patch(`/api/Cruises/${id}`, data)

// TODO : Change to /api
export const activateUser = (user: UserData) => Api.patch("/Users/unaccepted/" + user.id)

// TODO : Change to /api
export const deactivateUser = (user: UserData) => Api.patch("/Users/" + user.id + "/deactivate")

export const acceptBySupervisor = (
  cruiseApplicationId: Guid,
  supervisorCode: Guid,
  accept: string
) =>
  patch(
    `/api/CruiseApplications/${cruiseApplicationId}
    /supervisorAnswer?accept=${accept}&supervisorCode=${supervisorCode}`,
    null,
    true
  )

export const editEvaluation = (cruiseApplicationId: Guid, data: any) =>
  patch(`/api/CruiseApplications/${cruiseApplicationId}/evaluation`, data)

export const acceptApplication = (cruiseApplicationId: Guid, accept: string) =>
  patch(
    `/api/CruiseApplications/${cruiseApplicationId}
    /answer?accept=${accept}`,
    null,
    true
  )
