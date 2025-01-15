import { FieldProps } from "@app/pages/FormPage/Inputs/FormRadio"
import { useContext } from "react"
import {
  BottomMenuWithAddButton,
  OrdinalNumber,
  RemoveRowButton,
} from "@app/pages/FormPage/Inputs/TableParts"
import { FieldValues } from "react-hook-form"
import { SingleValue } from "react-select"
import { FieldTableWrapper } from "@app/pages/FormPage/Wrappers/FieldTableWrapper"
import { FormContext } from "@contexts/FormContext"
import { FieldContext } from "@contexts/FieldContext"
import FieldWrapper from "@app/pages/FormPage/Inputs/FieldWrapper"
import { samplesDefault } from "@helpers/samplesDeafult"
import { CollectedSample } from "Sample"
import {
  AmountField,
  AnalysisField,
  PublishingField,
  TypeField,
} from "@app/pages/FormPage/Inputs/SamplesTable/SamplesTableFields"

type SamplesProps = FieldProps

const samplesTableContent = () => {
  return [
    () => <OrdinalNumber label={"Próbka"} />,
    TypeField,
    AmountField,
    AnalysisField,
    PublishingField,
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

function SamplesTable(props: SamplesProps) {
  const formContext = useContext(FormContext)

  const mdColWidths = [5, 23, 12, 33, 22, 5]
  const mdColTitles = [
    "Lp.",
    "Rodzaj materiału badawczego / próbek / danych",
    "Ilość / liczba",
    "Analizy na zebranym materiale badawczym przeprowadzone podczas rejsu lub do przeprowadzenia po rejsie",
    "Czy dane upubliczniono (jeśli tak, to w jaki sposób, czy przesłano je np. do BHMW)",
    "",
  ]
  const colTitle = "Rodzaje danych, próbek, materiału badawczego"
  const bottomMenu = <BottomMenuWithAddButton newOption={samplesDefault as SingleValue<any>} />
  const emptyText = "Nie dodano żadnego materiału"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    samplesTableContent,
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
        nameNeeded: (value: CollectedSample[]) =>
          value.length > 0 && value.some((row) => !row.type) ? "Wpisz rodzaj próbki" : true,
      },
    },
    render: FieldContextWrapper(Render),
  }

  return <FieldWrapper {...fieldProps} />
}

export default SamplesTable
