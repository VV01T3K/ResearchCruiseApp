import { NewUserFormValues } from "NewUserFormValues"
import { Role } from "Role"

export const newUserFormDefaultValues: NewUserFormValues = {
  role: Role.CruiseManager,
  email: "",
  firstName: "",
  lastName: "",
}
