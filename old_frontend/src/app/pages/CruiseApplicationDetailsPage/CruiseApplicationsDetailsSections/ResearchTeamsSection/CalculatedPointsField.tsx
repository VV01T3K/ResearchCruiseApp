import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import NumberInput from "../../../FormPage/Inputs/NumberInput"
import { researchTeamsSectionFieldNames } from "./ResearchTeamsSectionFieldNames"
import { CruiseApplicationDetailsFormInitValues } from "CruiseApplicationDetailsFormInitValues"

export const CalculatedPointsField = () => {
  const formContext = useContext(FormContext)
  return (
    <NumberInput
      className="two-fields-beside-md"
      fieldName={researchTeamsSectionFieldNames.newPoints}
      fieldLabel="Punkty"
      defaultValue={
        (formContext!.initValues as CruiseApplicationDetailsFormInitValues)?.ugUnitsPoints
      }
    />
  )
}
