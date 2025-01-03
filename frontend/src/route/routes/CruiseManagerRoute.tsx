import { Route } from "react-router-dom"
import { Path } from "../../ToBeMoved/Tools/Path"
import FormPage from "@app/pages/FormPage/FormPage"
import ManagerPanel from "@app/pages/HomePage/Manager/ManagerPanel"
import CruiseApplicationsPage from "@app/pages/CruiseApplicationsPage/CruiseApplicationsPage"
import CruiseApplicationDetailsPage from "@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage"
import CruisesPage from "@app/pages/CruisesPage/CruisesPage"
import CruiseFormPage from "@app/pages/CruiseFormPage/CruiseFormPage"
import MyPublicationsPage from "@app/pages/MyPublications/MyPublicationsPage"
import CruiseEffectsPage from "@app/pages/CruiseEffects/CruiseEffectsPage"

export const CruiseManagerRoute = () => {
  return (
    <>
      {/*<Route path={Path.NewForm} element={<NewFormPage />} />*/}
      <Route path={Path.Form} element={<FormPage />} />
      <Route path={Path.Any} element={<ManagerPanel />} />
      <Route path={Path.CruiseApplications} element={<CruiseApplicationsPage />} />
      <Route path={Path.CruiseApplicationDetails} element={<CruiseApplicationDetailsPage />} />
      <Route path={Path.Cruises} element={<CruisesPage />} />
      <Route path={Path.CruiseForm} element={<CruiseFormPage />} />
      <Route path={Path.MyPublications} element={<MyPublicationsPage />} />
      <Route path={Path.CruiseEffects} element={<CruiseEffectsPage />} />
    </>
  )
}
