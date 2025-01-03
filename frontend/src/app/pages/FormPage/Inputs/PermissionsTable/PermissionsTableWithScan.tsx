import {
  BottomMenuWithAddButton,
  OrdinalNumber,
  RemoveRowButton,
} from "@app/pages/FormPage/Inputs/TableParts"
import {
  DescriptionField,
  ExecutiveField,
} from "@app/pages/FormPage/Inputs/PermissionsTable/PermissionsTableFields"
import React, { useContext } from "react"
import { FieldValues } from "react-hook-form"
import { FieldContext } from "@contexts/FieldContext"
import { FormContext } from "@contexts/FormContext"
import { SingleValue } from "react-select"
import { FieldTableWrapper } from "@app/pages/FormPage/Wrappers/FieldTableWrapper"
import { notEmptyArray } from "@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable"
import FieldWrapper from "@app/pages/FormPage/Inputs/FieldWrapper"
import {
  permissionDefaultWithScan,
  PermissionWithScan,
} from "@app/pages/FormPage/Inputs/PermissionsTable/PermissionsTable"
import { FormField } from "@app/pages/FormPage/Inputs/FormYearSelect"
import {
  DownloadField,
  UploadField,
} from "@app/pages/FormPage/Inputs/ContractsTable/ContractTableFields"
import { fileExists } from "@app/pages/FormPage/Inputs/ContractsTable/ContractsTable"

const guestTeamsTableContent = () => {
  const formContext = useContext(FormContext)
  return [
    () => <OrdinalNumber label={"Pozwolenie"} />,
    DescriptionField,
    ExecutiveField,
    formContext?.readOnly ? DownloadField : UploadField,
    RemoveRowButton,
  ]
}

export const FieldContextWrapper =
  (Render: React.JSXElementConstructor<any>) =>
  ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
      <Render />
    </FieldContext.Provider>
  )

type Props = FormField

function PermissionsTableWithScan(props: Props) {
  const formContext = useContext(FormContext)

  const mdColWidths = [10, 40, 30, 15, 5]
  const mdColTitles = ["Lp.", "Treść pozwolenia", "Organ wydający pozwolenie", "Skan", ""]
  const colTitle = "Pozwolenia"
  const bottomMenu = (
    <BottomMenuWithAddButton newOption={permissionDefaultWithScan as SingleValue<any>} />
  )
  const emptyText = "Nie dodano żadnego pozwolenia"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    guestTeamsTableContent,
    bottomMenu,
    emptyText,
    formContext!.getValues(props.fieldName)
  )

  const fieldProps = {
    ...props,
    defaultValue: [],
    rules: {
      required: false,
      validate: {
        notEmptyArray: notEmptyArray<PermissionWithScan>,
        fileExists: fileExists,
      },
    },
    render: FieldContextWrapper(Render),
  }

  return <FieldWrapper {...fieldProps} />
}

export default PermissionsTableWithScan
