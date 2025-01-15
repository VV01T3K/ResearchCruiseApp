import { SimpleInfoContextWrapperTwoFields } from "@components/SimpleInfoContextWrapperTwoFields"
import { CruiseApplication } from "CruiseApplication"
import { CruiseApplicationContext } from "@contexts/CruiseApplicationContext"

export const SimpleInfoWrapperTwoFieldsCruiseApplication = (props: {
  title: string
  firstSelector: keyof CruiseApplication
  secondSelector: keyof CruiseApplication
}) => (
  <SimpleInfoContextWrapperTwoFields<CruiseApplication>
    context={CruiseApplicationContext}
    {...props}
  />
)
