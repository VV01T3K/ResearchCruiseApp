import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import {
  CruiseGoalDescriptionField,
  CruiseGoalField,
} from "@app/pages/FormPage/Forms/FormA/FormASections/GoalSectionFields"
import ReadonlyOverrideWrapper from "@components/Form/ReadonlyOverrideWrapper"

export const goalSectionFieldNames = {
  cruiseGoal: "cruiseGoal",
  cruiseGoalDescription: "cruiseGoalDescription",
}

export const GoalSection = () =>
  SectionWrapper({
    shortTitle: "Cel",
    longTitle: "Cel rejsu",
    sectionFieldNames: goalSectionFieldNames,
    children: (
      <ReadonlyOverrideWrapper>
        <CruiseGoalField />
        <CruiseGoalDescriptionField />
      </ReadonlyOverrideWrapper>
    ),
  })
