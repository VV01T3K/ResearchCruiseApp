import { useEffect, useState } from "react"
import cruiseApplicationFromLocation from "@hooks/cruiseApplicationFromLocation"
import { CruiseApplicationContext } from "@contexts/CruiseApplicationContext"
import { CruiseContext } from "@contexts/CruiseContext"
import { Cruise } from "Cruise"
import { getCruiseForCruiseApplication } from "@api/requests"
import { EmptyFunction } from "@consts/EmptyFunction"
import FormTemplate from "@app/pages/FormPage/Wrappers/FormTemplate"
import { FormCSections } from "@app/pages/FormPage/Forms/FormC/FormCSections"

function FormC() {
  const sections = FormCSections()

  const [cruise, setCruise] = useState<Cruise | undefined>(undefined)

  const cruiseApplication = cruiseApplicationFromLocation()
  useEffect(() => {
    if (cruiseApplication?.id && !cruise) {
      getCruiseForCruiseApplication(cruiseApplication.id).then((response) =>
        response ? setCruise(response?.data) : EmptyFunction
      )
    }
  }, [cruiseApplication])

  return (
    <CruiseApplicationContext.Provider value={cruiseApplication}>
      <CruiseContext.Provider value={cruise}>
        <FormTemplate sections={sections} type="C" />
      </CruiseContext.Provider>
    </CruiseApplicationContext.Provider>
  )
}

export default FormC
