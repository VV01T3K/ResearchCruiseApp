import PublicationsTable from "../../../Inputs/PublicationsTable/PublicationsTable"
import { useContext } from "react"
import { publicationsSectionFieldNames } from "./PublicationsSection"
import { FormContext } from "@contexts/FormContext"
import { FormAInitValues } from "FormAInitValues"

export const PublicationsDescription = () => (
  <div className={"p-4 pb-0 text-center"}>
    <h5 className={"text-center"}>
      Publikacje kategorii <strong>temat</strong>
    </h5>
    <p>
      Publikacje z ubiegłych 5 lat związane <strong>bezpośrednio </strong>
      tematycznie z zadaniami do realizacji na planowanym rejsie{" "}
      <strong>opublikowane przez zespół zaangażowany w realizację rejsu – z afiliacją UG.</strong>
    </p>
    <h5 className={"text-center"}>
      Publikacje kategorii <strong>dopisek</strong>
    </h5>
    <p>
      Publikacje autorstwa zespołu zaangażowanego w realizację rejsu, ALE zawierające dopisek w
      treści publikacji (w wersji angielskiej lub w innym języku):{" "}
      <strong>
        „…the research/study was conducted onboard r/v Oceanograf (the research vessel owned by the
        University of Gdańsk)…”
      </strong>{" "}
      lub{" "}
      <strong>
        „… samples for the present study were collected during a research cruise onboard r/v
        Oceanograf…”{" "}
      </strong>
      lub podobny, ale wskazujący jednoznacznie, że badania w ramach niniejszej publikacji były
      prowadzone z pokładu jednostki RV Oceanograf.
    </p>
  </div>
)

export const PublicationsField = () => {
  const formContext = useContext(FormContext)
  return (
    <PublicationsTable
      className={"single-field"}
      fieldName={publicationsSectionFieldNames.publications}
      historicalPublications={(formContext?.initValues as FormAInitValues)?.historicalPublications}
    />
  )
}
