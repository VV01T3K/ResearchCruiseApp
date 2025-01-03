import { extendedUseLocation } from "@hooks/extendedUseLocation"

export const cruiseApplicationIdFromLocation = () => {
  const location = extendedUseLocation()
  return location?.state?.cruiseApplicationId
}
