import { FormUser } from "FormUser"
import { CruiseApplication } from "CruiseApplication"

export const ApplicationToCruiseManagersMap = (cruiseApplication: CruiseApplication) => ({
  id: cruiseApplication.cruiseManagerId,
  email: cruiseApplication.cruiseManagerEmail,
  firstName: cruiseApplication.cruiseManagerFirstName,
  lastName: cruiseApplication.cruiseManagerLastName,
})

export const ApplicationToDeputyManagersMap = (cruiseApplication: CruiseApplication) => ({
  id: cruiseApplication.deputyManagerId,
  email: cruiseApplication.deputyManagerEmail,
  firstName: cruiseApplication.deputyManagerFirstName,
  lastName: cruiseApplication.deputyManagerLastName,
})

export const ApplicationToCruiseManagersMapper = (cruiseApplication: CruiseApplication) => {
  const cruiseManager: FormUser = ApplicationToCruiseManagersMap(cruiseApplication)
  const deputyManager: FormUser = ApplicationToDeputyManagersMap(cruiseApplication)
  return [cruiseManager, deputyManager]
}
