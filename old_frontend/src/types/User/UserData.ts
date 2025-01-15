export interface UserData {
  roles: string[]
  firstName: string
  lastName: string
  accepted: boolean
  email: string
  emailConfirmed: boolean
  id: string
  //Only for frontend purposes not exists in backend
  emailSent?: boolean
}
