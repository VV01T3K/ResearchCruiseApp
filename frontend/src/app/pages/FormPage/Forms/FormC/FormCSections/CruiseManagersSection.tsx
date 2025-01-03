import { cruiseFromLocation } from "@hooks/cruiseFromLocation"
import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import CruiseBasicInfo from "@app/pages/CruiseFormPage/CruiseFormSections/CruiseBasicInfo"
import BoolField from "@app/pages/FormPage/Inputs/BoolField"
import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import userDataManager from "../../../../../../ToBeMoved/CommonComponents/UserDataManager"
import UserSelect from "@app/pages/FormPage/Inputs/UserSelect"
import { FormAInitValues } from "FormAInitValues"
import ReadonlyOverrideWrapper from "@components/Form/ReadonlyOverrideWrapper"

const cruiseManagerSectionFieldNames = {
  isCruiseManagerPresent: "isCruiseManagerPresent",
  cruiseManagerId: "cruiseManagerId",
  deputyManagerId: "deputyManagerId",
}
export const BasicInfo = () => {
  const cruise = cruiseFromLocation()
  return <CruiseBasicInfo cruise={cruise} />
}

const IsCruiseManagerPresentField = () => {
  return (
    <BoolField
      fieldLabel={"Czy kierownik był obecny na rejsie?"}
      fieldName={cruiseManagerSectionFieldNames.isCruiseManagerPresent}
      defaultValue={"true"}
    />
  )
}

export const CruiseManagerField = () => {
  const formContext = useContext(FormContext)
  const user = userDataManager()
  return (
    <UserSelect
      defaultValue={user.userData?.id}
      className="two-fields-beside-md"
      fieldName={cruiseManagerSectionFieldNames.cruiseManagerId}
      fieldLabel="Kierownik rejsu"
      initValues={(formContext?.initValues as FormAInitValues)?.cruiseManagers}
    />
  )
}
export const DeputyManagerField = () => {
  const formContext = useContext(FormContext)
  return (
    <UserSelect
      className="two-fields-beside-md"
      fieldName={cruiseManagerSectionFieldNames.deputyManagerId}
      fieldLabel="Zastępca"
      initValues={(formContext!.initValues as FormAInitValues)?.deputyManagers}
    />
  )
}

export const CruiseManagersSection = () =>
  SectionWrapper({
    shortTitle: "Kierownik",
    longTitle: "Kierownik zgłaszanego rejsu",
    sectionFieldNames: cruiseManagerSectionFieldNames,
    children: (
      <>
        <ReadonlyOverrideWrapper>
          <CruiseManagerField />
          <DeputyManagerField />
        </ReadonlyOverrideWrapper>
        <IsCruiseManagerPresentField />
      </>
    ),
  })
