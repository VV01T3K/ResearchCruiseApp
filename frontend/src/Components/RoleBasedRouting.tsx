import {Route, Routes} from "react-router-dom";
import NewFormPage from "./Legacy/NewFormPage/NewFormPage";
import ManageUsersPage from "./Pages/ManageUsersPage/ManageUsersPage";
import ShipOwnerPanel from "./Pages/HomePage/ShipOwnerPanel";
import {Path as Path} from "./Tools/Path";
import SavedFormPage from "./Pages/SavedFormsPage/SavedFormPage";
import FormPage from "./Pages/FormPage/FormPage";
import AdminPanel from "./Pages/HomePage/AdminPanel";
import MessagesPage from "./Legacy/MessagesPage/MessagesPage";
import CruisesPage from "./Pages/CruisesPage/CruisesPage";
import CruiseFormPage from "./Pages/CruiseFormPage/CruiseFormPage";
import ManagerPanel from "./Pages/HomePage/ManagerPanel";
import LogoutPage from "./Pages/LoginPage/LogoutPage";
import AccountPage from "./Pages/AccountPage/AccountPage";
import EmailConfirmPage from "./Pages/LoginPage/EmailConfirmPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import React from "react";
import ServerErrorPage from "./Pages/ServerErrorPage";
import UserBasedAccess from "./UserBasedAccess";
import WaitingPage from "./Pages/WaitingPage";
import RegisterPage from "./Pages/LoginPage/RegisterPage";
import ResetPasswordPage from "./Pages/LoginPage/ResetPasswordPage";
import CruiseApplicationsPage from "./Pages/CruiseApplicationsPage/CruiseApplicationsPage";
import CruiseApplicationDetailsPage from "./Pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage";
import FormAForSupervisorPage from "./Pages/FormAForSupervisorPage";



const RoleBasedRouting = () => {

    const {UserHasAdminAccess, UserHasShipownerAccess,
        UserHasCruiseManagerAccess, CommonAccess, NotLoggedInAccess, WaitingForUserData
    } = UserBasedAccess()

    const ShipownerRoute = () => {
        return (
            <>
                <Route path="/NewForm" element={<NewFormPage />} />
                <Route path="/ManageUsers" element={<ManageUsersPage />} />
                <Route path="/*" element={<ShipOwnerPanel />} />
            </>
        )
    }

    const AdministratorRoute = () => {
        return (
            <>
                <Route path={Path.SavedApplications} element={<SavedFormPage />} />
                <Route path={Path.NewForm} element={<NewFormPage />} />
                <Route path={Path.Form} element={<FormPage />} />
                <Route path={Path.ManageUsers} element={<ManageUsersPage />} />
                <Route path={Path.Any} element={<AdminPanel />} />
                <Route path={Path.Messages} element={<MessagesPage />} />
                <Route path={Path.CruiseApplications} element={<CruiseApplicationsPage />} />
                <Route path={Path.CruiseApplicationDetails} element={<CruiseApplicationDetailsPage />} />
                <Route path={Path.Cruises} element={<CruisesPage />} />
                <Route path={Path.CruiseForm} element={<CruiseFormPage />} />
            </>
        )
    }

    const CruiseManagerRoute = () => {
        return (
            <>
                <Route path={Path.NewForm} element={<NewFormPage />} />
                <Route path={Path.Form} element={<FormPage />} />
                <Route path={Path.Any} element={<ManagerPanel />} />
            </>
        )
    }

    const CommonAccessRoute  = () => {
        return (
            <>
                <Route path={Path.ForcedLogout} element={<LogoutPage />} />
                <Route path={Path.AccountSettings} element={<AccountPage />} />

            </>
        )
    }

    const CommonRoute = () => {
        return (
            <>
                <Route path={Path.ServerError} element={<ServerErrorPage/>} />
                <Route path={Path.ConfirmEmail} element={<EmailConfirmPage />} />
            </>
        )
    }
    const NotLoggedRoute = () => {
        return (
            <>
                <Route path={Path.Any} element={<LoginPage />} />
                <Route path={Path.FormAForSupervisor} element={<FormAForSupervisorPage/>} />
                <Route path={Path.Form} element={<FormPage/>} />
                <Route path={Path.Register} element={<RegisterPage />} />
                <Route path={Path.ResetPassword} element={<ResetPasswordPage/>} />
                <Route path={Path.ForcedLogout} element={<LogoutPage />} />
            </>
        )
    }

    const WaitingForUserDataRoute = () => {
        return (
            <>
                <Route path={Path.Any} element={<WaitingPage label={"Wczytywanie danych"}/>} />
            </>
        )
    }

    return (
        <Routes>
            {UserHasShipownerAccess() &&  <Route> {ShipownerRoute()} </Route>}
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
