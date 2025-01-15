import FormTemplate from "../FormPage/Wrappers/FormTemplate"
import {
  FormType,
  FormTypeKeys,
} from "../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation"
import { CruiseApplicationContext } from "@contexts/CruiseApplicationContext"
import { CruiseApplicationDetailsSections } from "./CruiseApplicationDetailsSections"
import { BottomOptionBar } from "../../../ToBeMoved/Tools/CruiseApplicationBottomOptionBar"
import cruiseApplicationFromLocation from "@hooks/cruiseApplicationFromLocation"

function CruiseApplicationDetailsPage() {
  const cruiseApplication = cruiseApplicationFromLocation()
  const sections = CruiseApplicationDetailsSections()

  return (
    <CruiseApplicationContext.Provider value={cruiseApplication}>
      <FormTemplate
        type={FormType.ApplicationDetails as FormTypeKeys}
        sections={sections}
        BottomOptionBar={BottomOptionBar}
      />
    </CruiseApplicationContext.Provider>
  )
}

export default CruiseApplicationDetailsPage
