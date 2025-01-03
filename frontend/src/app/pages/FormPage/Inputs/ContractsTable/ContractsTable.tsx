import { useContext } from "react"
import { FieldValues } from "react-hook-form"
import { BottomMenuWithHistory, OrdinalNumber, RemoveRowButton } from "../TableParts"
import { FieldProps } from "../FormRadio"
import { FieldTableWrapper } from "../../Wrappers/FieldTableWrapper"
import FieldWrapper from "../FieldWrapper"
import {
  CategoryPicker,
  ContractDescriptionField,
  DownloadField,
  InstitutionCell,
  UploadField,
} from "./ContractTableFields"
import { notEmptyArray } from "../PublicationsTable/PublicationsTable"
import { FieldContextWrapper } from "../PermissionsTable/PermissionsTable"
import { FormContext } from "@contexts/FormContext"

export type Contract = {
  category: string
  institutionName: string
  institutionUnit: string
  institutionLocalization: string
  description: string
  scan: {
    name: string
    content: string
  }
}

export const contractCategories = ["domestic", "international"]
export const contractCategoriesPL = ["Krajowa", "Międzynarodowa"]

const contractDefaultValues = [
  {
    category: "domestic",
    description: "",
    institutionLocalization: "",
    institutionName: "",
    institutionUnit: "",
    scan: {
      name: "",
      content: "",
    },
  },
  {
    category: "international",
    description: "",
    institutionLocalization: "",
    institutionName: "",
    institutionUnit: "",
    scan: {
      name: "",
      content: "",
    },
  },
]
export const fileExists = (value: FieldValues) =>
  value.length === 0
    ? true
    : value.some((row: Contract) => !(row.scan.name && row.scan.content))
      ? "Załącz plik"
      : true

export const contractOptions = contractCategoriesPL.map((taskLabel, index) => ({
  label: taskLabel,
  value: contractDefaultValues[index],
}))

const contractTableContent = () => {
  const formContext = useContext(FormContext)
  return [
    () => <OrdinalNumber label={"Umowa"} />,
    CategoryPicker,
    InstitutionCell,
    ContractDescriptionField,
    formContext?.readOnly ? DownloadField : UploadField,
    RemoveRowButton,
  ]
}

type ContractTableProps = FieldProps & { historicalContracts?: Contract[] }

const ContractRowLabel = (row: Contract) =>
  `${row.institutionName}, ${row.institutionUnit}, ${row.institutionLocalization}: ${row.description}`

export const ContractTable = (props: ContractTableProps) => {
  const formContext = useContext(FormContext)

  const FilteredHistoricalContracts = (category: string) =>
    props.historicalContracts
      ?.filter((row: Contract) => row.category == category)
      .map((row: Contract) => ({
        label: ContractRowLabel(row),
        value: row,
      })) ?? []

  const selectOptions =
    contractCategories.map((contractCategory, index) => ({
      label: contractCategoriesPL[index],
      options: FilteredHistoricalContracts(contractCategory),
    })) ?? []

  const mdColWidths = [5, 20, 24, 26, 20, 5]
  const mdColTitles = ["Lp.", "Kategoria", "Instytucja", "Opis", "Skan"]
  const colTitle = "Umowy"
  const bottomMenu = (
    <BottomMenuWithHistory newOptions={contractOptions} historicalOptions={selectOptions} />
  )
  const emptyText = "Nie dodano żadnej umowy"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    contractTableContent,
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
        notEmptyArray: notEmptyArray<Contract>,
        fileExists: fileExists,
      },
    },
    render: FieldContextWrapper(Render),
  }

  return <FieldWrapper {...fieldProps} />
}
