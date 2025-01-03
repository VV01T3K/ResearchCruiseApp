import { cruiseDetailsSectionFieldNames } from "@app/pages/FormPage/Forms/FormB/FormBSections/CruiseDetailsSection"
import ShortResearchEquipmentTable from "@app/pages/FormPage/Inputs/CruiseDetailsTables/ShortResearchEquipmentTable"
import EquipmentLeaveTable from "@app/pages/FormPage/Inputs/CruiseDetailsTables/EquipmentLeaveTable"
import PortTable from "@app/pages/FormPage/Inputs/CruiseDetailsTables/PortTable"
import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import { FormBInitValues } from "FormBInitValues"

export const CruiseDetailsDescription = () => (
  <h5 className={`pb-0 p-4 col-12 text-center`}>Czy w ramach rejsu planuje się:</h5>
)

export const EquipmentOutsideField = () => {
  const formContext = useContext(FormContext)
  return (
    <ShortResearchEquipmentTable
      className="single-field"
      fieldLabel="Wystawienie sprzętu"
      fieldName={cruiseDetailsSectionFieldNames.shortResearchEquipments}
      historicalEquipmentOutside={
        (formContext!.initValues as FormBInitValues)?.historicalEquipmentOutside
      }
    />
  )
}

export const EquipmentLeaveField = () => {
  return (
    <EquipmentLeaveTable
      className="single-field"
      fieldLabel="Pozostawienie lub zabranie sprzętu"
      fieldName={cruiseDetailsSectionFieldNames.longResearchEquipments}
    />
  )
}

export const PortLeaveField = () => {
  return (
    <PortTable
      className="single-field"
      fieldLabel="Wchodzenie lub wychodzenie z portu"
      fieldName={cruiseDetailsSectionFieldNames.ports}
    />
  )
}
