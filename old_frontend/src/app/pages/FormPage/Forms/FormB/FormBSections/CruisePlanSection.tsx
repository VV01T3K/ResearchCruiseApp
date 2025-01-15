import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import DetailedPlanTable from "@app/pages/FormPage/Inputs/DetailedPlanTable/DetailedPlanTable"

export const cruisePlanSectionFieldNames = {
  cruiseDaysDetails: "cruiseDaysDetails",
}

export const CruisePlanSection = () =>
  SectionWrapper({
    shortTitle: "Plan",
    longTitle: "Szczegółowy plan zadań do realizacji podczas rejsu",
    sectionFieldNames: cruisePlanSectionFieldNames,
    children: (
      <>
        <DetailedPlanTable
          fieldName={cruisePlanSectionFieldNames.cruiseDaysDetails}
          className={"single-field"}
          fieldLabel={"Szczegółowy plan rejsu"}
        />
      </>
    ),
  })
