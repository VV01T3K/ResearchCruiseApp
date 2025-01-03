import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import EvaluatedPublicationsTable from "../../../FormPage/Inputs/PublicationsTable/EvaluatedPublicationsTable"
import { PublicationsSectionFieldNames } from "./PublicationsSectionFieldNames"
import { CruiseApplicationDetailsFormInitValues } from "CruiseApplicationDetailsFormInitValues"

export const PublicationsField = () => {
  const formContext = useContext(FormContext)
  return (
    <EvaluatedPublicationsTable
      fieldLabel={""}
      className={"single-field"}
      fieldName={PublicationsSectionFieldNames.publications}
      evaluatedPublications={
        (formContext!.initValues as CruiseApplicationDetailsFormInitValues)?.formAPublications
      }
    />
  )
}
