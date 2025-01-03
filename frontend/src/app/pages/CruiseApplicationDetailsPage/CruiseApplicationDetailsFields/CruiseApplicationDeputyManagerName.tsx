import { SimpleInfoWrapperTwoFieldsCruiseApplication } from "../SimpleInfoWrapper/SimpleInfoWrapperTwoFieldsCruiseApplication"

export const CruiseApplicationDeputyManagerName = () => (
  <SimpleInfoWrapperTwoFieldsCruiseApplication
    title={"Zastępca kierownika"}
    firstSelector={"deputyManagerFirstName"}
    secondSelector={"deputyManagerLastName"}
  />
)
