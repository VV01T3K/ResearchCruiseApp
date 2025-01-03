import { SimpleInfoWrapperTwoFieldsCruiseApplication } from "../SimpleInfoWrapper/SimpleInfoWrapperTwoFieldsCruiseApplication"

export const CruiseApplicationCruiseManagerName = () => (
  <SimpleInfoWrapperTwoFieldsCruiseApplication
    title={"Kierownik"}
    firstSelector={"cruiseManagerFirstName"}
    secondSelector={"cruiseManagerLastName"}
  />
)
