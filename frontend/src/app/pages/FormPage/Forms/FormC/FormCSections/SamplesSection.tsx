import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import SamplesTable from "@app/pages/FormPage/Inputs/SamplesTable/SamplesTable"

export const samplesSectionFieldNames = {
  samples: "samples",
}

export const SamplesSection = () =>
  SectionWrapper({
    shortTitle: "Próbki",
    longTitle:
      "Rodzaj danych, próbek, materiału badawczego zebranego podczas rejsu, przeprowadzone podczas rejsu analizy",
    sectionFieldNames: samplesSectionFieldNames,
    children: (
      <>
        <SamplesTable
          className={"single-field"}
          fieldName={samplesSectionFieldNames.samples}
          fieldLabel={"Rodzaje danych, próbek, materiału badawczego"}
        />
      </>
    ),
  })
