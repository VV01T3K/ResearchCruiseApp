import { Route } from 'react-router-dom';
import { Path } from '../../ToBeMoved/Tools/Path';
import FormPage from '@app/pages/FormPage/FormPage';
import ManageUsersPage from '@app/pages/ManageUsersPage/ManageUsersPage';
import CruiseApplicationsPage from '@app/pages/CruiseApplicationsPage/CruiseApplicationsPage';
import CruiseApplicationDetailsPage from '@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage';
import CruisesPage from '@app/pages/CruisesPage/CruisesPage';
import CruiseFormPage from '@app/pages/CruiseFormPage/CruiseFormPage';
import ShipOwnerPanel from '@app/pages/HomePage/Shipowner/ShipOwnerPanel';
import GuestPanel from '@app/pages/HomePage/Guest/GuestPanel';
import AdminPanel from '@app/pages/HomePage/Admin/AdminPanel';
import ManagerPanel from '@app/pages/HomePage/Manager/ManagerPanel';
import HelpInformationPage from '@app/pages/HelpInformationPage/HelpInformationPage';

export const GuestRoute = () => {
    return (
        <>
            {/*<Route path={Path.Messages} element={<MessagesPage />} />*/}
            <Route path={Path.Form} element={<FormPage />} />
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
            <Route path={Path.Any} element={<GuestPanel />} />
        </>
    );
};