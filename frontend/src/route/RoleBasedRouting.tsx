import UserBasedAccess from "./UserBasedAccess"
import { Route, Routes } from "react-router-dom"
import { ShipownerRoute } from "./routes/ShipownerRoute"
import { AdministratorRoute } from "./routes/AdministratorRoute"
import { CruiseManagerRoute } from "./routes/CruiseManagerRoute"
import { CommonAccessRoute } from "./routes/CommonAccessRoute"
import { CommonRoute } from "./routes/CommonRoute"
import { NotLoggedRoute } from "./routes/NotLoggedRoute"
import { WaitingForUserDataRoute } from "./routes/WaitingForUserDataRoute"
import { GuestRoute } from "./routes/GuestRoute"

const RoleBasedRouting = () => {
  const {
    UserHasGuestAccess,
    UserHasAdminAccess,
    UserHasShipownerAccess,
    UserHasCruiseManagerAccess,
    CommonAccess,
    NotLoggedInAccess,
    WaitingForUserData,
  } = UserBasedAccess()

  return (
    <Routes>
      {UserHasGuestAccess() && <Route> {GuestRoute()} </Route>}
      {UserHasShipownerAccess() && <Route> {ShipownerRoute()} </Route>}
      {UserHasAdminAccess() && <Route> {AdministratorRoute()} </Route>}
      {UserHasCruiseManagerAccess() && <Route> {CruiseManagerRoute()}</Route>}
      {CommonAccess() && <Route> {CommonAccessRoute()} </Route>}
      {NotLoggedInAccess() && <Route> {NotLoggedRoute()} </Route>}
      {WaitingForUserData() && <Route> {WaitingForUserDataRoute()} </Route>}
      <Route> {CommonRoute()} </Route>
    </Routes>
  )
}
export default RoleBasedRouting
