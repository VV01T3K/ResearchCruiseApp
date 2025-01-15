import { permissionsSectionFieldNames } from "@app/pages/FormPage/Forms/FormA/FormASections/PermissionsSection"
import PermissionsTableWithScan from "@app/pages/FormPage/Inputs/PermissionsTable/PermissionsTableWithScan"

export const PermissionsField = () => {
  return (
    <PermissionsTableWithScan
      className="single-field"
      fieldLabel=""
      fieldName={permissionsSectionFieldNames.permissions}
    />
  )
}
