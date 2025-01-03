import Api from "../Api"
import { RegisterData } from "RegisterData"
import { ForgotPasswordData } from "ForgotPasswordData"
import { ResetPasswordData } from "ResetPasswordData"
import { UserData } from "User/UserData"

const post = (url: string, data: any, raw?: boolean) => Api.post(url, data, { raw: raw })

// TODO : Change to /api
export const registerUser = (data: RegisterData) =>
  post("/account/register", data, true).then(
    (response: { status: number; data: any }) => response?.data
  )

// TODO : Change to /api
export const forgotPassword = (data: ForgotPasswordData) =>
  post("/account/forgotPassword", data, true)

// TODO : Change to /api
export const resetPassword = (data: ResetPasswordData) => post("/account/passwordReset", data, true)

export const addCruise = (data: any) => post(`/api/Cruises`, data)

// TODO : Change to /api
export const loginUser = (credentials: any) => post("/account/login", credentials, true)

// TODO : Change to /api
export const addUser = (userData: any) => post("/users", userData, true)

export const addCruiseApplication = (data: any, isDraft: boolean = false) =>
  post(`/api/CruiseApplications?isDraft=${isDraft}`, data)

// TODO : Change to /api
export const requestEmail = (user: UserData) =>
  post("/Account/emailConfirmationRequest", { email: user.email })
