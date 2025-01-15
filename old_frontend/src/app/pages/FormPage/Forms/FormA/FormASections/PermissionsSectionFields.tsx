import { permissionsSectionFieldNames } from "./PermissionsSection"
import PermissionsTable from "../../../Inputs/PermissionsTable/PermissionsTable"

export const PermissionsField = () => {
  return (
    <PermissionsTable
      className="single-field"
      fieldLabel=""
      fieldName={permissionsSectionFieldNames.permissions}
    />
  )
}
