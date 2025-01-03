import { useContext } from "react"
import { FieldValues } from "react-hook-form"
import { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { pl } from "date-fns/locale/pl"
import "react-dropdown/style.css"
import FieldWrapper from "../FieldWrapper"
import { FieldProps } from "../FormRadio"
import { FieldContext } from "@contexts/FieldContext"
import {
  AuthorField,
  DateField,
  DidacticsDescriptionField,
  EndDateField,
  FinancingAmountField,
  FinancingApprovedField,
  InstitutionField,
  MagazineField,
  MinisterialPointsField,
  ProjectDraftTitleField,
  PublicationDraftTitleField,
  SecuredAmountField,
  StartDateField,
  TaskDescriptionField,
  TitleField,
} from "./TaskInputFields"
import {
  BottomMenuWithHistory,
  CellFormTools,
  CellTools,
  OrdinalNumber,
  RemoveRowButton,
} from "../TableParts"
import { DisplayContext } from "./EvaluatedTaskTable"
import { FormContext } from "@contexts/FormContext"
import { KeyContext } from "@contexts/KeyContext"
import { FieldTableWrapper } from "../../Wrappers/FieldTableWrapper"

registerLocale("pl", pl)

export type ResearchTask = {
  type: string
  title?: string
  magazine?: string
  author?: string
  institution?: string
  date?: string
  name?: string
  startDate?: string
  endDate?: string
  financingApproved?: string
  financingAmount?: string
  description?: string
  securedAmount?: string
  ministerialPoints?: string
}

export const taskTypes = [
  "Praca licencjacka",
  "Praca magisterska",
  "Praca doktorska",
  "Przygotowanie projektu naukowego",
  "Realizacja projektu krajowego (NCN, NCBiR, itp.)",
  "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)",
  "Realizacja projektu wewnętrznego UG",
  "Realizacja innego projektu naukowego",
  "Realizacja projektu komercyjnego",
  "Dydaktyka",
  "Realizacja własnego zadania badawczego",
  "Inne zadanie",
]

export const taskTypesDefaultValues: ResearchTask[] = [
  { type: "0", author: "", title: "" },
  { type: "1", author: "", title: "" },
  { type: "2", author: "", title: "" },
  { type: "3", title: "", date: "", financingApproved: "false" },
  {
    type: "4",
    title: "",
    financingAmount: "0.00",
    startDate: "",
    endDate: "",
    securedAmount: "0.00",
  },
  {
    type: "5",
    title: "",
    financingAmount: "0.00",
    startDate: "",
    endDate: "",
    securedAmount: "0.00",
  },
  {
    type: "6",
    title: "",
    financingAmount: "0.00",
    startDate: "",
    endDate: "",
    securedAmount: "0.00",
  },
  {
    type: "7",
    title: "",
    financingAmount: "0.00",
    startDate: "",
    endDate: "",
    securedAmount: "0.00",
  },
  {
    type: "8",
    title: "",
    financingAmount: "0.00",
    startDate: "",
    endDate: "",
    securedAmount: "0.00",
  },
  { type: "9", description: "" },
  { type: "10", title: "", date: "", magazine: "", ministerialPoints: "0" },
  { type: "11", description: "" },
]
const taskTypeOptions = () => {
  return taskTypes.map((taskLabel, index) => ({
    label: taskLabel,
    value: taskTypesDefaultValues[index],
  }))
}

export const FieldForKey = () => {
  const displayContext = useContext(DisplayContext)
  const { rowValue } = displayContext ? CellTools() : CellFormTools()
  const keyContext = useContext(KeyContext)

  switch (keyContext) {
    case "author":
      return <AuthorField />
    case "title":
      if (rowValue.type == 10) {
        return <PublicationDraftTitleField />
      }
      if (rowValue.type == 3) {
        return <ProjectDraftTitleField />
      }
      return <TitleField />
    case "magazine":
      return <MagazineField />
    case "institution":
      return <InstitutionField />
    case "date":
      return <DateField />
    case "startDate":
      return <StartDateField />
    case "endDate":
      return <EndDateField />
    case "financingAmount":
      return <FinancingAmountField />
    case "securedAmount":
      return <SecuredAmountField />
    case "financingApproved":
      return <FinancingApprovedField />
    case "description":
      if (rowValue.type == 9) {
        return <DidacticsDescriptionField />
      } else {
        if (rowValue.type == 11) {
          return <TaskDescriptionField />
        } else {
          return <></>
        }
      }
    case "ministerialPoints":
      return <MinisterialPointsField />
    default:
      return <></>
  }
}

const FieldsCell = () => {
  const { rowValue } = CellFormTools()
  return (
    <div className="d-flex flex-wrap flex-row justify-content-center align-items-center w-100">
      {rowValue &&
        rowValue.type &&
        Object.keys(taskTypesDefaultValues[rowValue.type]).map((key, index) => (
          <KeyContext.Provider value={key} key={index}>
            {key != "type" && <FieldForKey />}
          </KeyContext.Provider>
        ))}
    </div>
  )
}

const TaskTypeLabel = () => {
  const { rowValue } = CellFormTools()
  return <>{rowValue && taskTypes[Number(rowValue.type)]}</>
}

const taskTableContent = () => [
  () => <OrdinalNumber label={"Zadanie"} />,
  TaskTypeLabel,
  FieldsCell,
  RemoveRowButton,
]

type TaskTableProps = FieldProps & { historicalTasks?: ResearchTask[] }

const dateOptions: Intl.DateTimeFormatOptions = {
  month: "2-digit",
  year: "numeric",
}

const TaskRowLabel = (row: ResearchTask) =>
  (row.author ? "Autor: " + row.author + ", " : "") +
  (row.title ? "Tytuł: " + row.title + ", " : "") +
  (row.institution ? "Instytucja: " + row.institution + ", " : "") +
  (row.date ? "Data: " + new Date(row.date).toLocaleDateString("pl-PL") + ", " : "") +
  (row.startDate
    ? "od: " + new Date(row.startDate).toLocaleDateString("pl-PL", dateOptions) + ", "
    : "") +
  (row.endDate
    ? "do: " + new Date(row.endDate).toLocaleDateString("pl-PL", dateOptions) + ", "
    : "") +
  (row.financingAmount ? "Kwota: " + row.financingAmount + " zł, " : "") +
  (row.description ? "Opis: " + row.description + ", " : "")

export const TasksTable = (props: TaskTableProps) => {
  const formContext = useContext(FormContext)

  const FilteredHistoricalTasks = (index: number) =>
    props.historicalTasks
      ?.filter((row) => Number(row.type) == index)
      .map((row: ResearchTask) => ({
        label: TaskRowLabel(row),
        value: row,
      })) ?? []

  const selectOptions = () => {
    return (
      taskTypes.map((taskType, index) => ({
        label: taskType,
        options: FilteredHistoricalTasks(index),
      })) ?? []
    )
  }

  const mdColWidths = [5, 20, 70, 5]
  const mdColTitles = ["Lp.", "Zadanie", "Szczegóły", ""]
  const colTitle = "Zadania"
  const bottomMenu = (
    <BottomMenuWithHistory newOptions={taskTypeOptions()} historicalOptions={selectOptions()} />
  )
  const emptyText = "Nie dodano żadnego zadania"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    taskTableContent,
    bottomMenu,
    emptyText,
    formContext!.getValues(props.fieldName)
  )

  const fieldProps = {
    ...props,
    defaultValue: [],
    rules: {
      required: "Pole wymagane",
      validate: {
        notEmptyArray: (value: FieldValues) => {
          if (
            value.some((row: ResearchTask) => {
              return Object.keys(taskTypesDefaultValues[Number(row.type)]).some((key) => {
                return key == "type"
                  ? false
                  : row[key as keyof ResearchTask] == "" ||
                      row[key as keyof ResearchTask] == undefined
              })
            })
          ) {
            return "Wypełnij wszystkie pola"
          }
        },
      },
    },
    render: ({ field }: FieldValues) => {
      return (
        <FieldContext.Provider value={field}>
          <Render />
        </FieldContext.Provider>
      )
    },
  }

  return <FieldWrapper {...fieldProps} />
}
