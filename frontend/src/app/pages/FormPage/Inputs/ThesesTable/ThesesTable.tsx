import { useContext } from "react"
import { FieldValues } from "react-hook-form"
import { BottomMenuWithHistory, OrdinalNumber, RemoveRowButton } from "../TableParts"
import { FieldProps } from "../FormRadio"
import FieldWrapper from "../FieldWrapper"
import { FDateFieldOnlyYear, FSelectField, FTextField } from "../CellFormFields"
import { FieldContextWrapper } from "../PermissionsTable/PermissionsTable"
import { FormContext } from "@contexts/FormContext"
import { KeyContext } from "@contexts/KeyContext"
import { FieldTableWrapper } from "../../Wrappers/FieldTableWrapper"

export type Publication = {
  category: string
  doi: string
  authors: string
  title: string
  magazine: string
  year: number
  ministerialPoints: number
}

export type Thesis = {
  category: string
  author: string
  title: string
  promoter: string
  year: number
}

const thesisCategories = ["bachelor", "master", "doctor"]

const thesisCategoriesPL = ["Licencjacka", "Magisterska", "Doktorska"]

const thesisDefaultValues = [
  {
    category: "bachelor",
    author: "",
    title: "",
    promoter: "",
    year: "",
  },
  {
    category: "master",
    author: "",
    title: "",
    promoter: "",
    year: "",
  },
  {
    category: "doctor",
    author: "",
    title: "",
    promoter: "",
    year: "",
  },
]

const thesisOptions = thesisCategoriesPL.map((category, index) => ({
  label: category,
  value: thesisDefaultValues[index],
}))

export const CategoryPicker = () => {
  const thesisCategoryOptions = thesisCategories.map((category, index) => ({
    label: thesisCategoriesPL[index],
    value: category,
  }))

  return (
    <KeyContext.Provider value={"category"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Kategoria</label>
        <FSelectField options={thesisCategoryOptions} />
      </div>
    </KeyContext.Provider>
  )
}

export const AuthorField = () => {
  return (
    <KeyContext.Provider value={"author"}>
      <div className={"task-field-input col-md-6"}>
        <label>Autorzy</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const TitleField = () => {
  return (
    <KeyContext.Provider value={"title"}>
      <div className={"task-field-input col-md-6"}>
        <label>Tytuł</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const PromoterField = () => {
  return (
    <KeyContext.Provider value={"promoter"}>
      <div className={"task-field-input col-md-6"}>
        <label>Promotor</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const YearField = () => {
  return (
    <KeyContext.Provider value={"year"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Rok obrony</label>
        <FDateFieldOnlyYear />
      </div>
    </KeyContext.Provider>
  )
}

const InformationsColumn = () => (
  <div className={"w-100 d-flex flex-row flex-wrap"}>
    <AuthorField />
    <TitleField />
    <PromoterField />
  </div>
)

const ThesesTableContent = () => [
  () => <OrdinalNumber label={"Praca"} />,
  CategoryPicker,
  InformationsColumn,
  YearField,
  RemoveRowButton,
]

type ThesesTableProps = FieldProps & { historicalTheses?: Thesis[] }

const ThesisRowLabel = (row: Thesis) =>
  `Autor: ${row.author}\n
    Tytuł: ${row.title}\n
    Promotor: ${row.promoter}\n
    Rok obrony: ${row.year}`

export const ThesesTable = (props: ThesesTableProps) => {
  const formContext = useContext(FormContext)

  const FilteredHistoricalTheses = (category: string) =>
    props.historicalTheses
      ?.filter((row) => row.category == category)
      .map((row: Thesis) => ({
        label: ThesisRowLabel(row),
        value: row,
      })) ?? []

  const selectOptions =
    thesisCategories.map((thesisCategory, index) => ({
      label: thesisCategoriesPL[index],
      options: FilteredHistoricalTheses(thesisCategory),
    })) ?? []

  const mdColWidths = [5, 20, 55, 15, 5]
  const mdColTitles = ["Lp.", "Kategoria", "Informacje", "Rok obrony", ""]
  const colTitle = "Prace"
  const bottomMenu = (
    <BottomMenuWithHistory newOptions={thesisOptions} historicalOptions={selectOptions} />
  )
  const emptyText = "Nie dodano żadnej pracy"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    ThesesTableContent,
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
        notEmptyArray: (value: FieldValues) => {
          if (
            value.some((row: Publication) => {
              return Object.values(row).some((field) => {
                return !field
              })
            })
          ) {
            return "Wypełnij wszystkie pola"
          }
        },
      },
    },
    render: FieldContextWrapper(Render),
  }

  return <FieldWrapper {...fieldProps} />
}
