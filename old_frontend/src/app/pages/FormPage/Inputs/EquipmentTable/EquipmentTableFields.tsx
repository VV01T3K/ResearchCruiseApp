import {
  FBoolField,
  FDateFieldDayAndHour,
  FTextField,
} from "@app/pages/FormPage/Inputs/CellFormFields"
import { KeyContext } from "@contexts/KeyContext"

export const NameField = () => {
  return (
    <KeyContext.Provider value={"name"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Nazwa</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const PermissionField = () => {
  return (
    <KeyContext.Provider value={"permission"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Czy uzyskano zgodę opiekuna</label>
        <FBoolField />
      </div>
    </KeyContext.Provider>
  )
}

export const StartDateField = () => {
  return (
    <KeyContext.Provider value={"insuranceStartDate"}>
      <div className={"task-field-input col-md-6"}>
        <label>Początek</label>
        <label className={"table-field-input-label"}>ubezpieczenia (jesli ubezpieczono)</label>
        <FDateFieldDayAndHour />
      </div>
    </KeyContext.Provider>
  )
}

export const EndDateField = () => {
  return (
    <KeyContext.Provider value={"insuranceEndDate"}>
      <div className={"task-field-input col-md-6"}>
        <label>Koniec</label>
        <label className={"table-field-input-label"}>ubezpieczenia (jeśli ubezpieczono)</label>

        <FDateFieldDayAndHour />
      </div>
    </KeyContext.Provider>
  )
}

export const InsuranceColumn = () => (
  <div className={"w-100 d-flex flex-row flex-wrap"}>
    <StartDateField />
    <EndDateField />
  </div>
)
