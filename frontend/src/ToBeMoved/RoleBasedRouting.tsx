import UserBasedAccess from './UserBasedAccess';
import { Route, Routes } from 'react-router-dom';
import { Path } from './Tools/Path';
import FormPage from '../app/pages/FormPage/FormPage';
import ManageUsersPage from '../app/pages/ManageUsersPage/ManageUsersPage';
import CruiseApplicationsPage from '../app/pages/CruiseApplicationsPage/CruiseApplicationsPage';
import CruiseApplicationDetailsPage from '../app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage';
import CruisesPage from '../app/pages/CruisesPage/CruisesPage';
import CruiseFormPage from '../app/pages/CruiseFormPage/CruiseFormPage';
import ShipOwnerPanel from '../app/pages/HomePage/Shipowner/ShipOwnerPanel';
import AdminPanel from '../app/pages/HomePage/Admin/AdminPanel';
import ManagerPanel from '../app/pages/HomePage/Manager/ManagerPanel';
import LogoutPage from '../app/pages/NotLoggedInPage/LogoutPage';
import AccountPage from '../app/pages/Account/AccountPage';
import ServerErrorPage from '../app/pages/ServerErrorPage';
import EmailConfirmPage from '../app/pages/NotLoggedInPage/EmailConfirmPage';
import LoginPage from '../app/pages/NotLoggedInPage/LoginPage/LoginPage';
import FormAForSupervisorPage from '../app/pages/FormAForSupervisorPage';
import RegisterPage from '../app/pages/NotLoggedInPage/RegisterPage/RegisterPage';
import ResetPasswordPage from '../app/pages/NotLoggedInPage/ResetPasswordPage/ResetPasswordPage';
import WaitingPage from '../app/pages/WaitingPage';
import PriorityInformationPage from '@app/pages/PriorityInformationPage/PriorityInformationPage';

const RoleBasedRouting = () => {
    const {
        UserHasAdminAccess,
        UserHasShipownerAccess,
        UserHasCruiseManagerAccess,
        CommonAccess,
        NotLoggedInAccess,
        WaitingForUserData,
    } = UserBasedAccess();

    const ShipownerRoute = () => {
        return (
            <>
                <Route path={Path.Form} element={<FormPage />} />
                <Route path={Path.ManageUsers} element={<ManageUsersPage />} />
                {/*<Route path={Path.Messages} element={<MessagesPage />} />*/}
                <Route
                    path={Path.CruiseApplications}
                    element={<CruiseApplicationsPage />}
                />
                <Route
                    path={Path.CruiseApplicationDetails}
                    element={<CruiseApplicationDetailsPage />}
                />
                <Route path={Path.Cruises} element={<CruisesPage />} />
                <Route path={Path.CruiseForm} element={<CruiseFormPage />} />
                <Route path={Path.Any} element={<ShipOwnerPanel />} />
            </>
        );
    };

    const AdministratorRoute = () => {
        return (
            <>
                {/*<Route path={Path.SavedApplications} element={<SavedFormPage />} />*/}
                {/*<Route path={Path.NewForm} element={<NewFormPage />} />*/}
                <Route path={Path.Form} element={<FormPage />} />
                <Route path={Path.ManageUsers} element={<ManageUsersPage />} />
                <Route path={Path.Any} element={<AdminPanel />} />
                {/*<Route path={Path.Messages} element={<MessagesPage />} />*/}
                <Route
                    path={Path.CruiseApplications}
                    element={<CruiseApplicationsPage />}
                />
                <Route
                    path={Path.CruiseApplicationDetails}
                    element={<CruiseApplicationDetailsPage />}
                />
                <Route path={Path.Cruises} element={<CruisesPage />} />
                <Route path={Path.CruiseForm} element={<CruiseFormPage />} />
            </>
        );
    };

    const CruiseManagerRoute = () => {
        return (
            <>
                {/*<Route path={Path.NewForm} element={<NewFormPage />} />*/}
                <Route path={Path.Form} element={<FormPage />} />
                <Route path={Path.Any} element={<ManagerPanel />} />
                <Route
                    path={Path.CruiseApplications}
                    element={<CruiseApplicationsPage />}
                />
                <Route
                    path={Path.CruiseApplicationDetails}
                    element={<CruiseApplicationDetailsPage />}
                />
                <Route path={Path.Cruises} element={<CruisesPage />} />
                <Route path={Path.CruiseForm} element={<CruiseFormPage />} />
            </>
        );
    };

    const CommonAccessRoute = () => {
        return (
            <>
                <Route path={Path.ForcedLogout} element={<LogoutPage />} />
                <Route path={Path.AccountSettings} element={<AccountPage />} />
                <Route path={Path.PriorityInformation} element={<PriorityInformationPage />} />
            </>
        );
    };

    const CommonRoute = () => {
        return (
            <>
                <Route path={Path.ServerError} element={<ServerErrorPage />} />
                <Route path={Path.ConfirmEmail} element={<EmailConfirmPage />} />
            </>
        );
    };
    const NotLoggedRoute = () => {
        return (
            <>
                <Route path={Path.Any} element={<LoginPage />} />
                <Route
                    path={Path.FormAForSupervisor}
                    element={<FormAForSupervisorPage />}
                />
                <Route path={Path.Form} element={<FormPage />} />
                <Route path={Path.Register} element={<RegisterPage />} />
                <Route path={Path.ResetPassword} element={<ResetPasswordPage />} />
                <Route path={Path.ForcedLogout} element={<LogoutPage />} />
            </>
        );
    };

    const WaitingForUserDataRoute = () => {
        return (
            <>
                <Route
                    path={Path.Any}
                    element={<WaitingPage label={'Wczytywanie danych'} />}
                />
            </>
        );
    };

    return (
        <Routes>
            {UserHasShipownerAccess() && <Route> {ShipownerRoute()} </Route>}
            {UserHasAdminAccess() && <Route> {AdministratorRoute()} </Route>}
            {UserHasCruiseManagerAccess() && <Route> {CruiseManagerRoute()}</Route>}
            {CommonAccess() && <Route> {CommonAccessRoute()} </Route>}
            {NotLoggedInAccess() && <Route> {NotLoggedRoute()} </Route>}
            {WaitingForUserData() && <Route> {WaitingForUserDataRoute()} </Route>}
            <Route> {CommonRoute()} </Route>
        </Routes>
    );
};
export default RoleBasedRouting;
