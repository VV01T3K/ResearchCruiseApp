import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import ListWithCheckbox from "@app/pages/FormPage/Inputs/ListWithCheckbox"
import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import { Guid } from "Guid"
import { FormBInitValues } from "FormBInitValues"

export const shipEquipmentSectionFieldNames = {
  shipEquipments: "shipEquipmentsIds",
}

export type ShipEquipment = {
  id: Guid
  name: string
}

const ShipEquipmentsField = () => {
  const formContext = useContext(FormContext)
  return (
    <ListWithCheckbox
      className={"single-field"}
      fieldName={shipEquipmentSectionFieldNames.shipEquipments}
      fieldLabel={"Elementy techniczne"}
      initValues={(formContext!.initValues as FormBInitValues)?.shipEquipments}
    />
  )
}
export const ShipEquipmentSection = () =>
  SectionWrapper({
    shortTitle: "E. techniczne",
    longTitle: "Elementy techniczne statku wykorzystywane podczas rejsu",
    sectionFieldNames: shipEquipmentSectionFieldNames,
    children: (
      <>
        <ShipEquipmentsField />

        {/*<TechnicalElementsTable*/}
        {/*    className={'single-field'}*/}
        {/*    fieldName={technicalElementsSectionFieldNames.technicalElements}*/}
        {/*    fieldLabel={'Elementy techniczne'}*/}
        {/*/>*/}
      </>
    ),
  })
