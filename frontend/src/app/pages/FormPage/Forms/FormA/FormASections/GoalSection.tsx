import { CruiseGoalDescriptionField, CruiseGoalField } from "./GoalSectionFields"
import { SectionWrapper } from "@components/Form/Section/SectionWrapper"

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
      <>
        <CruiseGoalField />
        <CruiseGoalDescriptionField />
      </>
    ),
  })
