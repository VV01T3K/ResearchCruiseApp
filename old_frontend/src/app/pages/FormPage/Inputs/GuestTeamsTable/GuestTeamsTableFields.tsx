import { FIntField, FTextField } from "../CellFormFields"
import { KeyContext } from "@contexts/KeyContext"

export const InstitutionField = () => (
  <KeyContext.Provider value={"name"}>
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>Nazwa</label>
      <FTextField />
    </div>
  </KeyContext.Provider>
)

export const NoOfPersonsField = () => (
  <KeyContext.Provider value={"noOfPersons"}>
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>Liczba osób</label>
      <FIntField />
    </div>
  </KeyContext.Provider>
)
