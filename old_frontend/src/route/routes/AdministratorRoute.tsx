import { Route } from "react-router-dom"
import { Path } from "../../ToBeMoved/Tools/Path"
import FormPage from "@app/pages/FormPage/FormPage"
import ManageUsersPage from "@app/pages/ManageUsersPage/ManageUsersPage"
import AdminPanel from "@app/pages/HomePage/Admin/AdminPanel"
import CruiseApplicationsPage from "@app/pages/CruiseApplicationsPage/CruiseApplicationsPage"
import CruiseApplicationDetailsPage from "@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage"
import CruisesPage from "@app/pages/CruisesPage/CruisesPage"
import CruiseFormPage from "@app/pages/CruiseFormPage/CruiseFormPage"
import MyPublicationsPage from "@app/pages/MyPublications/MyPublicationsPage"
import CruiseEffectsPage from "@app/pages/CruiseEffects/CruiseEffectsPage"

export const AdministratorRoute = () => {
  return (
    <>
      {/*<Route path={Path.SavedApplications} element={<SavedFormPage />} />*/}
      {/*<Route path={Path.NewForm} element={<NewFormPage />} />*/}
      <Route path={Path.Form} element={<FormPage />} />
      <Route path={Path.ManageUsers} element={<ManageUsersPage />} />
      <Route path={Path.Any} element={<AdminPanel />} />
      {/*<Route path={Path.Messages} element={<MessagesPage />} />*/}
      <Route path={Path.CruiseApplications} element={<CruiseApplicationsPage />} />
      <Route path={Path.CruiseApplicationDetails} element={<CruiseApplicationDetailsPage />} />
      <Route path={Path.Cruises} element={<CruisesPage />} />
      <Route path={Path.CruiseForm} element={<CruiseFormPage />} />
      <Route path={Path.MyPublications} element={<MyPublicationsPage />} />
      <Route path={Path.CruiseEffects} element={<CruiseEffectsPage />} />
    </>
  )
}
