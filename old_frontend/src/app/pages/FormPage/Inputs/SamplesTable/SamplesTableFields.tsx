import { FTextField } from "@app/pages/FormPage/Inputs/CellFormFields"
import { KeyContext } from "@contexts/KeyContext"

export const TypeField = () => {
  return (
    <KeyContext.Provider value={"type"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Rodzaj próbki</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const AmountField = () => {
  return (
    <KeyContext.Provider value={"amount"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Ilość / liczba</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const AnalysisField = () => {
  return (
    <KeyContext.Provider value={"analysis"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Analiza na zebranym materiale</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const PublishingField = () => {
  return (
    <KeyContext.Provider value={"publishing"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Upublicznienie danych</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}
