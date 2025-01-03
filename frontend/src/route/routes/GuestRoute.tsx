import { Route } from "react-router-dom"
import { Path } from "../../ToBeMoved/Tools/Path"
import FormPage from "@app/pages/FormPage/FormPage"
import CruiseApplicationsPage from "@app/pages/CruiseApplicationsPage/CruiseApplicationsPage"
import CruiseApplicationDetailsPage from "@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage"
import CruisesPage from "@app/pages/CruisesPage/CruisesPage"
import CruiseFormPage from "@app/pages/CruiseFormPage/CruiseFormPage"
import GuestPanel from "@app/pages/HomePage/Guest/GuestPanel"

export const GuestRoute = () => {
  return (
    <>
      {/*<Route path={Path.Messages} element={<MessagesPage />} />*/}
      <Route path={Path.Form} element={<FormPage />} />
      <Route path={Path.CruiseApplications} element={<CruiseApplicationsPage />} />
      <Route path={Path.CruiseApplicationDetails} element={<CruiseApplicationDetailsPage />} />
      <Route path={Path.Cruises} element={<CruisesPage />} />
      <Route path={Path.CruiseForm} element={<CruiseFormPage />} />
      <Route path={Path.Any} element={<GuestPanel />} />
    </>
  )
}
