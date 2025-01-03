import userDataManager from "../ToBeMoved/CommonComponents/UserDataManager"
import { useEffect } from "react"

const UserBasedAccess = () => {
  const { UserLoggedIn, userData, GetUserData } = userDataManager()

  useEffect(() => {
    GetUserData()
  }, [])

  const UserRoleIncludes = (role: string) =>
    UserLoggedIn() && !!userData && userData["roles"].includes(role)

  const UserHasShipownerAccess = () => UserRoleIncludes("Shipowner")

  const UserHasGuestAccess = () => UserRoleIncludes("Guest")

  const UserHasAdminAccess = () => UserRoleIncludes("Administrator")

  const UserHasCruiseManagerAccess = () => UserRoleIncludes("CruiseManager")

  const CommonAccess = () => UserLoggedIn()

  const NotLoggedInAccess = () => !UserLoggedIn()

  const WaitingForUserData = () => UserLoggedIn() && !userData

  return {
    UserHasAdminAccess,
    UserHasShipownerAccess,
    UserHasCruiseManagerAccess,
    CommonAccess,
    NotLoggedInAccess,
    WaitingForUserData,
    UserHasGuestAccess,
  }
}
export default UserBasedAccess
