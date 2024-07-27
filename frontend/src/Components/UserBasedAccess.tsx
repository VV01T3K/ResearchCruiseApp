import userDataManager from "./CommonComponents/UserDataManager";

const UserBasedAccess = () => {
    const {UserLoggedIn, userData} = userDataManager()
    const UserRoleIncludes = (role: string) => {
        return UserLoggedIn() && userData && userData!["roles"].includes(role)
    }
    const UserHasShipownerAccess = () => {
        if (UserRoleIncludes("Shipowner"))
            return true
        return false
    }

    const UserHasAdminAccess = () => {
        if (UserRoleIncludes("Administrator"))
            return true
        return false
    }

    const UserHasCruiseManagerAccess = () => {
        if (UserRoleIncludes("CruiseManager"))
            return true
        return false
    }

    const CommonAccess = () => {
        return UserLoggedIn();
    }

    const NotLoggedInAccess = () => {
        return !UserLoggedIn();
    }

    const WaitingForUserData = () => {
        return UserLoggedIn() && !userData
    }

    return {UserHasAdminAccess, UserHasShipownerAccess,
        UserHasCruiseManagerAccess, CommonAccess, NotLoggedInAccess, WaitingForUserData}
}
export default UserBasedAccess