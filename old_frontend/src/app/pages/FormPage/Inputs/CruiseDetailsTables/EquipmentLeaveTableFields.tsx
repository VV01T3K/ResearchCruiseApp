import { equipmentLeaveActions, equipmentLeaveActionsPL } from "./EquipmentLeaveTable"
import { FSelectField, FTextField } from "@app/pages/FormPage/Inputs/CellFormFields"
import { KeyContext } from "@contexts/KeyContext"

export const ActionPicker = () => {
  const equipmentLeaveActionOptions = equipmentLeaveActions.map((action, index) => ({
    label: equipmentLeaveActionsPL[index],
    value: action,
  }))

  return (
    <KeyContext.Provider value={"action"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Czynność</label>
        <FSelectField options={equipmentLeaveActionOptions} />
      </div>
    </KeyContext.Provider>
  )
}

export const TimeField = () => {
  return (
    <KeyContext.Provider value={"duration"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Czas (pora dnia, przedział czasu itp.)</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}

export const NameField = () => {
  return (
    <KeyContext.Provider value={"name"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Nazwa sprzętu</label>
        <FTextField />
      </div>
    </KeyContext.Provider>
  )
}
