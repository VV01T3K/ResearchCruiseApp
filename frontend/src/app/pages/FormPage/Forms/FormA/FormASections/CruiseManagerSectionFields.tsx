import { useContext, useEffect } from "react"
import UserSelect from "../../../Inputs/UserSelect"
import FormYearSelect from "../../../Inputs/FormYearSelect"
import { cruiseManagerSectionFieldNames } from "./CruiseManagerSection"
import { FormContext } from "@contexts/FormContext"

import { ErrorMessageIfPresentNoContext } from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext"
import userDataManager from "../../../../../../ToBeMoved/CommonComponents/UserDataManager"
import { EmptyFunction } from "@consts/EmptyFunction"
import { FormAInitValues } from "FormAInitValues"
import { EMPTY_GUID } from "@consts/emptyGuid"

export const CruiseManagerField = () => {
  const formContext = useContext(FormContext)
  const user = userDataManager()
  return (
    <UserSelect
      defaultValue={user.userData?.id ?? EMPTY_GUID}
      className="three-fields-beside-md"
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
      className="three-fields-beside-md"
      fieldName={cruiseManagerSectionFieldNames.deputyManagerId}
      fieldLabel="Zastępca"
      initValues={(formContext!.initValues as FormAInitValues)?.deputyManagers}
    />
  )
}
export const YearField = () => {
  const formContext = useContext(FormContext)
  return (
    <FormYearSelect
      className="three-fields-beside-md"
      fieldName={cruiseManagerSectionFieldNames.year}
      fieldLabel="Rok rejsu"
      initValues={(formContext!.initValues as FormAInitValues)?.years}
    />
  )
}

export const cruiseManagerSameAsDeputyErrName = "cruiseManagerIsTheSameAsDeputyManager"
export const cruiseManagerNorDeputyIsCurrentUserErrName = "cruiseManagerNorDeputyIsCurrentUser"

const CruiseAndDeputyManagerExtraValidation = () => {
  const formContext = useContext(FormContext)
  const { userData } = userDataManager()

  const cruiseManagerId = cruiseManagerSectionFieldNames.cruiseManagerId
  const cruiseManager = formContext!.getValues(cruiseManagerId)
  const deputyManager = formContext!.getValues(cruiseManagerSectionFieldNames.deputyManagerId)

  const cruiseManagerSameAsDeputyError =
    formContext?.formState.errors[cruiseManagerSameAsDeputyErrName]
  const cruiseManagerNorDeputyIsCurrentUserErr =
    formContext?.formState.errors[cruiseManagerNorDeputyIsCurrentUserErrName]

  return {
    validation: !formContext!.readOnly
      ? () => {
          const areFieldsEqual = cruiseManager === deputyManager

          if (cruiseManager && deputyManager && areFieldsEqual && !cruiseManagerSameAsDeputyError) {
            formContext!.setError(cruiseManagerSameAsDeputyErrName, {
              type: "custom",
              message: "Kierownik i jego zastępca muszą być innymi osobami.",
            })
          } else {
            if (!areFieldsEqual && cruiseManagerSameAsDeputyError) {
              formContext!.clearErrors(cruiseManagerSameAsDeputyErrName)
            }
          }

          const isCruiseOrDeputyCurrentUser =
            cruiseManager === userData?.id || deputyManager === userData?.id

          if (
            cruiseManager &&
            deputyManager &&
            !isCruiseOrDeputyCurrentUser &&
            !cruiseManagerNorDeputyIsCurrentUserErr
          ) {
            formContext!.setError(cruiseManagerNorDeputyIsCurrentUserErrName, {
              type: "custom",
              message: "Musisz zadeklarować się jako kierownik albo zastepca.",
            })
          } else {
            if (isCruiseOrDeputyCurrentUser && cruiseManagerNorDeputyIsCurrentUserErr) {
              formContext!.clearErrors(cruiseManagerNorDeputyIsCurrentUserErrName)
            }
          }
        }
      : EmptyFunction,
    ErrorMessage: () => (
      <>
        <ErrorMessageIfPresentNoContext
          message={cruiseManagerSameAsDeputyError?.message as string}
        />
        <ErrorMessageIfPresentNoContext
          message={cruiseManagerNorDeputyIsCurrentUserErr?.message as string}
        />
      </>
    ),
  }
}

export const CruiseAndDeputyManager = () => {
  const formContext = useContext(FormContext)
  const { validation, ErrorMessage } = CruiseAndDeputyManagerExtraValidation()

  useEffect(validation, [formContext])

  return (
    <>
      <div className={"d-flex flex-row flex-wrap w-100"}>
        <CruiseManagerField />
        <DeputyManagerField />
        <YearField />
      </div>
      <ErrorMessage />
    </>
  )
}
